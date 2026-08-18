import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";
import { searchBooks } from "../services/openLibrary";

function Search({ query }) {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setBooks([]);
      return;
    }

    async function getBooks() {
      setLoading(true);
      setError("");
      setSelectedBook(null);

      try {
        const results = await searchBooks(query);
        setBooks(results);
      } catch (error) {
        console.error(error);
        setError("Unable to search for books.");
      } finally {
        setLoading(false);
      }
    }

    getBooks();
  }, [query]);

  return (
    <>
      {/* Search Section */}
      <section
        id="search-results"
        className="relative z-10 -mt-16 px-6 pb-16"
      >
        <div className="mx-auto max-w-7xl rounded-2xl bg-[#f8f7f2] px-8 py-10 shadow-2xl">
          
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1B1B18]">
              Search Results
            </h1>

            <p className="mt-2 text-[#5B5A52]">
              Results for "{query}"
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[400px] flex-col items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#DFD9C6] border-t-[#5B5A52]" />

              <p className="mt-5 text-lg font-medium text-[#5B5A52]">
                Searching for books...
              </p>

              <p className="mt-1 text-sm text-[#8C8A80]">
                Finding books for you
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-red-500">
                {error}
              </p>
            </div>
          )}

          {/* No Results */}
          {!loading &&
            !error &&
            books.length === 0 && (
              <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-[#8C8A80]">
                  No books found for "{query}".
                </p>
              </div>
            )}

          {/* Books */}
          {!loading && !error && books.length > 0 && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
              {books.map((book) => (
                <BookCard
                  key={book.key}
                  book={book}
                  onSelect={setSelectedBook}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetails
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
}

export default Search;