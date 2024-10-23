import React, { useState, useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


const initialState = {
  books: []
};

const bookReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_BOOK':
      return {
        ...state,
        books: [...state.books, action.payload]
      };
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(book => 
          book.id === action.payload.id ? action.payload : book
        )
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload)
      };
    default:
      return state;
  }
};


const BookForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    isbn: '',
    title: '',
    author: '',
    poster: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 rounded-lg shadow">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="ISBN"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.isbn}
          onChange={e => setFormData({...formData, isbn: e.target.value})}
        />
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
        />
        <input
          type="text"
          placeholder="Author"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.author}
          onChange={e => setFormData({...formData, author: e.target.value})}
        />
        <input
          type="text"
          placeholder="Poster URL"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.poster}
          onChange={e => setFormData({...formData, poster: e.target.value})}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          {initialData ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};


const BookList = ({ books, onDelete, onShowDetails }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-lg shadow">
      {books.map(book => (
        <div 
          key={book.id} 
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <img 
            src={book.poster || "https://via.placeholder.com/150"}
            alt={book.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">{book.title}</h3>
            <p className="text-gray-600 mb-4">{book.author}</p>
            <div className="flex justify-between">
              <button 
                onClick={() => onShowDetails(book)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Details
              </button>
              <button 
                onClick={() => onDelete(book.id)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const BookDetails = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{book.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <img 
            src={book.poster || "https://via.placeholder.com/150"}
            alt={book.title}
            className="w-full h-48 object-cover mb-4 rounded"
          />
          <div className="space-y-2">
            <p><span className="font-bold">ISBN:</span> {book.isbn}</p>
            <p><span className="font-bold">Author:</span> {book.author}</p>
            <p><span className="font-bold">Description:</span> {book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-4 h-16 items-center">
          <Link 
            to="/books" 
            className="hover:text-gray-300 transition-colors"
          >
            Book List
          </Link>
          <Link 
            to="/books/add" 
            className="hover:text-gray-300 transition-colors"
          >
            Add Book
          </Link>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(bookReducer, initialState);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleAddBook = (book) => {
    dispatch({ 
      type: 'ADD_BOOK', 
      payload: { ...book, id: Date.now() }
    });
  };

  const handleUpdateBook = (book) => {
    dispatch({ type: 'UPDATE_BOOK', payload: book });
  };

  const handleDeleteBook = (id) => {
    dispatch({ type: 'DELETE_BOOK', payload: id });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4">
          <Routes>
            <Route 
              path="/books" 
              element={
                <BookList 
                  books={state.books}
                  onDelete={handleDeleteBook}
                  onShowDetails={setSelectedBook}
                />
              }
            />
            <Route 
              path="/books/add" 
              element={<BookForm onSubmit={handleAddBook} />}
            />
            <Route 
              path="/books/edit/:id" 
              element={<BookForm onSubmit={handleUpdateBook} />}
            />
          </Routes>
        </div>
        {selectedBook && (
          <BookDetails 
            book={selectedBook} 
            onClose={() => setSelectedBook(null)}
          />
        )}
      </div>
    </Router>
  );
};

export default App;