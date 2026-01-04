import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useTranslation } from '../hooks/useTranslation';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
          <div className="text-xl text-gray-600">{t('history.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('history.title')}</h1>
          <p className="text-xl text-gray-600">
            {t('history.subtitle')}
          </p>
        </div>

        {/* Credit Eligibility Message */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 mb-10">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-10 h-10 text-green-600"
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
            <div className="ml-5">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {t('history.greatJob')}
              </h3>
              <p className="text-lg text-gray-700">
                {t('history.creditMessage')}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {history.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">{t('history.completedFilings')}</h2>
            <div className="space-y-8">
              {history.map((item, index) => (
                <div key={item.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-green-600"
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
                      <div className="w-0.5 h-20 bg-gray-200 mx-auto mt-3" />
                    )}
                  </div>
                  <div className="ml-5 flex-1 pb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-lg text-gray-600 mb-3">{item.description}</p>
                    <div className="mt-3 text-base text-gray-500">
                      <span>{t('history.completedOn')} {formatDate(item.completedDate)}</span>
                      {item.dueDate && (
                        <span className="ml-4">
                          {t('history.dueDate')} {formatDate(item.dueDate)}
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
              className="w-20 h-20 text-gray-400 mx-auto mb-5"
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
            <p className="text-2xl text-gray-600 mt-5">
              {t('history.noHistory')}
            </p>
          </div>
        )}

        {/* Stats */}
        {history.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-3">
                {history.length}
              </div>
              <div className="text-lg text-gray-600">{t('history.totalCompleted')}</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl font-bold text-green-600 mb-3">
                {history.filter((h) => {
                  if (!h.dueDate) return false;
                  const completed = new Date(h.completedDate || h.dueDate);
                  const due = new Date(h.dueDate);
                  return completed <= due;
                }).length}
              </div>
              <div className="text-lg text-gray-600">{t('history.onTime')}</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-3">
                {Math.round((history.length / (history.length + 5)) * 100)}%
              </div>
              <div className="text-lg text-gray-600">{t('history.complianceRate')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;








