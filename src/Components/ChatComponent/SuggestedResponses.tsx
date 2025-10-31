import React from 'react';
import { IoSparklesOutline } from 'react-icons/io5';

const suggestions = [
  "What are the most common customer inquiries?",
  "Show me top performing dealers by region",
  "What products have the highest satisfaction rates?",
  "Analyze recent chat conversation trends",
  "Which facilities need attention based on performance metrics?",
  "What are the FAQ topics with lowest effectiveness?"
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
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSuggestionClick(suggestion);
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
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