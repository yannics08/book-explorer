import { useEffect, useState } from "react";
import { X, Calendar, Library, Star, ChevronRight, ChevronLeft } from "lucide-react";

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

        if (!cancelled) setDetails(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setDetails(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => (cancelled = true);
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

        if (!cancelled) setEditionsData(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setEditionsData(null);
      } finally {
        if (!cancelled) setEditionsLoading(false);
      }
    }

    loadEditions();
    return () => (cancelled = true);
  }, [book, editionsOpen, editionsPage]);

  if (!book) return null;

  const description =
    typeof details?.description === "string"
      ? details.description
      : details?.description?.value || "No description available.";

  const cover = coverUrl(book.cover_i, "L");

  const publishDate =
    book.first_publish_year ||
    details?.edition?.publish_date ||
    details?.first_publish_date ||
    "Unknown";

  const editionCount =
    details?.editionCount ?? book.edition_count ?? null;

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
    typeof details?.ratingsCount === "number"
      ? details.ratingsCount
      : null;

  const subjects =
    details?.subjects?.slice(0, 10) ||
    book.subject?.slice(0, 10) ||
    [];

  function openEditions() {
    setEditionsPage(1);
    setEditionsOpen(true);
  }

  return (
    <>
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
            className="absolute right-6 top-6 rounded-full p-2 text-[#57534e] hover:bg-[#1c1917]/5"
          >
            <X size={22} />
          </button>

          <div className="grid gap-10 md:grid-cols-[240px_1fr]">
            {/* Cover */}
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
            </div>

            {/* Details */}
            <div>
              <h1 className="text-4xl font-bold leading-tight text-[#1c1917]">
                {shortenTitle(book.title, 80)}
              </h1>

              <p className="mt-2 text-lg italic text-[#57534e]">
                by {book.author_name?.join(", ") || "Unknown Author"}
              </p>

              {/* Publish year + Rating */}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#57534e]">
                <div className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-[#8c6d1f]" />
                  <span>First published in {publishDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Star size={15} className="text-[#8c6d1f]" />
                  <span>
                    {rating}
                    {ratingsCount != null
                      ? ` (${ratingsCount.toLocaleString()} ratings)`
                      : ""}
                  </span>
                </div>
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

              {/* Browse editions row */}
              {editionCount != null && (
                <button
                  onClick={openEditions}
                  className="mt-4 flex w-full cursor-pointer items-center gap-4 rounded-xl border border-[#c59b27]/30 bg-[#e2dcce]/30 px-4 py-3 text-left transition-colors hover:bg-[#e2dcce]/60"
                >
                  <Library size={20} className="flex-shrink-0 text-[#8c6d1f]" />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#1c1917]">
                      Browse all {editionsDisplay} editions
                    </p>
                    <p className="mt-0.5 text-xs text-[#78716c]">
                      Different publishers, languages &amp; years
                    </p>
                  </div>

                  <ChevronRight size={18} className="flex-shrink-0 text-[#8c6d1f]" />
                </button>
              )}

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
          total={editionsData?.size ?? editionCount}
          onPageChange={setEditionsPage}
          onClose={() => setEditionsOpen(false)}
        />
      )}
    </>
  );
}

function shortenTitle(title, max = 60) {
  if (!title) return title;
  return title.length > max ? `${title.slice(0, max - 1).trimEnd()}…` : title;
}

function getPageItems(current, total) {
  const items = [];
  const addRange = (from, to) => {
    for (let i = from; i <= to; i++) items.push(i);
  };

  if (total <= 7) {
    addRange(1, total);
    return items;
  }

  items.push(1);

  if (current > 3) items.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  addRange(start, end);

  if (current < total - 2) items.push("...");

  items.push(total);

  return items;
}

function EditionsBrowser({
  book,
  editionsData,
  editionsLoading,
  editionsPage,
  totalPages,
  total,
  onPageChange,
  onClose,
}) {
  const rangeStart = total ? (editionsPage - 1) * EDITIONS_PAGE_SIZE + 1 : null;
  const rangeEnd = total
    ? Math.min(editionsPage * EDITIONS_PAGE_SIZE, total)
    : null;
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
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="truncate text-lg font-bold text-[#1c1917]">
            Editions of {shortenTitle(book.title)}
          </h2>

          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-full p-2 text-[#57534e] hover:bg-[#1c1917]/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-3 border-b border-[#c59b27]/20 pb-3">
          <span className="text-xs text-[#57534e]">
            {total
              ? `Showing ${rangeStart}-${rangeEnd} of ${total.toLocaleString()} editions`
              : "Showing editions"}
          </span>
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

              const editionHref = `https://openlibrary.org${entry.key}`;

              return (
                <div
                  key={entry.key}
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
                    <a
                      href={editionHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm font-semibold text-[#1c1917] hover:underline"
                    >
                      {shortenTitle(entry.title || book.title, 70)}
                    </a>

                    <p className="mt-0.5 text-xs text-[#57534e]">
                      {meta || "No further details"}
                    </p>
                  </div>

                  <a
                    href={editionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 rounded-lg border border-[#c59b27]/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#8c6d1f] transition-colors hover:bg-[#c59b27]/10"
                  >
                    View
                  </a>
                </div>
              );
            })
          ) : (
            <p className="text-sm italic text-[#78716c]">
              No editions found.
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-1 border-t border-[#c59b27]/20 pt-4">
            <button
              onClick={() => onPageChange(Math.max(1, editionsPage - 1))}
              disabled={editionsPage <= 1}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[#8c6d1f] hover:bg-[#c59b27]/10 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {getPageItems(editionsPage, totalPages).map((item, idx) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-sm tracking-widest text-[#8c6d1f]"
                >
                  •••
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => onPageChange(item)}
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    item === editionsPage
                      ? "bg-[#c59b27]/30 text-[#1c1917]"
                      : "text-[#57534e] hover:bg-[#c59b27]/10"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={() => onPageChange(Math.min(totalPages, editionsPage + 1))}
              disabled={editionsPage >= totalPages}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[#8c6d1f] hover:bg-[#c59b27]/10 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDetails;