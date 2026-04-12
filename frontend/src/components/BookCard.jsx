import { Link } from 'react-router-dom'

const BookCard = ({ book }) => (
  <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
    <div className="relative overflow-hidden bg-gray-50 h-48">
      <img
        src={book.coverImage || `https://placehold.co/300x200/EEF2FF/4F46E5?text=${encodeURIComponent(book.title)}`}
        alt={book.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-3 left-3">
        <span className="text-xs bg-white/90 backdrop-blur-sm text-blue-600 font-medium px-2.5 py-1 rounded-full shadow-sm border border-blue-50">
          {book.category}
        </span>
      </div>
      {book.stock === 0 && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <span className="text-white text-xs font-semibold bg-red-500 px-3 py-1 rounded-full">Out of Stock</span>
        </div>
      )}
    </div>
    <div className="p-4 flex flex-col gap-2 flex-1">
      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug">{book.title}</h3>
      <p className="text-xs text-gray-400">by {book.author}</p>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-blue-600 font-bold text-lg">₹{book.price}</span>
        <Link to={`/books/${book._id}`}
          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium">
          View →
        </Link>
      </div>
    </div>
  </div>
)

export default BookCard