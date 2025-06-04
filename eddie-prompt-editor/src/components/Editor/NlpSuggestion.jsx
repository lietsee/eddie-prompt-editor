import React, { useEffect, useState, useRef, useCallback } from 'react';
import { applyBrackets } from '../../utils/nlpProcessor';

export function NlpSuggestion({ 
  text, 
  suggestions, 
  onApplySuggestion,
  textareaRef 
}) {
  const [visibleSuggestions, setVisibleSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionRefs = useRef({});

  useEffect(() => {
    // Filter out suggestions that are already bracketed
    const filtered = suggestions.filter(suggestion => {
      const beforeChar = suggestion.startIndex > 0 ? text[suggestion.startIndex - 1] : '';
      const afterChar = suggestion.endIndex < text.length ? text[suggestion.endIndex] : '';
      return !(beforeChar === '[' && afterChar === ']');
    });
    setVisibleSuggestions(filtered);
    setSelectedIndex(-1);
  }, [suggestions, text]);

  const handleApplySuggestion = useCallback((suggestion) => {
    const newText = applyBrackets(text, suggestion);
    onApplySuggestion(newText, suggestion);
  }, [text, onApplySuggestion]);

  const getSuggestionPosition = (suggestion) => {
    if (!textareaRef?.current) return null;

    const textarea = textareaRef.current;
    const textBeforeSuggestion = text.substring(0, suggestion.startIndex);
    const lines = textBeforeSuggestion.split('\n');
    const lineNumber = lines.length - 1;
    const columnNumber = lines[lines.length - 1].length;

    // Simple approximation - this would need more sophisticated calculation
    // for accurate positioning with different fonts and sizes
    const lineHeight = 24; // Approximate line height
    const charWidth = 8; // Approximate character width
    
    const top = lineNumber * lineHeight + textarea.offsetTop;
    const left = columnNumber * charWidth + textarea.offsetLeft;

    return { top, left };
  };

  if (visibleSuggestions.length === 0) return null;

  return (
    <div className="relative">
      {visibleSuggestions.slice(0, 5).map((suggestion, index) => {
        const position = getSuggestionPosition(suggestion);
        if (!position) return null;

        return (
          <div
            key={`${suggestion.text}-${suggestion.startIndex}`}
            ref={el => suggestionRefs.current[index] = el}
            className={`absolute z-10 ${
              selectedIndex === index ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              top: `${position.top}px`,
              left: `${position.left + suggestion.text.length * 8}px`,
            }}
          >
            <button
              className="ml-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-md shadow-sm transition-colors"
              onClick={() => handleApplySuggestion(suggestion)}
              title={`[${suggestion.text}]で囲む`}
            >
              []
            </button>
          </div>
        );
      })}
    </div>
  );
}