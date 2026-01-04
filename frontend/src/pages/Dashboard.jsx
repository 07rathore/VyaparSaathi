import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useTranslation } from '../hooks/useTranslation';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();


  const loadDashboard = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      if (response.data.onboardingRequired) {
        navigate('/onboarding');
        return;
      }
      setDashboardData(response.data);
    } catch (error) {
      console.error('Dashboard error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">{t('dashboard.loading')}</div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return t('dashboard.safe');
    if (score >= 50) return t('dashboard.attentionNeeded');
    return t('dashboard.highRiskLabel');
  };

  const getRiskColor = (risk) => {
    if (risk === 'low') return 'bg-green-500';
    if (risk === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('dashboard.title')}</h1>
          <p className="text-xl text-gray-600">{t('dashboard.subtitle')}</p>
        </div>

        {/* Compliance Confidence Score */}
        <div className="bg-white rounded-lg shadow-lg p-10 mb-10">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-gray-700 mb-6">
              {t('dashboard.confidenceScore')}
            </h2>
            <div
              className={`inline-flex items-center justify-center w-56 h-56 rounded-full ${getScoreColor(
                dashboardData.confidenceScore
              )} mb-6`}
            >
              <div className="text-center">
                <div className="text-7xl font-bold">{dashboardData.confidenceScore}</div>
                <div className="text-2xl font-medium mt-3">{getScoreLabel(dashboardData.confidenceScore)}</div>
              </div>
            </div>
            <p className="text-gray-600 text-xl">{dashboardData.statusMessage}</p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-600 mb-2">{t('dashboard.totalCompliances')}</p>
                <p className="text-4xl font-bold text-gray-900">
                  {dashboardData.totalCompliances}
                </p>
              </div>
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-primary-600"
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-600 mb-2">{t('dashboard.completed')}</p>
                <p className="text-4xl font-bold text-green-600">
                  {dashboardData.completedCompliances}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-600 mb-2">{t('dashboard.pendingActions')}</p>
                <p className="text-4xl font-bold text-red-600">
                  {dashboardData.pendingCount}
                </p>
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Indicator */}
        <div className="bg-white rounded-lg shadow p-8 mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{t('dashboard.riskLevel')}</h3>
              <p className="text-lg text-gray-600">
                {dashboardData.riskLevel === 'low' && t('dashboard.lowRisk')}
                {dashboardData.riskLevel === 'medium' && t('dashboard.mediumRisk')}
                {dashboardData.riskLevel === 'high' && t('dashboard.highRisk')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`w-5 h-5 rounded-full ${getRiskColor(dashboardData.riskLevel)}`}
              />
              <span className="text-base font-medium text-gray-700 capitalize">
                {dashboardData.riskLevel} {t('dashboard.risk')}
              </span>
            </div>
          </div>
        </div>

        {/* Next Upcoming Deadline */}
        {dashboardData.upcoming && (
          <div className="bg-white rounded-lg shadow p-8 mb-10">
            <h3 className="text-2xl font-semibold text-gray-900 mb-5">{t('dashboard.nextDeadline')}</h3>
            <div className="border-l-4 border-primary-600 pl-5">
              <p className="text-2xl font-medium text-gray-900 mb-2">{dashboardData.upcoming.name}</p>
              <p className="text-lg text-gray-600 mb-4">
                {t('dashboard.dueIn')} {dashboardData.upcoming.daysUntil} {dashboardData.upcoming.daysUntil > 1 ? t('dashboard.daysPlural') : t('dashboard.days')}
              </p>
              <button
                onClick={() => navigate('/actions')}
                className="mt-4 px-6 py-3 text-base bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium"
              >
                {t('dashboard.viewAllActions')}
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/actions')}
            className="bg-white rounded-lg shadow p-8 text-left hover:shadow-lg transition-shadow"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">{t('dashboard.todaysActions')}</h3>
            <p className="text-lg text-gray-600">{t('dashboard.todaysActionsDesc')}</p>
          </button>
          <button
            onClick={() => navigate('/copilot')}
            className="bg-white rounded-lg shadow p-8 text-left hover:shadow-lg transition-shadow"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">{t('dashboard.askCopilot')}</h3>
            <p className="text-lg text-gray-600">{t('dashboard.askCopilotDesc')}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;








