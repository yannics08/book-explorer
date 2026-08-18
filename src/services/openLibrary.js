export function coverUrl(coverId, size = "M") {
  if (!coverId) return null;

  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export async function searchBooks(query) {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(
      query
    )}&limit=20`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();

  return data.docs;
}

export async function getWorkDetails(workKey) {
  const response = await fetch(
    `https://openlibrary.org${workKey}.json`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch book details");
  }

  return response.json();
}