import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import BookCard from '../components/BookCard'

const HomePage = () => {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    API.get('/books').then(({ data }) => setBooks(data)).finally(() => setLoading(false))
  }, [])

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">Find Your Next Favourite Book</h1>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">Browse our curated collection of books across all genres.</p>
          <div className="relative max-w-lg mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm md:text-base">🔍</span>
            <input type="text" placeholder="Search by title, author or category..."
              className="w-full bg-white text-gray-800 rounded-2xl pl-10 pr-5 py-3 sm:py-3.5 md:py-4 text-sm md:text-base focus:outline-none shadow-lg"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <p className="text-sm md:text-base text-gray-500">
            Showing <span className="font-semibold text-gray-800">{filtered.length}</span> of{' '}
            <span className="font-semibold text-gray-800">{books.length}</span> books
          </p>
          {user?.role === 'admin' && (
            <Link to="/admin"
              className="text-xs sm:text-sm md:text-base bg-blue-600 text-white px-3 sm:px-4 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium">
              + Add Books
            </Link>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[...Array(8)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-56 sm:h-64 md:h-72 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <span className="text-5xl md:text-6xl">📭</span>
            <p className="text-gray-400 mt-4 text-sm md:text-base">
              {search ? `No results for "${search}"` : 'No books yet. Admin needs to add some!'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-3 text-blue-600 text-sm md:text-base hover:underline">Clear search</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage