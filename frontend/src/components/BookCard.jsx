import { Link } from 'react-router-dom'

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition p-4 flex flex-col gap-2">
      <img
        src={book.coverImage || 'https://placehold.co/300x200?text=No+Cover'}
        alt={book.title}
        className="w-full h-44 object-cover rounded-lg bg-gray-100"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{book.title}</h3>
        <p className="text-xs text-gray-500">{book.author}</p>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">{book.category}</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-blue-600 font-bold">₹{book.price}</span>
        <Link
          to={`/books/${book._id}`}
          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default BookCard