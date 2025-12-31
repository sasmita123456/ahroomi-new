"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";

const AnimatedSearchBar = () => {
  const searchPhrases = [
    "Personal Care",
    "Hair Growth", 
    "Vitamin C",
    "Essential Oils",
    "Fragrances",
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const placeholderRef = useRef<HTMLSpanElement>(null);

  // Typing animation effect
  useEffect(() => {
    const currentPhrase = searchPhrases[currentPhraseIndex];
    
    const handleTyping = () => {
      if (isDeleting) {
        setCurrentText(prev => prev.slice(0, -1));
      } else {
        setCurrentText(prev => currentPhrase.slice(0, prev.length + 1));
      }
    };

    const typingSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && currentText === currentPhrase) {
      setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentPhraseIndex(prev => (prev + 1) % searchPhrases.length);
    }

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, currentPhraseIndex, isDeleting]);

  // Handle focus/blur
  useEffect(() => {
    if (isFocused || searchQuery) {
      setShowPlaceholder(false);
    } else {
      setShowPlaceholder(true);
    }
  }, [isFocused, searchQuery]);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Add search logic here
    }
  };

  // Handle click on placeholder
  const handlePlaceholderClick = () => {
    setShowPlaceholder(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
      <div className="relative">
        {/* Main Input Container */}
        <div className="relative bg-white rounded-full shadow-sm border border-gray-200 hover:border-[#22a6dd]/50 transition-all duration-300 overflow-hidden group">
          <div className="flex items-center w-[230px]">
            {/* Search Icon - Fixed position */}
            <div className="pl-4 pr-2 shrink-0">
              <FiSearch className="w-5 h-5 text-gray-500 group-hover:text-[#22a6dd] transition-colors duration-300" />
            </div>

            {/* Input Field */}
            <div className="flex-1 relative min-h-11 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full py-3 px-2 text-gray-900 bg-transparent focus:outline-none text-sm absolute inset-0 z-10"
                aria-label="Search products"
              />
              
              {/* Animated Placeholder - Only shows when input is empty and not focused */}
              {showPlaceholder && (
                <span
                  ref={placeholderRef}
                  onClick={handlePlaceholderClick}
                  className="absolute inset-0 py-3 px-2 text-gray-400 text-sm flex items-center cursor-text z-0 select-none"
                  aria-hidden="true"
                >
                  Search for{" "}
                  <span className="text-[#22a6dd] font-medium ml-1">
                    {currentText}
                    <span className="inline-block w-0.5 h-4 bg-[#22a6dd] ml-px align-middle animate-pulse">
                      {!isDeleting && currentText.length < searchPhrases[currentPhraseIndex].length ? "|" : ""}
                    </span>
                  </span>
                </span>
              )}
            </div>

      
          </div>
        </div>
      </div>
    </form>
  );
};

export default AnimatedSearchBar;