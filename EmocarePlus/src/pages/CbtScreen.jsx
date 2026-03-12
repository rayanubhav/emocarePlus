import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { RiCheckFill } from 'react-icons/ri';

const steps = [
  {
    title: 'The Situation',
    field: 'situation',
    hint: 'e.g., I received critical feedback at work.',
    rows: 3,
  },
  {
    title: 'Automatic Thought',
    field: 'automatic_thought',
    hint: 'e.g., "I\'m terrible at my job."',
    rows: 3,
  },
  {
    title: 'Emotions',
    field: 'emotions',
    hint: 'e.g., Anxious, sad, ashamed.',
    rows: 2,
  },
  {
    title: 'Alternative Thought',
    field: 'alternative_thought',
    hint: 'e.g., "This feedback is a chance to learn and improve."',
    rows: 4,
  },
];


const CbtScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    situation: '',
    automatic_thought: '',
    emotions: '',
    alternative_thought: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => {
    const currentField = steps[currentStep].field;
    if (formData[currentField].trim() === '') {
      setError('Please complete this field before continuing.');
      return;
    }
    setError('');
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setError('');
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveRecord = async () => {
    if (formData.alternative_thought.trim() === '') {
      setError('Please complete the final field.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await api.post('/api/cbt-records', formData);
      setSuccess(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Error saving record.');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading || success) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-[20px] bg-surface border border-border shadow-sm p-6 text-center">
        {isLoading ? (
          <FaSpinner className="h-12 w-12 animate-spin text-primary" />
        ) : (
          <>
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary"
            >
              <RiCheckFill size={60} className="text-white" />
            </motion.div>
            <h2 className="mt-6 text-2xl font-bold text-text-main">
              Your thought record has been saved!
            </h2>
          </>
        )}
      </div>
    );
  }

  const activeStep = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[20px] bg-surface border border-border shadow-sm">
      <div className="p-6 pb-3">
        <h2 className="text-2xl font-bold text-text-main tracking-[-0.02em]">Challenge a Thought</h2>
        <p className="text-text-muted mt-1 text-[14px]">A CBT Thought Record</p>
      </div>

      {/* Enhanced progress bar */}
      <div className="px-6 pb-4">
        <div className="relative h-1.5 rounded-full bg-border overflow-hidden mb-3">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <div className="flex">
          {steps.map((step, index) => (
            <div key={step.field} className="flex-1 mr-2 last:mr-0">
              <p
                className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                  index <= currentStep ? 'text-primary' : 'text-text-muted'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] mr-1 ${
                  index < currentStep ? 'bg-primary text-white' : index === currentStep ? 'bg-primary/20 text-primary border border-primary' : 'bg-border text-text-muted'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </span>
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto bg-surface-light border-y border-border p-6 md:p-8 styled-scrollbar">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <label
            htmlFor={activeStep.field}
            className="text-xl font-bold text-text-main mb-1 block tracking-[-0.01em]"
          >
            {activeStep.title}
          </label>
          <p className="text-[12px] text-text-muted mb-3">Step {currentStep + 1} of {steps.length}</p>

          <textarea
            id={activeStep.field}
            name={activeStep.field}
            value={formData[activeStep.field]}
            onChange={handleChange}
            placeholder={activeStep.hint}
            rows={activeStep.rows}
            className="mt-1 w-full resize-none rounded-[16px] border border-border bg-surface p-4 text-[15px] leading-[1.65] text-text-main placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-[4px] focus:ring-primary/15 transition-all shadow-sm"
          />

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-[13px] font-semibold text-error">
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center p-6 gap-4 bg-surface">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="w-full sm:w-auto px-6 py-3 rounded-[14px] font-semibold text-[14px] bg-surface-light text-text-muted border border-border hover:bg-border hover:text-text-main transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>

        {currentStep === steps.length - 1 ? (
          <button
            onClick={saveRecord}
            className="w-full sm:w-auto px-8 py-3 rounded-[14px] font-bold text-[14px] bg-primary text-white hover:opacity-90 transition-all shadow-[0_4px_16px_rgba(91,155,213,0.3)]"
          >
            Save Record
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="w-full sm:w-auto px-8 py-3 rounded-[14px] font-bold text-[14px] bg-primary text-white hover:opacity-90 transition-all shadow-[0_4px_16px_rgba(91,155,213,0.3)]"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default CbtScreen;