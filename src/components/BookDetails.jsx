import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Building2,
  Languages,
  BookOpen,
  Star,
} from "lucide-react";
import { coverUrl, getWorkDetails } from "../services/openLibrary";

function BookDetails({ book, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!book) return;

    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const data = await getWorkDetails(book.key);
        if (!cancelled) setDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [book]);

  if (!book) return null;

  const description =
    typeof details?.description === "string"
      ? details.description
      : details?.description?.value || "No description available.";

  const cover = coverUrl(book.cover_i, "L");

  const publishDate =
    details?.first_publish_date ||
    book.first_publish_year ||
    "Unknown";

  const publisher =
    book.publisher?.[0] ||
    details?.publishers?.[0] ||
    "Unknown";

  const language =
    book.language?.[0] ||
    details?.languages?.[0]?.key?.split("/")?.pop()?.toUpperCase() ||
    "Unknown";

  const pages =
    details?.number_of_pages ||
    book.number_of_pages_median ||
    "Unknown";

  const rating =
    book.ratings_average?.toFixed(1) || "N/A";

  const subjects =
    details?.subjects?.slice(0, 10) ||
    book.subject?.slice(0, 10) ||
    [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1917]/70 backdrop-blur-md p-6 font-serif"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#c59b27]/40 bg-[#f4f1ea] p-8 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-[#57534e] hover:bg-[#1c1917]/5 transition-colors"
        >
          <X size={22} />
        </button>

        <div className="grid gap-10 md:grid-cols-[240px_1fr]">
          {/* LEFT SIDE */}
          <div>
            {cover ? (
              <img
                src={cover}
                alt={book.title}
                className="w-full rounded-r-md border border-[#c59b27]/30 shadow-xl"
              />
            ) : (
              <div className="aspect-[2/3] w-full rounded-r-md bg-[#e2dcce] border border-[#c59b27]/30 flex items-center justify-center text-[#78716c] italic">
                No Cover
              </div>
            )}

            <a
              href={`https://openlibrary.org${book.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center rounded-xl border border-[#c59b27]/80 bg-[#1c1917] px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#c59b27] transition hover:bg-[#c59b27] hover:text-[#1c1917] shadow-md"
            >
              View in Open Library
            </a>
          </div>

          {/* RIGHT SIDE */}
          <div>
            {/* Title */}
            <h1 className="text-4xl leading-tight font-bold text-[#1c1917]">
              {book.title}
            </h1>

            {/* Author */}
            <p className="mt-2 text-lg italic text-[#57534e]">
              by {book.author_name?.join(", ") || "Unknown Author"}
            </p>

            {/* Rating */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#c59b27]/40 bg-[#c59b27]/10 px-3 py-1 text-[#8c6d1f]">
              <Star size={16} fill="currentColor" className="text-[#8c6d1f]" />
              <span className="font-semibold text-sm">{rating}</span>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6d1f]">
                Synopsis
              </h2>

              {loading ? (
                <p className="text-sm italic text-[#78716c]">
                  Unrolling manuscript details...
                </p>
              ) : (
                <>
                  <p
                    className={`whitespace-pre-line text-sm leading-7 text-[#44403c] ${
                      expanded ? "" : "line-clamp-4"
                    }`}
                  >
                    {description}
                  </p>

                  {description.length > 220 && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="mt-2 text-sm font-semibold text-[#8c6d1f] hover:underline"
                    >
                      {expanded ? "Collapse synopsis" : "Read full synopsis"}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Metadata */}
            <div className="mt-8 grid grid-cols-4 gap-3">
              <InfoCard
                icon={<Calendar size={16} />}
                label="Published"
                value={publishDate}
              />

              <InfoCard
                icon={<Building2 size={16} />}
                label="Publisher"
                value={publisher}
              />

              <InfoCard
                icon={<Languages size={16} />}
                label="Language"
                value={language}
              />

              <InfoCard
                icon={<BookOpen size={16} />}
                label="Pages"
                value={pages}
              />
            </div>

            {/* Subjects */}
            {subjects.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6d1f]">
                  Subjects
                </h2>

                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full border border-[#c59b27]/30 bg-[#e2dcce]/50 px-3 py-1 text-xs text-[#44403c]"
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

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-[#c59b27]/30 bg-[#e2dcce]/40 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[#8c6d1f]">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-widest">
          {label}
        </span>
      </div>

      <p className="truncate text-sm font-semibold leading-tight text-[#1c1917]">
        {value}
      </p>
    </div>
  );
}

export default BookDetails;