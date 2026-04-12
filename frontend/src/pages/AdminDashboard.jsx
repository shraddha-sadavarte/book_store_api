import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../api/axios'

const empty = { title: '', author: '', description: '', price: '', category: '', stock: '', coverImage: '' }

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  </div>
)

const AdminDashboard = () => {
  const [books, setBooks]             = useState([])
  const [form, setForm]               = useState(empty)
  const [editId, setEditId]           = useState(null)
  const [loading, setLoading]         = useState(false)
  const [toast, setToast]             = useState(null)
  const [showForm, setShowForm]       = useState(false)
  const [deleteId, setDeleteId]       = useState(null)
  const [booksLoaded, setBooksLoaded] = useState(false)
  const [searchParams]                = useSearchParams()

  const fetchBooks = async () => {
    try {
      const { data } = await API.get('/books')
      // Ensure price and stock are numbers (defensive)
      const normalized = data.map(book => ({
        ...book,
        price: Number(book.price),
        stock: Number(book.stock)
      }))
      setBooks(normalized)
    } catch (e) {
      showToast('Failed to load books', 'error')
    } finally {
      setBooksLoaded(true)
    }
  }

  useEffect(() => {
    fetchBooks()
    if (searchParams.get('action') === 'add') setShowForm(true)
  }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Convert price and stock to numbers before sending
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      }
      if (editId) {
        await API.put(`/books/${editId}`, payload)
        showToast('Book updated!')
      } else {
        await API.post('/books', payload)
        showToast('Book added!')
      }
      setForm(empty); setEditId(null); setShowForm(false)
      fetchBooks()
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error')
    } finally { setLoading(false) }
  }

  const handleEdit = (book) => {
    setEditId(book._id)
    setForm({ title: book.title, author: book.author, description: book.description || '',
      price: book.price, category: book.category, stock: book.stock, coverImage: book.coverImage || '' })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/books/${id}`)
      showToast('Book deleted.', 'success')  // Fixed: 'success' instead of 'error'
      fetchBooks()
    } catch {
      showToast('Delete failed', 'error')
    } finally { setDeleteId(null) }
  }

  const handleCancel = () => { setForm(empty); setEditId(null); setShowForm(false) }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
  // Ensure numeric addition (defensive)
  const totalStock = books.reduce((s, b) => s + (Number(b.stock) || 0), 0)
  const avgPrice   = books.length ? Math.round(books.reduce((s, b) => s + (Number(b.price) || 0), 0) / books.length) : 0

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white
          ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="text-center">
              <span className="text-4xl">🗑️</span>
              <h3 className="text-lg font-bold text-gray-800 mt-3">Delete this book?</h3>
              <p className="text-sm text-gray-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="button" onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 transition">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage your bookstore inventory</p>
          </div>
          <button type="button"
            onClick={() => { setShowForm(prev => !prev); setEditId(null); setForm(empty) }}
            className="bg-blue-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm whitespace-nowrap">
            {showForm ? '✕ Close' : '+ Add New Book'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">

        {/* Stats */}
        {booksLoaded ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Total Books"  value={books.length}  icon="📚" color="bg-blue-50" />
            <StatCard label="Total Stock"  value={totalStock}    icon="📦" color="bg-green-50" />
            <StatCard label="Avg Price"    value={`₹${avgPrice}`} icon="💰" color="bg-yellow-50" />
            <StatCard label="Out of Stock" value={books.filter(b => b.stock === 0).length} icon="⚠️" color="bg-red-50" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-20 sm:h-24 animate-pulse" />)}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-bold text-gray-800 mb-5">
              {editId ? '✏️ Edit Book' : '➕ Add New Book'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Title *</label>
                <input required placeholder="e.g. The Pragmatic Programmer" className={inp}
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Author *</label>
                <input required placeholder="e.g. Andrew Hunt" className={inp}
                  value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Category *</label>
                <input required placeholder="e.g. Programming, Fiction..." className={inp}
                  value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Price (₹) *</label>
                <input required type="number" min="0" placeholder="e.g. 499" className={inp}
                  value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Stock *</label>
                <input required type="number" min="0" placeholder="e.g. 25" className={inp}
                  value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Cover Image URL</label>
                <input placeholder="https://..." className={inp}
                  value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Description</label>
                <textarea rows={3} placeholder="Brief description..." className={`${inp} resize-none`}
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2 flex flex-wrap gap-3 pt-1">
                <button type="submit" disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                  {loading ? 'Saving...' : editId ? '✓ Update Book' : '✓ Add Book'}
                </button>
                <button type="button" onClick={handleCancel}
                  className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Books Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">All Books</h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{books.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Book', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 sm:px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {books.map(book => (
                  <tr key={book._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 sm:px-5 py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        <img src={book.coverImage || `https://placehold.co/40x50/EEF2FF/4F46E5?text=B`}
                          alt="" className="w-8 h-10 sm:w-9 sm:h-11 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-800 text-xs line-clamp-1 max-w-[120px] sm:max-w-[160px]">{book.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">{book.category}</span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 font-bold text-gray-800">₹{book.price}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-500">{book.stock}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                        ${book.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {book.stock > 0 ? '● In Stock' : '● Out'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button type="button" onClick={() => handleEdit(book)}
                          className="text-xs bg-amber-50 text-amber-600 border border-amber-100 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-amber-100 transition font-medium">
                          ✏️ Edit
                        </button>
                        <button type="button" onClick={() => setDeleteId(book._id)}
                          className="text-xs bg-red-50 text-red-500 border border-red-100 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-300">
                      <p className="text-4xl mb-3">📭</p>
                      <p className="text-sm">No books yet. Click "+ Add New Book" above.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard