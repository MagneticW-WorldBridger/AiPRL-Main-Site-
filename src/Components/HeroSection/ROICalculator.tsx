import React, { useState, useEffect } from 'react';
import { X, Calculator, TrendingUp, DollarSign, Clock, Users } from 'lucide-react';
import { useCounterAnimation } from '../../hooks/useCounterAnimation';

interface ROICalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  monthlyRevenue: string;
  customerCount: string;
  supportHours: string;
  supportStaff: string;
  responseTime: string;
}

interface ROICalculation {
  currentCost: number;
  potentialSavings: number;
  roi: number;
  paybackPeriod: number;
  monthlySavings: number;
}

interface AnimatedMetricProps {
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
  icon: React.ReactNode;
  label: string;
  decimals?: number;
}

const AnimatedMetric: React.FC<AnimatedMetricProps> = ({ 
  value, 
  prefix = '', 
  suffix = '', 
  color, 
  icon, 
  label,
  decimals = 0
}) => {
  const { count, elementRef } = useCounterAnimation({
    end: value,
    prefix,
    suffix,
    duration: 2000,
    decimals
  });

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/20" ref={elementRef}>
      <div className="flex items-center gap-3 mb-2">
        <div className={color}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>
        {count}
      </div>
    </div>
  );
};

export const ROICalculator: React.FC<ROICalculatorProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    monthlyRevenue: '',
    customerCount: '',
    supportHours: '',
    supportStaff: '',
    responseTime: ''
  });

  const [calculation, setCalculation] = useState<ROICalculation | null>(null);
  const [step, setStep] = useState(1);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateROI = () => {
    const hours = parseFloat(formData.supportHours) || 0;
    const staff = parseFloat(formData.supportStaff) || 0;

    // Calculate current support costs (assuming $25/hour average support cost)
    const hourlyRate = 25;
    const currentCost = hours * hourlyRate * staff;

    // Calculate potential savings with AI Assistant
    const efficiencyGain = 0.6; // 60% efficiency gain
    const timeReduction = 0.4; // 40% time reduction

    const reducedHours = hours * (1 - timeReduction);
    const reducedStaff = Math.ceil(staff * (1 - efficiencyGain));
    const newCost = reducedHours * hourlyRate * reducedStaff;

    const monthlySavings = currentCost - newCost;
    const annualSavings = monthlySavings * 12;
    const aiCost = 2500; // Average AI Assistant cost
    const roi = ((annualSavings - aiCost) / aiCost) * 100;
    const paybackPeriod = aiCost / monthlySavings;

    setCalculation({
      currentCost,
      potentialSavings: annualSavings,
      roi,
      paybackPeriod,
      monthlySavings
    });
  };

  const resetForm = () => {
    setFormData({
      monthlyRevenue: '',
      customerCount: '',
      supportHours: '',
      supportStaff: '',
      responseTime: ''
    });
    setCalculation(null);
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900/95 rounded-2xl shadow-2xl border border-orange-500/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#fd8a0d]/20 rounded-lg">
              <Calculator className="w-5 h-5 text-[#fd8a0d]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">ROI Calculator</h2>
              <p className="text-sm text-gray-400">Calculate your potential savings</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {!calculation ? (
            <div className="space-y-6">
              {/* Step 1: Business Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Tell us about your business</h3>
                    <p className="text-sm text-gray-400">This helps us calculate your potential ROI</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Monthly Revenue ($)
                      </label>
                      <input
                        type="number"
                        value={formData.monthlyRevenue}
                        onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]"
                        placeholder="e.g., 50000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Number of Customers
                      </label>
                      <input
                        type="number"
                        value={formData.customerCount}
                        onChange={(e) => handleInputChange('customerCount', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]"
                        placeholder="e.g., 1000"
                      />
                    </div>
                  </div>
                  
                    <button
                      onClick={() => setStep(2)}
                      disabled={!formData.monthlyRevenue || !formData.customerCount}
                      className="w-full bg-[#fd8a0d] hover:bg-[#fd8a0d]/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      Next Step
                    </button>
                </div>
              )}

              {/* Step 2: Support Info */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Current support operations</h3>
                    <p className="text-sm text-gray-400">Help us understand your current support costs</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Support Hours per Month
                      </label>
                      <input
                        type="number"
                        value={formData.supportHours}
                        onChange={(e) => handleInputChange('supportHours', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]"
                        placeholder="e.g., 160"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Support Staff Count
                      </label>
                      <input
                        type="number"
                        value={formData.supportStaff}
                        onChange={(e) => handleInputChange('supportStaff', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]"
                        placeholder="e.g., 2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Average Response Time (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.responseTime}
                        onChange={(e) => handleInputChange('responseTime', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]"
                        placeholder="e.g., 30"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={calculateROI}
                      disabled={!formData.supportHours || !formData.supportStaff || !formData.responseTime}
                      className="flex-1 bg-[#fd8a0d] hover:bg-[#fd8a0d]/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      Calculate ROI
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Results */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Your ROI Analysis</h3>
                <p className="text-sm text-gray-400">Based on your current operations</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatedMetric
                  value={calculation.monthlySavings}
                  prefix="$"
                  color="text-green-600"
                  icon={<DollarSign className="w-5 h-5" />}
                  label="Monthly Savings"
                />

                <AnimatedMetric
                  value={calculation.roi}
                  suffix="%"
                  color="text-blue-600"
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Annual ROI"
                />

                <AnimatedMetric
                  value={calculation.paybackPeriod}
                  suffix=" months"
                  color="text-[#fd8a0d]"
                  icon={<Clock className="w-5 h-5" />}
                  label="Payback Period"
                  decimals={1}
                />

                <AnimatedMetric
                  value={calculation.potentialSavings}
                  prefix="$"
                  color="text-purple-600"
                  icon={<Users className="w-5 h-5" />}
                  label="Annual Savings"
                />
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-[#fd8a0d]/10 to-blue-600/10 rounded-lg p-4 border border-[#fd8a0d]/20">
                <h4 className="font-semibold text-white mb-2">Summary</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  With AiPRL AI Assistant, you could save approximately <strong className="text-green-600">${calculation.monthlySavings.toLocaleString()}</strong> per month, 
                  achieving a <strong className="text-blue-600">{calculation.roi.toFixed(0)}% ROI</strong> and paying back your investment in just{' '}
                  <strong className="text-[#fd8a0d]">{calculation.paybackPeriod.toFixed(1)} months</strong>.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Calculate Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-[#fd8a0d] hover:bg-[#fd8a0d]/80 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
