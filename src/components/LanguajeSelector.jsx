import { useRouter } from 'next/router'; 
import React, { useState, useEffect } from 'react';

const LanguageSelector = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguage, setLanguage] = useState('EN');
  const router = useRouter();

  useEffect(() => {
    const currentPath = router.asPath;
    const language = currentPath.split('/')[1].toUpperCase();
    setLanguage(language);
  }, [router.asPath]);

  const changeLanguage = (lg) => {
    const currentPath = router.asPath;
    const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${lg.toLowerCase()}`);
    router.replace(newPath);
    setLanguage(lg);
    toggleMenu();
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex min-w-20 w-full justify-center gap-x-1.5 rounded-md dark:text-zinc-400 dark:hover:text-white dark:backdrop-blur px-3 transition-all py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset dark:ring-neutral-700 ring-gray-300 "
          id="menu-button"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          onClick={toggleMenu}
        >
           {isLanguage}
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-20 origin-top-right rounded-md dark:ring-neutral-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            <a href="#"  onClick={() => changeLanguage('EN')}  className="  dark:text-zinc-400 text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-1">
              EN
            </a>
            <a href="#" onClick={() => changeLanguage('ES')} className="  dark:text-zinc-400 text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-0">
              ES
            </a>
            <a href="#" onClick={() => changeLanguage('PT')} className="  dark:text-zinc-400 text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-2">
              PT
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector
