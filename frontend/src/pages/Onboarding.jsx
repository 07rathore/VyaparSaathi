import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

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
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
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
        {/* Language Toggle - Top Right */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-2"
            title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
          >
            <span className="text-base">{language === 'en' ? '🇮🇳' : '🇬🇧'}</span>
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-3">
            <span className="text-base font-medium text-gray-700">
              {t('onboarding.step')} {step} {t('onboarding.of')} 5
            </span>
            <span className="text-base font-medium text-gray-700">
              {Math.round((step / 5) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('onboarding.step1.title')}
              </h2>
              <div className="space-y-4">
                {[
                  { value: 'freelancer', label: t('onboarding.step1.freelancer') },
                  { value: 'shop_owner', label: t('onboarding.step1.shopOwner') },
                  { value: 'gig_worker', label: t('onboarding.step1.gigWorker') },
                  { value: 'small_business', label: t('onboarding.step1.smallBusiness') },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateAnswer('workType', option.value)}
                    className={`w-full text-left px-6 py-5 text-base rounded-lg border-2 transition-all ${
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('onboarding.step2.title')}
              </h2>
              <div className="space-y-4">
                {[
                  { value: '<10k', label: t('onboarding.step2.lessThan10k') },
                  { value: '10k-50k', label: t('onboarding.step2.10kTo50k') },
                  { value: '50k-1L', label: t('onboarding.step2.50kTo1L') },
                  { value: '1L-5L', label: t('onboarding.step2.1LTo5L') },
                  { value: '>5L', label: t('onboarding.step2.moreThan5L') },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateAnswer('monthlyIncome', option.value)}
                    className={`w-full text-left px-6 py-5 text-base rounded-lg border-2 transition-all ${
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('onboarding.step3.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('onboarding.step3.description')}
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => updateAnswer('isGstRegistered', true)}
                  className={`w-full text-left px-6 py-5 text-base rounded-lg border-2 transition-all ${
                    answers.isGstRegistered === true
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {t('onboarding.step3.yes')}
                </button>
                <button
                  onClick={() => updateAnswer('isGstRegistered', false)}
                  className={`w-full text-left px-6 py-5 text-base rounded-lg border-2 transition-all ${
                    answers.isGstRegistered === false
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {t('onboarding.step3.no')}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('onboarding.step4.title')}
              </h2>
              <select
                value={answers.state}
                onChange={(e) => updateAnswer('state', e.target.value)}
                className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{t('onboarding.step4.selectState')}</option>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('onboarding.step5.title')}
              </h2>
              <input
                type="text"
                value={answers.city}
                onChange={(e) => updateAnswer('city', e.target.value)}
                placeholder={t('onboarding.step5.placeholder')}
                className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-base text-gray-500 mt-3">
                {t('onboarding.step5.description')}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-3 text-base border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {t('common.back')}
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="px-6 py-3 text-base bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? t('onboarding.saving') : step === 5 ? t('common.complete') : t('common.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;








