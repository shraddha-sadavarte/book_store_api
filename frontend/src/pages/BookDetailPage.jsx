import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'

const BookDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/books/${id}`)
      .then(({ data }) => setBook(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-gray-100 rounded-2xl h-72 sm:h-80 animate-pulse" />
    </div>
  )
  if (!book) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition mb-6">
          ← Back to books
        </button>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-56 md:w-64 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 sm:p-8">
              <img
                src={book.coverImage || `https://placehold.co/240x320/EEF2FF/4F46E5?text=${encodeURIComponent(book.title)}`}
                alt={book.title}
                className="w-40 sm:w-full max-w-[200px] rounded-xl shadow-md object-cover mx-auto"
              />
            </div>
            <div className="flex-1 p-6 sm:p-8 flex flex-col gap-4">
              <div>
                <span className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full">{book.category}</span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-3 leading-tight">{book.title}</h1>
                <p className="text-gray-400 text-sm mt-1">by <span className="text-gray-600 font-medium">{book.author}</span></p>
              </div>
              {book.description && (
                <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">{book.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-auto border-t border-gray-50 pt-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Price</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">₹{book.price}</p>
                </div>
                <div className="h-10 w-px bg-gray-100" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Availability</p>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full
                    ${book.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {book.stock > 0 ? `✓ ${book.stock} in stock` : '✗ Out of stock'}
                  </span>
                </div>
                {book.createdBy && (
                  <>
                    <div className="h-10 w-px bg-gray-100 hidden sm:block" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Added by</p>
                      <p className="text-sm font-medium text-gray-600">{book.createdBy.name}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailPage