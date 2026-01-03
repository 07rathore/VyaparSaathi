import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

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
          <div className="text-lg text-gray-600">Loading your dashboard...</div>
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
    if (score >= 75) return 'Safe';
    if (score >= 50) return 'Attention needed';
    return 'High risk';
  };

  const getRiskColor = (risk) => {
    if (risk === 'low') return 'bg-green-500';
    if (risk === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Compliance Dashboard</h1>
          <p className="text-gray-600 mt-2">Here's how you're doing today</p>
        </div>

        {/* Compliance Confidence Score */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Your Compliance Confidence Score
            </h2>
            <div
              className={`inline-flex items-center justify-center w-48 h-48 rounded-full ${getScoreColor(
                dashboardData.confidenceScore
              )} mb-4`}
            >
              <div className="text-center">
                <div className="text-6xl font-bold">{dashboardData.confidenceScore}</div>
                <div className="text-xl font-medium mt-2">{getScoreLabel(dashboardData.confidenceScore)}</div>
              </div>
            </div>
            <p className="text-gray-600 text-lg">{dashboardData.statusMessage}</p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Compliances</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardData.totalCompliances}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-600"
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

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {dashboardData.completedCompliances}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {dashboardData.pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
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
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Risk Level</h3>
              <p className="text-gray-600 mt-1">
                {dashboardData.riskLevel === 'low' && "You're in good shape! Keep it up."}
                {dashboardData.riskLevel === 'medium' &&
                  'A few actions need your attention. No worries, we can help!'}
                {dashboardData.riskLevel === 'high' &&
                  "Let's get you back on track. We're here to help!"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full ${getRiskColor(dashboardData.riskLevel)}`}
              />
              <span className="text-sm font-medium text-gray-700 capitalize">
                {dashboardData.riskLevel} Risk
              </span>
            </div>
          </div>
        </div>

        {/* Next Upcoming Deadline */}
        {dashboardData.upcoming && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Upcoming Deadline</h3>
            <div className="border-l-4 border-primary-600 pl-4">
              <p className="text-xl font-medium text-gray-900">{dashboardData.upcoming.name}</p>
              <p className="text-gray-600 mt-1">
                Due in {dashboardData.upcoming.daysUntil} day{dashboardData.upcoming.daysUntil > 1 ? 's' : ''}
              </p>
              <button
                onClick={() => navigate('/actions')}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                View All Actions
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/actions')}
            className="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Actions</h3>
            <p className="text-gray-600">See what you need to do today</p>
          </button>
          <button
            onClick={() => navigate('/copilot')}
            className="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask AI Copilot</h3>
            <p className="text-gray-600">Get answers to your compliance questions</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;








