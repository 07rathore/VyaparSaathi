import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await axios.get('/api/actions/today');
      // Filter completed items for history
      const completed = response.data.actions.filter(
        (action) => action.status === 'completed'
      );
      setHistory(completed);
    } catch (error) {
      console.error('History error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600">Loading history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compliance History</h1>
          <p className="text-gray-600 mt-2">
            Your track record of staying compliant
          </p>
        </div>

        {/* Credit Eligibility Message */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Great job staying compliant! 🎉
              </h3>
              <p className="text-gray-700">
                Regular compliance improves your credit eligibility and makes it easier to get
                loans, business credit, and financial services. Keep up the good work!
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {history.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Completed Filings</h2>
            <div className="space-y-6">
              {history.map((item, index) => (
                <div key={item.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    {index < history.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="ml-4 flex-1 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <span>Completed on: {formatDate(item.completedDate)}</span>
                      {item.dueDate && (
                        <span className="ml-4">
                          Due date: {formatDate(item.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-xl text-gray-600 mt-4">
              No completed filings yet. Complete your first compliance action to see it here!
            </p>
          </div>
        )}

        {/* Stats */}
        {history.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {history.length}
              </div>
              <div className="text-gray-600">Total Completed</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {history.filter((h) => {
                  if (!h.dueDate) return false;
                  const completed = new Date(h.completedDate || h.dueDate);
                  const due = new Date(h.dueDate);
                  return completed <= due;
                }).length}
              </div>
              <div className="text-gray-600">On Time</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round((history.length / (history.length + 5)) * 100)}%
              </div>
              <div className="text-gray-600">Compliance Rate</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;








