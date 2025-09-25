import React from 'react';
import { IoSparklesOutline } from 'react-icons/io5';

const suggestions = [
  "Can I see AiprlAssist trained on my website?",
  "How can AiprlAssist integrate with my existing CRM and tools seamlessly?",
  "Help me improve my inbound conversion rates",
  "How does AiprlAssist ensure data privacy and compliance with GDPR?",
];

interface SuggestedResponsesProps {
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestedResponses: React.FC<SuggestedResponsesProps> = ({ onSuggestionClick }) => {
  return (
    <div className="p-3 bg-black rounded-lg shadow-inner shadow-orange-400 border border-orange-400/20 animate-fadeIn">
      <p className="text-gray-300 text-sm mb-2">Inspiration questions:</p>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="flex items-start cursor-pointer text-left p-2 rounded-md hover:bg-gray-100/10 transition-colors text-sm text-gray-200 w-full group"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <IoSparklesOutline className="w-4 h-4 text-purple-400 mr-2 mt-0.5 group-hover:text-orange-400 transition-colors" />
            <span className="group-hover:text-white transition-colors">
              {suggestion}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedResponses;