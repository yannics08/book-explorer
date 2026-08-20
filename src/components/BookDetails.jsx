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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#F7F4EA] p-8 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-[#5B5A52] hover:bg-black/5"
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
                className="w-full rounded-xl shadow-lg"
              />
            ) : (
              <div className="aspect-[2/3] w-full rounded-xl bg-stone-200 flex items-center justify-center text-stone-500">
                No Cover
              </div>
            )}

            <a
              href={`https://openlibrary.org${book.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#2D3142] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1F2330]"
            >
              View on Open Library
            </a>
          </div>

          {/* RIGHT SIDE */}
          <div>
            {/* Title */}
            <h1 className="font-serif text-4xl leading-tight text-[#1B1B18]">
              {book.title}
            </h1>

            {/* Author */}
            <p className="mt-2 text-lg text-[#5B5A52]">
              by {book.author_name?.join(", ") || "Unknown Author"}
            </p>

            {/* Rating */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-amber-700">
              <Star size={16} fill="currentColor" />
              <span className="font-semibold">{rating}</span>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="mb-2 text-sm font-semibold text-[#1B1B18]">
                Description
              </h2>

              {loading ? (
                <p className="text-sm text-[#8C8A80]">
                  Loading description...
                </p>
              ) : (
                <>
                  <p
                    className={`whitespace-pre-line text-sm leading-7 text-[#5B5A52] ${
                      expanded ? "" : "line-clamp-4"
                    }`}
                  >
                    {description}
                  </p>

                  {description.length > 220 && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="mt-2 text-sm font-medium text-[#7C5A00] hover:underline"
                    >
                      {expanded ? "See less" : "See more"}
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
                <h2 className="mb-3 text-sm font-semibold text-[#1B1B18]">
                  Subjects
                </h2>

                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full border border-[#E4DFCF] bg-white/60 px-3 py-1 text-xs text-[#5B5A52]"
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
    <div className="rounded-xl border border-[#E6DFCF] bg-white/70 p-3">
      <div className="mb-2 flex items-center gap-1 text-[#8C8A80]">
        {icon}
        <span className="text-[10px] uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="truncate text-sm font-semibold leading-tight text-[#1B1B18]">
        {value}
      </p>
    </div>
  );
}

export default BookDetails;