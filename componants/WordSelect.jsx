import socket from '@/utils/socket';
import React from 'react';

const WordSelect = ({ words, onSelect }) => {
  const handleSelect = (word) => {
    onSelect(word); // send selected word to parent
  };

  return (
    <div className="popup-container w-screen h-screen bg-black/40 fixed top-0 left-0 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center w-full max-w-md">
        <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4 text-center">Pick a word</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          {words.map((word, index) => (
            <button
              key={index}
              onClick={() => handleSelect(word)}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-lg sm:text-xl font-semibold text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordSelect;
