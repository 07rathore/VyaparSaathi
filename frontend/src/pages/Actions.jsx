import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Actions = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      const response = await axios.get('/api/actions/today');
      setActions(response.data.actions);
    } catch (error) {
      console.error('Actions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (id) => {
    try {
      await axios.post(`/api/actions/${id}/complete`);
      loadActions();
    } catch (error) {
      console.error('Complete error:', error);
      alert('Failed to mark as complete');
    }
  };

  const markNotApplicable = async (id) => {
    try {
      await axios.post(`/api/actions/${id}/not-applicable`);
      loadActions();
    } catch (error) {
      console.error('Not applicable error:', error);
      alert('Failed to update');
    }
  };

  const getStatusBadge = (action) => {
    if (action.status === 'completed') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          ✓ Done
        </span>
      );
    }
    if (action.status === 'not_applicable') {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
          Not Applicable
        </span>
      );
    }
    if (action.isOverdue) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Overdue
        </span>
      );
    }
    if (action.isDueToday) {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          Due Today
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
        Pending
      </span>
    );
  };

  const getDueDateText = (action) => {
    if (action.dueDate) {
      const date = new Date(action.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(date);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        return `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`;
      } else if (dueDate.getTime() === today.getTime()) {
        return 'Due today';
      } else {
        return `Due in ${action.daysUntil} day${action.daysUntil > 1 ? 's' : ''}`;
      }
    }
    return 'No deadline';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600">Loading actions...</div>
        </div>
      </div>
    );
  }

  const pendingActions = actions.filter((a) => a.status === 'pending');
  const completedActions = actions.filter((a) => a.status === 'completed');
  const notApplicableActions = actions.filter((a) => a.status === 'not_applicable');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Today's Actions</h1>
          <p className="text-gray-600 mt-2">
            Here's what you need to do to stay compliant
          </p>
        </div>

        {/* Pending Actions */}
        {pendingActions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pending ({pendingActions.length})
            </h2>
            <div className="space-y-4">
              {pendingActions.map((action) => (
                <div
                  key={action.id}
                  className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-600"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {action.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{action.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📅 {getDueDateText(action)}</span>
                        <span>🔄 {action.frequency}</span>
                        {action.penalty && <span>⚠️ {action.penalty}</span>}
                      </div>
                    </div>
                    <div className="ml-4">{getStatusBadge(action)}</div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => markComplete(action.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                    >
                      Mark as Done
                    </button>
                    <button
                      onClick={() => markNotApplicable(action.id)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                    >
                      Not Applicable
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Actions */}
        {completedActions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Completed ({completedActions.length})
            </h2>
            <div className="space-y-4">
              {completedActions.map((action) => (
                <div
                  key={action.id}
                  className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 opacity-75"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {action.name}
                      </h3>
                      <p className="text-gray-600">{action.description}</p>
                    </div>
                    <div className="ml-4">{getStatusBadge(action)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Not Applicable Actions */}
        {notApplicableActions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Not Applicable ({notApplicableActions.length})
            </h2>
            <div className="space-y-4">
              {notApplicableActions.map((action) => (
                <div
                  key={action.id}
                  className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-300 opacity-75"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {action.name}
                      </h3>
                      <p className="text-gray-600">{action.description}</p>
                    </div>
                    <div className="ml-4">{getStatusBadge(action)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {actions.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-xl text-gray-600">
              No actions found. You're all set! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Actions;








