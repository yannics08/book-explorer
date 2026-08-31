import { useState } from "react";
import { coverUrl } from "../services/openLibrary";

function BookCard({ book, onSelect }) {
  const [imageError, setImageError] = useState(false);

  const hasCover = book.cover_i && !imageError;

  return (
    <div
      onClick={() => onSelect(book)}
      className="group w-full max-w-[220px] cursor-pointer"
    >
      {/* Book Cover */}
      <div
        className="
          relative
          aspect-[2/3]
          w-full
          overflow-hidden
          rounded-r-sm
          bg-gray-100
          shadow-[8px_10px_18px_rgba(0,0,0,0.25)]
          transition-all
          duration-500
          ease-out
          group-hover:-translate-y-3
          group-hover:scale-[1.02]
          group-hover:shadow-[14px_18px_25px_rgba(0,0,0,0.35)]

          /* Spine Crease Overlay */
          after:pointer-events-none
          after:absolute
          after:inset-0
          after:bg-gradient-to-r
          after:from-black/40
          after:via-white/20
          after:to-transparent
          after:bg-[length:12px_100%]
          after:bg-no-repeat
          after:content-['']
        "
      >
        {hasCover ? (
          <img
            src={coverUrl(book.cover_i, "M")}
            alt={book.title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No Cover
          </div>
        )}
      </div>

      {/* Book Information */}
      <div className="mt-4">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-gray-900">
          {book.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-sm text-gray-600">
          {book.author_name?.join(", ") || "Unknown Author"}
        </p>

        <p className="mt-1 text-sm text-gray-400">
          {book.first_publish_year || "Unknown Year"}
        </p>
      </div>
    </div>
  );
}

export default BookCard;