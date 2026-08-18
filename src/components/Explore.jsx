import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";
import { getTrendingBooks } from "../services/openLibrary";

function Explore() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const results = await getTrendingBooks();
        setBooks(results);
      } catch (error) {
        console.error(error);
        setError("Unable to load trending books.");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  return (
    <>
      <section
        id="explore"
        className="relative z-10 -mt-16 px-6 pb-16"
      >
        <div className="mx-auto max-w-7xl rounded-2xl bg-[#f8f7f2] px-8 py-10 shadow-2xl">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1B1B18]">
              Trending Now
            </h2>

            <p className="mt-2 text-[#5B5A52]">
              Discover books people are interested in right now.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#DFD9C6] border-t-[#5B5A52]" />

              <p className="mt-4 text-[#5B5A52]">
                Loading trending books...
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

          {/* No books */}
          {!loading && !error && books.length === 0 && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-[#8C8A80]">
                No trending books found.
              </p>
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

export default Explore;