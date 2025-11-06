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
    <div className="p-4 md:p-6" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#003049' }}>Other Notes</h1>
        <p className="text-gray-600 mt-1">Keep track of important notes and reminders</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-5 md:p-6 rounded-xl shadow-lg mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">📝</span>
          <h2 className="text-xl md:text-2xl font-bold text-gray-700">Add New Note</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note"
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="text-white font-semibold py-2 px-6 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md"
            style={{ backgroundColor: '#669bbc' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5588aa')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#669bbc')}
          >
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 md:p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">📋</span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-700">All Notes</h2>
          </div>
          <div className="space-y-4">
            {notes.map((noteItem) => (
              <div
                key={noteItem._id}
                className="border-l-4 border-blue-500 pl-5 py-4 bg-gradient-to-r from-gray-50 to-white rounded-r-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2 font-medium">{noteItem.note}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(noteItem.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(noteItem._id)}
                    className="ml-4 text-red-600 hover:text-red-800 font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <span className="text-4xl mb-4 block">📝</span>
                <p className="text-lg">No notes found. Add your first note above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherNote;

