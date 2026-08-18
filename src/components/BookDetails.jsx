import { useEffect, useState } from "react";
import { X, BookOpen, Layers, Tag } from "lucide-react";
import { coverUrl, getWorkDetails } from "../services/openLibrary";

function BookDetails({ book, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!book) return;

    let cancelled = false;

    setLoading(true);
    setError(null);
    setDetails(null);

    getWorkDetails(book.key)
      .then((data) => {
        if (!cancelled) {
          setDetails(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [book]);

  if (!book) return null;

  const description =
    typeof details?.description === "string"
      ? details.description
      : details?.description?.value || null;

  const subjects =
    details?.subjects?.slice(0, 8) ||
    book.subject?.slice(0, 8) ||
    [];

  const cover = coverUrl(book.cover_i, "L");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#F7F4EA] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-[#5B5A52] transition hover:bg-[#E4DFCF] hover:text-[#1B1B18]"
        >
          <X size={22} />
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
          
          {/* Book Cover */}
          <div className="relative">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-lg bg-[#DFD9C6]" />

            {cover ? (
              <img
                src={cover}
                alt={book.title}
                className="relative h-[300px] w-[220px] rounded-lg object-cover shadow-md"
              />
            ) : (
              <div className="relative flex h-[300px] w-[220px] items-center justify-center rounded-lg bg-[#E4DFCF] text-sm text-[#8C8A80]">
                No cover available
              </div>
            )}
          </div>

          {/* Book Information */}
          <div className="pr-6">
            <h1 className="font-serif text-3xl leading-tight text-[#1B1B18]">
              {book.title}
            </h1>

            <p className="mt-2 text-lg text-[#1B1B18]">
              {book.author_name?.join(", ") || "Unknown author"}
            </p>

            <p className="mt-1 text-sm text-[#8C8A80]">
              First published{" "}
              {book.first_publish_year || "unknown"}
            </p>

            {/* Edition Count */}
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#E4DFCF] bg-white/50 px-3 py-2 text-sm text-[#5B5A52]">
                <Layers size={15} />

                {book.edition_count
                  ? `${book.edition_count} edition${
                      book.edition_count === 1 ? "" : "s"
                    }`
                  : "Edition count unknown"}
              </div>
            </div>

            {/* Description */}
            <div className="mt-7">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#1B1B18]">
                <BookOpen size={15} />
                Description
              </h2>

              {loading && (
                <p className="text-sm text-[#8C8A80]">
                  Loading description...
                </p>
              )}

              {error && (
                <p className="text-sm text-red-700">
                  Couldn't load extra details: {error}
                </p>
              )}

              {!loading && !error && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#5B5A52]">
                  {description ||
                    "No description available for this book."}
                </p>
              )}
            </div>

            {/* Subjects */}
            {subjects.length > 0 && (
              <div className="mt-7">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#1B1B18]">
                  <Tag size={15} />
                  Subjects
                </h2>

                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full border border-[#E4DFCF] bg-white/50 px-3 py-1 text-xs text-[#5B5A52]"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;