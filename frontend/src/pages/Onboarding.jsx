import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    workType: '',
    monthlyIncome: '',
    isGstRegistered: null,
    state: '',
    city: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await axios.get('/api/onboarding/status');
      if (response.data.completed) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('/api/onboarding/submit', answers);
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return answers.workType !== '';
      case 2:
        return answers.monthlyIncome !== '';
      case 3:
        return answers.isGstRegistered !== null;
      case 4:
        return answers.state !== '';
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 5</span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((step / 5) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What type of work do you do?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'freelancer', label: 'Freelancer / Consultant' },
                  { value: 'shop_owner', label: 'Shop Owner / Retailer' },
                  { value: 'gig_worker', label: 'Gig Worker (Delivery, Driver, etc.)' },
                  { value: 'small_business', label: 'Small Business Owner' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateAnswer('workType', option.value)}
                    className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                      answers.workType === option.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What's your approximate monthly income?
              </h2>
              <div className="space-y-3">
                {[
                  { value: '<10k', label: 'Less than ₹10,000' },
                  { value: '10k-50k', label: '₹10,000 - ₹50,000' },
                  { value: '50k-1L', label: '₹50,000 - ₹1,00,000' },
                  { value: '1L-5L', label: '₹1,00,000 - ₹5,00,000' },
                  { value: '>5L', label: 'More than ₹5,00,000' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateAnswer('monthlyIncome', option.value)}
                    className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                      answers.monthlyIncome === option.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Are you GST registered?
              </h2>
              <p className="text-gray-600 mb-6">
                Don't worry if you're not sure. We'll help you figure this out later.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => updateAnswer('isGstRegistered', true)}
                  className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                    answers.isGstRegistered === true
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  Yes, I am GST registered
                </button>
                <button
                  onClick={() => updateAnswer('isGstRegistered', false)}
                  className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                    answers.isGstRegistered === false
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  No, I'm not GST registered
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Which state are you located in?
              </h2>
              <select
                value={answers.state}
                onChange={(e) => updateAnswer('state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select your state</option>
                {[
                  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
                  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
                  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
                  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
                  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
                  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
                ].map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What city are you in? (Optional)
              </h2>
              <input
                type="text"
                value={answers.city}
                onChange={(e) => updateAnswer('city', e.target.value)}
                placeholder="Enter your city"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                This helps us provide location-specific compliance information.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : step === 5 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;








