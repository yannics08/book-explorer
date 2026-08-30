import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";
import { searchBooks } from "../services/openLibrary";

const RESULTS_PER_PAGE = 20;

// Builds a windowed page-number list with ellipses, e.g.
// [1, 2, 3, 4, "...", 2369] — always shows the first page, the last page,
// and a few pages around the current one.
function getPageNumbers(current, total) {
  const delta = 2;
  const range = [];
  const withDots = [];
  let last;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  range.forEach((i) => {
    if (last !== undefined) {
      if (i - last === 2) {
        withDots.push(last + 1);
      } else if (i - last !== 1) {
        withDots.push("...");
      }
    }
    withDots.push(i);
    last = i;
  });

  return withDots;
}

function Search({ query }) {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [numFound, setNumFound] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!query) {
      setBooks([]);
      setNumFound(0);
      setTotalPages(0);
      setPage(1);
      return;
    }

    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function loadPage(pageToLoad) {
    setLoading(true);
    setError("");
    setSelectedBook(null);

    try {
      const results = await searchBooks(query, {
        page: pageToLoad,
        limit: RESULTS_PER_PAGE,
      });

      setBooks(results.docs);
      setNumFound(results.numFound || 0);
      setTotalPages(results.totalPages || 0);
      setPage(pageToLoad);

      document
        .getElementById("search-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error(err);
      setError("Unable to search for manuscripts.");
    } finally {
      setLoading(false);
    }
  }

  function goToPage(nextPage) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;

    loadPage(nextPage);
  }

  const startIndex = numFound > 0 ? (page - 1) * RESULTS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(page * RESULTS_PER_PAGE, numFound);

  return (
    <>
      {/* Search Section */}
      <section
        id="search-results"
        className="relative z-10 -mt-16 px-6 pb-16 font-serif"
      >
        {/* Parchment Container with Antique Brass Border */}
        <div className="mx-auto max-w-7xl rounded-2xl border border-[#c59b27]/30 bg-[#f4f1ea] px-8 py-10 shadow-2xl">
          
          {/* Heading */}
          <div className="mb-8 border-b border-[#e2dcce] pb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8c6d1f]">
              Archive Search
            </span>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1c1917]">
              Search Results
            </h1>

            <p className="mt-1 text-[#57534e] italic">
              {!loading && !error && numFound > 0
                ? `${startIndex.toLocaleString()} - ${endIndex.toLocaleString()} of ${numFound.toLocaleString()} results found for "${query}"`
                : `Displaying catalog entries for "${query}"`}
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e2dcce] border-t-[#8c6d1f]" />

              <p className="mt-4 text-[#57534e] italic text-sm">
                Searching the archives...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-red-700 italic">
                {error}
              </p>
            </div>
          )}

          {/* No Results */}
          {!loading &&
            !error &&
            books.length === 0 && (
              <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-[#78716c] italic">
                  No manuscripts found matching "{query}".
                </p>
              </div>
            )}

          {/* Books */}
          {!loading && !error && books.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
                {books.map((book) => (
                  <BookCard
                    key={book.key}
                    book={book}
                    onSelect={setSelectedBook}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2 border-t border-[#e2dcce] pt-8">
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#8c6d1f] transition-colors hover:bg-[#c59b27]/10 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {getPageNumbers(page, totalPages).map((item, index) =>
                    item === "..." ? (
                      <span
                        key={`dots-${index}`}
                        className="flex h-9 w-9 items-center justify-center text-sm text-[#78716c]"
                      >
                        •••
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => goToPage(item)}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-semibold transition-colors ${
                          item === page
                            ? "bg-[#e2dcce] text-[#1c1917]"
                            : "text-[#57534e] hover:bg-[#c59b27]/10"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#8c6d1f] transition-colors hover:bg-[#c59b27]/10 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
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