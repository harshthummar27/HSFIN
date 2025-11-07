import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const OtherNote = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      toast.error('Failed to fetch notes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      toast.error('Please enter a note');
      return;
    }
    setLoading(true);

    try {
      await api.post('/notes', { note });
      toast.success('Note added successfully');
      setNote('');
      fetchNotes();
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/notes/${id}`);
        toast.success('Note deleted successfully');
        fetchNotes();
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  return (
    <div className="p-2 md:p-6" style={{ backgroundColor: '#f2f4f3', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-3 md:mb-6">
        <h1 className="text-lg md:text-3xl font-bold" style={{ color: '#0A0908' }}>Other Notes</h1>
        <p className="text-xs md:text-base text-gray-600 mt-0.5 md:mt-1">Keep track of important notes and reminders</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-3 md:mb-6">
        <div className="flex items-center mb-2 md:mb-4">
          <span className="text-lg md:text-2xl mr-2 md:mr-3">📝</span>
          <h2 className="text-sm md:text-2xl font-bold text-gray-700">Add New Note</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 md:gap-4">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note"
            required
            className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none transition-all bg-white"
            style={{ color: '#0A0908' }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#49111c';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(73, 17, 28, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="text-white text-sm md:text-base font-semibold py-2 px-4 md:px-6 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md whitespace-nowrap"
            style={{ backgroundColor: '#49111c' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#3a0d15')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#49111c')}
          >
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg overflow-hidden">
        <div className="p-3 md:p-6">
          <div className="flex items-center mb-2 md:mb-4">
            <span className="text-lg md:text-2xl mr-2 md:mr-3">📋</span>
            <h2 className="text-sm md:text-2xl font-bold text-gray-700">All Notes</h2>
          </div>
          <div className="space-y-2 md:space-y-4">
            {notes.map((noteItem) => (
              <div
                key={noteItem._id}
                className="border-l-4 border-blue-500 pl-3 md:pl-5 py-2 md:py-4 bg-gradient-to-r from-gray-50 to-white rounded-r-lg shadow-sm md:shadow-md hover:shadow-md md:hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base text-gray-800 mb-1 md:mb-2 font-medium break-words">{noteItem.note}</p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {new Date(noteItem.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(noteItem._id)}
                    className="ml-2 md:ml-4 text-red-600 hover:text-red-800 font-semibold text-xs md:text-sm transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="text-center text-gray-500 py-6 md:py-12">
                <span className="text-2xl md:text-4xl mb-2 md:mb-4 block">📝</span>
                <p className="text-sm md:text-lg">No notes found. Add your first note above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherNote;

