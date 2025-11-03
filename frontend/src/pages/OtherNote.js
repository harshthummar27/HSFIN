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
    <div className="p-4 md:p-8">

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Note</h2>
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">All Notes</h2>
          <div className="space-y-4">
            {notes.map((noteItem) => (
              <div
                key={noteItem._id}
                className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">{noteItem.note}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(noteItem.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(noteItem._id)}
                    className="ml-4 text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No notes found. Add your first note above!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherNote;

