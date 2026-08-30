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
    publisher: book.publisher || [],
    language: book.language || [],
    number_of_pages_median: book.number_of_pages_median,
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

async function fetchRatings(workKey) {
  try {
    const response = await fetch(
      `https://openlibrary.org${workKey}/ratings.json`
    );

    if (!response.ok) {
      return { average: null, count: null };
    }

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

export async function getWorkDetails(workKey, { coverId } = {}) {
  const workResponse = await fetch(
    `https://openlibrary.org${workKey}.json`
  );

  if (!workResponse.ok) {
    throw new Error("Failed to fetch book details");
  }

  const work = await workResponse.json();

  let edition = null;
  let editionCount = null;

  try {
    const { entries, size } = await fetchEditions(
      workKey,
      MAX_EDITIONS_TO_SCAN
    );

    editionCount = size;

    // Match edition by cover if possible
    if (coverId) {
      const coverMatches = entries.filter((item) =>
        item.covers?.includes(coverId)
      );

      if (coverMatches.length === 1) {
        edition = coverMatches[0];
      }
    }

    // Fallback to an edition with useful metadata
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
    editionCount,
    ratingsAverage,
    ratingsCount,
  };
}

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