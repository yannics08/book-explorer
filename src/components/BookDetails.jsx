import { useEffect, useState } from "react";

import {
  X,
  Calendar,
  Languages,
  Library,
  Star,
} from "lucide-react";

import {
  coverUrl,
  getEditionsPage,
  getWorkDetails,
} from "../services/openLibrary";

const EDITIONS_PAGE_SIZE = 20;

function BookDetails({ book, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editionsOpen, setEditionsOpen] = useState(false);
  const [editionsPage, setEditionsPage] = useState(1);
  const [editionsData, setEditionsData] = useState(null);
  const [editionsLoading, setEditionsLoading] = useState(false);

  useEffect(() => {
    if (!book) return;

    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const data = await getWorkDetails(book.key, {
          coverId: book.cover_i,
        });

        if (!cancelled) {
          setDetails(data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setDetails(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [book]);

  useEffect(() => {
    if (!book || !editionsOpen) return;

    let cancelled = false;

    async function loadEditions() {
      setEditionsLoading(true);

      try {
        const data = await getEditionsPage(book.key, {
          page: editionsPage,
          pageSize: EDITIONS_PAGE_SIZE,
        });

        if (!cancelled) {
          setEditionsData(data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setEditionsData(null);
        }
      } finally {
        if (!cancelled) {
          setEditionsLoading(false);
        }
      }
    }

    loadEditions();

    return () => {
      cancelled = true;
    };
  }, [book, editionsOpen, editionsPage]);

  if (!book) return null;

  function openEditions() {
    setEditionsPage(1);
    setEditionsOpen(true);
  }

  const description =
    typeof details?.description === "string"
      ? details.description
      : details?.description?.value ||
        "No description available.";

  const cover = coverUrl(book.cover_i, "L");

  const publishDate =
    book.first_publish_year ||
    details?.edition?.publish_date ||
    details?.first_publish_date ||
    "Unknown";

  let language = "Unknown";

  if (details?.edition?.languages?.[0]?.key) {
    language = details.edition.languages[0].key
      .split("/")
      .pop()
      .toUpperCase();
  } else if (book.language?.[0]) {
    language = book.language[0].toUpperCase();
  } else if (details?.languages?.[0]?.key) {
    language = details.languages[0].key.split("/").pop().toUpperCase();
  }

  const editionCount = details?.editionCount ?? book.edition_count ?? null;

  const editionsDisplay =
    editionCount != null ? editionCount.toLocaleString() : "Unknown";

  const ratingValue =
    typeof details?.ratingsAverage === "number"
      ? details.ratingsAverage
      : typeof book.ratings_average === "number"
        ? book.ratings_average
        : null;

  const rating = ratingValue != null ? ratingValue.toFixed(1) : "N/A";

  const ratingsCount =
    typeof details?.ratingsCount === "number" ? details.ratingsCount : null;

  const subjects =
    details?.subjects?.slice(0, 10) ||
    book.subject?.slice(0, 10) ||
    [];

  // Link to the exact edition we matched (by cover, then by English
  // language) so "View in Open Library" opens the same book being shown
  // here, rather than the work page — which redirects to whatever edition
  // Open Library considers the default, often a different one.
  const openLibraryUrl = details?.edition?.key
    ? `https://openlibrary.org${details.edition.key}`
    : `https://openlibrary.org${book.key}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1917]/70 p-6 font-serif backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-[#c59b27]/40 bg-[#f4f1ea] p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-[#57534e] transition-colors hover:bg-[#1c1917]/5"
        >
          <X size={22} />
        </button>

        <div className="grid gap-10 md:grid-cols-[240px_1fr]">
          <div>
            {cover ? (
              <img
                src={cover}
                alt={book.title}
                className="w-full rounded-r-md border border-[#c59b27]/30 shadow-xl"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center rounded-r-md border border-[#c59b27]/30 bg-[#e2dcce] text-[#78716c] italic">
                No Cover
              </div>
            )}

            <a
              href={openLibraryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center rounded-xl border border-[#c59b27]/80 bg-[#1c1917] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#c59b27] shadow-md transition hover:bg-[#c59b27] hover:text-[#1c1917]"
            >
              View in Open Library
            </a>
          </div>

          <div>
            <h1 className="text-4xl font-bold leading-tight text-[#1c1917]">
              {book.title}
            </h1>

            <p className="mt-2 text-lg italic text-[#57534e]">
              by{" "}
              {book.author_name?.join(", ") ||
                "Unknown Author"}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#c59b27]/40 bg-[#c59b27]/10 px-3 py-1 text-[#8c6d1f]">
              <Star
                size={16}
                fill="currentColor"
                className="text-[#8c6d1f]"
              />

              <span className="text-sm font-semibold">
                {rating}
              </span>

              {ratingsCount != null && (
                <span className="text-xs text-[#a68a3f]">
                  ({ratingsCount.toLocaleString()})
                </span>
              )}
            </div>

            <div className="mt-8">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6d1f]">
                Synopsis
              </h2>

              {loading ? (
                <p className="text-sm italic text-[#78716c]">
                  Unrolling manuscript details...
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto rounded-lg border border-[#c59b27]/20 bg-[#e2dcce]/20 p-3 pr-4">
                  <p className="whitespace-pre-line text-sm leading-7 text-[#44403c]">
                    {description}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
              <InfoCard
                icon={<Calendar size={16} />}
                label="Published"
                value={publishDate}
              />

              <InfoCard
                icon={<Languages size={16} />}
                label="Language"
                value={language}
              />

              <InfoCard
                icon={<Library size={16} />}
                label="Editions"
                value={editionsDisplay}
                onClick={editionCount ? openEditions : undefined}
              />
            </div>

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

      {editionsOpen && (
        <EditionsBrowser
          book={book}
          editionsData={editionsData}
          editionsLoading={editionsLoading}
          editionsPage={editionsPage}
          totalPages={
            editionsData?.size
              ? Math.ceil(editionsData.size / EDITIONS_PAGE_SIZE)
              : editionCount
                ? Math.ceil(editionCount / EDITIONS_PAGE_SIZE)
                : null
          }
          onPrev={() => setEditionsPage((p) => Math.max(1, p - 1))}
          onNext={() => setEditionsPage((p) => p + 1)}
          onClose={() => setEditionsOpen(false)}
        />
      )}
    </div>
  );
}

function InfoCard({ icon, label, value, wrap = false, onClick }) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className={`rounded-xl border border-[#c59b27]/30 bg-[#e2dcce]/40 p-3 text-left ${
        onClick ? "transition-colors hover:bg-[#e2dcce]/70" : ""
      }`}
    >
      <div className="mb-2 flex items-center gap-1.5 text-[#8c6d1f]">
        {icon}

        <span className="text-[10px] font-semibold uppercase tracking-widest">
          {label}
        </span>
      </div>

      <p
        className={`text-sm font-semibold leading-tight text-[#1c1917] ${
          wrap ? "whitespace-normal break-words" : "truncate"
        }`}
      >
        {value}
      </p>
    </Tag>
  );
}

function EditionsBrowser({
  book,
  editionsData,
  editionsLoading,
  editionsPage,
  totalPages,
  onPrev,
  onNext,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1c1917]/70 p-6 font-serif backdrop-blur-md"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-[#c59b27]/40 bg-[#f4f1ea] p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1c1917]">
            Editions of {book.title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#57534e] transition-colors hover:bg-[#1c1917]/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto pr-2">
          {editionsLoading ? (
            <p className="text-sm italic text-[#78716c]">
              Loading editions...
            </p>
          ) : editionsData?.entries?.length ? (
            editionsData.entries.map((entry) => {
              const languages = entry.languages
                ?.map((lang) => lang.key?.split("/").pop())
                .filter(Boolean)
                .map((code) => code.toUpperCase())
                .join(", ");

              const thumb = coverUrl(entry.covers?.[0], "S");

              const meta = [
                entry.publish_date,
                entry.publishers?.[0],
                languages,
                entry.number_of_pages
                  ? `${entry.number_of_pages} pages`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <a
                  key={entry.key}
                  href={`https://openlibrary.org${entry.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[#c59b27]/20 bg-[#e2dcce]/20 p-3 transition-colors hover:bg-[#e2dcce]/50"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      className="h-14 w-10 flex-shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-10 flex-shrink-0 items-center justify-center rounded bg-[#e2dcce] text-[10px] italic text-[#78716c]">
                      N/A
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#1c1917]">
                      {entry.title || book.title}
                    </p>

                    <p className="mt-0.5 text-xs text-[#57534e]">
                      {meta || "No further details"}
                    </p>
                  </div>
                </a>
              );
            })
          ) : (
            <p className="text-sm italic text-[#78716c]">
              No editions found.
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#c59b27]/20 pt-4">
          <button
            onClick={onPrev}
            disabled={editionsPage <= 1}
            className="rounded-lg border border-[#c59b27]/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#8c6d1f] transition-colors hover:bg-[#c59b27]/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-xs text-[#57534e]">
            Page {editionsPage}
            {totalPages ? ` of ${totalPages}` : ""}
          </span>

          <button
            onClick={onNext}
            disabled={totalPages ? editionsPage >= totalPages : false}
            className="rounded-lg border border-[#c59b27]/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#8c6d1f] transition-colors hover:bg-[#c59b27]/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;