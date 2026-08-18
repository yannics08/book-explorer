import { coverUrl } from "../services/openLibrary";

function BookCard({ book, onSelect }) {
  return (
    <div
      onClick={() => onSelect(book)}
      className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
    >
      {book.cover_i ? (
        <img
          src={coverUrl(book.cover_i, "M")}
          alt={book.title}
          className="h-72 w-full object-cover"
        />
      ) : (
        <div className="flex h-72 items-center justify-center bg-gray-200 text-gray-500">
          No Cover
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-bold">
          {book.title}
        </h3>

        <p className="mt-1 text-gray-600">
          {book.author_name?.join(", ") || "Unknown Author"}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {book.first_publish_year || "Unknown Year"}
        </p>
      </div>
    </div>
  );
}

export default BookCard;