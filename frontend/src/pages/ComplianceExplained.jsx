import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';

const ComplianceExplained = () => {
  const [compliances, setCompliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [explanations, setExplanations] = useState({});
  const { t, language } = useTranslation();

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
      const response = await axios.post('/api/ai/explain', { 
        ruleId,
        language: language 
      });
      setExplanations((prev) => ({ ...prev, [ruleId]: response.data.explanation }));
    } catch (error) {
      console.error('Explanation error:', error);
      setExplanations((prev) => ({
        ...prev,
        [ruleId]: t('compliance.loadingExplanation'),
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
          <div className="text-xl text-gray-600">{t('compliance.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('compliance.title')}</h1>
          <p className="text-xl text-gray-600">
            {t('compliance.subtitle')}
          </p>
        </div>

        {compliances.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-2xl text-gray-600">
              {t('compliance.noCompliances')}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {compliances.map((compliance) => (
              <div
                key={compliance.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                        {compliance.name}
                      </h3>
                      <p className="text-lg text-gray-600 mb-5">{compliance.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-base">
                        <div>
                          <span className="font-medium text-gray-700">{t('compliance.frequency')}</span>
                          <span className="ml-2 text-gray-600 capitalize">
                            {compliance.frequency}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">{t('compliance.deadline')}</span>
                          <span className="ml-2 text-gray-600">
                            {getDueDateText(compliance)}
                          </span>
                        </div>
                        {compliance.penalty && (
                          <div>
                            <span className="font-medium text-gray-700">{t('compliance.penalty')}</span>
                            <span className="ml-2 text-gray-600">{t('penalty.mayApply')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(compliance.id, compliance.ruleId)}
                    className="w-full mt-5 px-6 py-3 text-base bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 font-medium"
                  >
                    {expandedId === compliance.id
                      ? t('common.hideExplanation')
                      : t('common.showExplanation')}
                  </button>

                  {expandedId === compliance.id && (
                    <div className="mt-5 p-5 bg-primary-50 rounded-lg border border-primary-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        {t('compliance.explainedInSimpleTerms')}
                      </h4>
                      {explanations[compliance.ruleId] ? (
                        <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {explanations[compliance.ruleId]}
                        </p>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-base text-gray-600">{t('compliance.loadingExplanation')}</span>
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








