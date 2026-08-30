export async function searchBooks(query, { page = 1, limit = 20 } = {}) {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();

  return {
    docs: data.docs,
    numFound: data.numFound,
    page,
    limit,
    totalPages: Math.ceil((data.numFound || 0) / limit),
  };
}

export async function getTrendingBooks() {
  const response = await fetch(
    "https://openlibrary.org/trending/daily.json"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch trending books");
  }

  const data = await response.json();

  return data.works.map((book) => ({
    key: book.key,
    title: book.title,
    author_name: book.author_name || [],
    cover_i: book.cover_i,
    first_publish_year: book.first_publish_year,

    // Metadata when available from Trending API
    publisher: book.publisher || [],
    language: book.language || [],
    number_of_pages_median: book.number_of_pages_median,
    cover_edition_key: book.cover_edition_key,

    // Rating
    ratings_average: book.ratings_average,
  }));
}

const EDITIONS_PAGE_SIZE = 50;
const MAX_EDITIONS_TO_SCAN = 200;

function editionHasMetadata(edition) {
  return Boolean(
    edition.publishers?.length ||
      edition.publish_date ||
      edition.number_of_pages ||
      edition.languages?.length
  );
}

// Works can have hundreds of editions (Animal Farm has 653), and the API
// does not sort them by language or completeness. Page through them,
// stopping early once we've collected enough to search through, or once
// the API runs out of editions to give us. Also captures the API's
// reported total edition count ("size"), which reflects all editions,
// not just the ones we scanned.
async function fetchEditions(workKey, maxToScan) {
  const entries = [];
  let offset = 0;
  let size = null;

  while (entries.length < maxToScan) {
    const response = await fetch(
      `https://openlibrary.org${workKey}/editions.json?limit=${EDITIONS_PAGE_SIZE}&offset=${offset}`
    );

    if (!response.ok) break;

    const data = await response.json();

    if (size === null && typeof data.size === "number") {
      size = data.size;
    }

    const batch = data.entries || [];

    entries.push(...batch);

    if (batch.length < EDITIONS_PAGE_SIZE) break;

    offset += EDITIONS_PAGE_SIZE;
  }

  return { entries, size };
}

// The search API's "ratings_average" field is not actually populated —
// ratings live on their own endpoint, keyed by work.
async function fetchRatings(workKey) {
  try {
    const response = await fetch(
      `https://openlibrary.org${workKey}/ratings.json`
    );

    if (!response.ok) return { average: null, count: null };

    const data = await response.json();

    return {
      average:
        typeof data?.summary?.average === "number"
          ? data.summary.average
          : null,
      count:
        typeof data?.summary?.count === "number"
          ? data.summary.count
          : null,
    };
  } catch (err) {
    console.error("Failed to fetch ratings", err);

    return { average: null, count: null };
  }
}

export async function getWorkDetails(
  workKey,
  { coverId, coverEditionKey } = {}
) {
  // Get work information
  const workResponse = await fetch(
    `https://openlibrary.org${workKey}.json`
  );

  if (!workResponse.ok) {
    throw new Error("Failed to fetch book details");
  }

  const work = await workResponse.json();

  let edition = null;
  let editionCount = null;
  let availableLanguages = [];
  let matchedByCover = false;

  // 1) The search result can tell us directly which edition its cover
  //    image came from (cover_edition_key) — this is the exact pairing
  //    Open Library itself used to generate cover_i, so it's authoritative
  //    and needs only a single request, no guessing required.
  if (coverEditionKey) {
    try {
      const editionResponse = await fetch(
        `https://openlibrary.org/books/${coverEditionKey}.json`
      );

      if (editionResponse.ok) {
        edition = await editionResponse.json();
        matchedByCover = true;
      }
    } catch (err) {
      console.error("Failed to fetch cover edition", err);
    }
  }

  try {
    const { entries, size } = await fetchEditions(
      workKey,
      MAX_EDITIONS_TO_SCAN
    );

    editionCount = size;

    const languageCodes = new Set();

    entries.forEach((item) => {
      item.languages?.forEach((lang) => {
        const code = lang.key?.split("/").pop();

        if (code) languageCodes.add(code);
      });
    });

    availableLanguages = Array.from(languageCodes);

    // 2) No cover_edition_key available — fall back to matching by the
    //    covers array directly. Note the same cover ID can end up
    //    attached to more than one edition in Open Library's data (e.g. a
    //    translation that inherited the work's default cover during
    //    import), so only trust this when exactly one fetched edition
    //    claims the cover. If several do, we genuinely can't tell which
    //    is correct, so we leave it unmatched rather than guess.
    if (!edition && coverId) {
      const coverMatches = entries.filter((item) =>
        item.covers?.includes(coverId)
      );

      if (coverMatches.length === 1) {
        edition = coverMatches[0];
        matchedByCover = true;
      }
    }

    // 3) Still nothing — fall back to any edition with useful metadata,
    //    for supplementary fields only (e.g. a publish date fallback).
    //    Never used for the "View in Open Library" link, since we have no
    //    evidence its cover matches what's on screen.
    if (!edition) {
      edition = entries.find(editionHasMetadata) || entries[0] || null;
    }
  } catch (err) {
    console.error("Failed to fetch editions", err);
  }

  const { average: ratingsAverage, count: ratingsCount } =
    await fetchRatings(workKey);

  return {
    ...work,
    edition,
    matchedByCover,
    editionCount,
    availableLanguages,
    ratingsAverage,
    ratingsCount,
  };
}

// Fetches one page of a work's editions, 20 at a time by default, for
// browsing the full edition list (as opposed to fetchEditions above, which
// scans many pages internally just to pick a single representative edition).
export async function getEditionsPage(
  workKey,
  { page = 1, pageSize = 20 } = {}
) {
  const offset = (page - 1) * pageSize;

  const response = await fetch(
    `https://openlibrary.org${workKey}/editions.json?limit=${pageSize}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch editions");
  }

  const data = await response.json();

  return {
    entries: data.entries || [],
    size: typeof data.size === "number" ? data.size : null,
    page,
    pageSize,
  };
}

export function coverUrl(coverId, size = "L") {
  if (!coverId) return null;

  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}