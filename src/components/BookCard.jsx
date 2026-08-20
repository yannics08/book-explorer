import { coverUrl } from "../services/openLibrary";

function BookCard({ book, onSelect }) {
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
            rounded-sm
            bg-gray-100
            shadow-[8px_10px_18px_rgba(0,0,0,0.25)]
            transition-all
            duration-500
            ease-out
            group-hover:-translate-y-3
            group-hover:scale-[1.02]
            group-hover:shadow-[14px_18px_25px_rgba(0,0,0,0.35)]
            after:absolute
            after:left-0
            after:top-0
            after:h-full
            after:w-[7px]
            after:bg-black/20
            after:shadow-[2px_0_4px_rgba(0,0,0,0.25)]
            after:content-['']
        "
        >
        {book.cover_i ? (
          <img
            src={coverUrl(book.cover_i, "M")}
            alt={book.title}
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