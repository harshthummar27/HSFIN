import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await api.get('/rules');
      setRules(response.data);
    } catch (error) {
      toast.error('Failed to fetch rules');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/rules', formData);
      toast.success('Rule added successfully');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
      fetchRules();
    } catch (error) {
      toast.error('Failed to add rule');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        await api.delete(`/rules/${id}`);
        toast.success('Rule deleted successfully');
        fetchRules();
      } catch (error) {
        toast.error('Failed to delete rule');
      }
    }
  };

  return (
    <div className="p-4 md:p-8">

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Rule</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              required
              placeholder="Enter rule note"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-2 px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 shadow-md"
              style={{ backgroundColor: '#669bbc' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5588aa')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#669bbc')}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Note</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rules.map((rule) => (
                <tr key={rule._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(rule.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{rule.note}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(rule._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {rules.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No rules found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rules;

