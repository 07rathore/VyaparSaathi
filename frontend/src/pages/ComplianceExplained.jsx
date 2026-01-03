import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ComplianceExplained = () => {
  const [compliances, setCompliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [explanations, setExplanations] = useState({});

  useEffect(() => {
    loadCompliances();
  }, []);

  const loadCompliances = async () => {
    try {
      const response = await axios.get('/api/actions/today');
      setCompliances(response.data.actions);
    } catch (error) {
      console.error('Compliance error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExplanation = async (ruleId) => {
    if (explanations[ruleId]) {
      return; // Already loaded
    }

    try {
      const response = await axios.post('/api/ai/explain', { ruleId });
      setExplanations((prev) => ({ ...prev, [ruleId]: response.data.explanation }));
    } catch (error) {
      console.error('Explanation error:', error);
      setExplanations((prev) => ({
        ...prev,
        [ruleId]: 'Unable to load explanation. Please try again later.',
      }));
    }
  };

  const toggleExpand = (id, ruleId) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (ruleId && !explanations[ruleId]) {
        loadExplanation(ruleId);
      }
    }
  };

  const getDueDateText = (action) => {
    if (action.dueDate) {
      const date = new Date(action.dueDate);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return 'No deadline specified';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600">Loading compliances...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Explained</h1>
          <p className="text-gray-600 mt-2">
            Simple explanations of what applies to you and what you need to do
          </p>
        </div>

        {compliances.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-xl text-gray-600">
              No compliances found. Complete onboarding to see what applies to you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {compliances.map((compliance) => (
              <div
                key={compliance.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {compliance.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{compliance.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Frequency:</span>
                          <span className="ml-2 text-gray-600 capitalize">
                            {compliance.frequency}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Deadline:</span>
                          <span className="ml-2 text-gray-600">
                            {getDueDateText(compliance)}
                          </span>
                        </div>
                        {compliance.penalty && (
                          <div>
                            <span className="font-medium text-gray-700">Penalty:</span>
                            <span className="ml-2 text-gray-600">{compliance.penalty}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(compliance.id, compliance.ruleId)}
                    className="w-full mt-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 font-medium"
                  >
                    {expandedId === compliance.id
                      ? 'Hide Simple Explanation'
                      : 'Show Simple Explanation'}
                  </button>

                  {expandedId === compliance.id && (
                    <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Explained in Simple Terms:
                      </h4>
                      {explanations[compliance.ruleId] ? (
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {explanations[compliance.ruleId]}
                        </p>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-gray-600">Loading explanation...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceExplained;








