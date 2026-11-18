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
          className="inline-flex h-10 items-center gap-1 rounded-full px-2.5 font-mono text-xs font-medium text-bb-ink2 transition hover:bg-bb-chip hover:text-bb-head"
          aria-label={`Language: ${isLanguage}`}
          id="menu-button"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          onClick={toggleMenu}
        >
           {isLanguage}
          <svg
            className="h-4 w-4 text-bb-mute"
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
          className="absolute right-0 z-10 mt-2 w-20 origin-top-right rounded-xl bg-bb-bg2 p-1 shadow-lg ring-1 ring-bb-line focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            <a href="#"  onClick={() => changeLanguage('EN')}  className="block rounded-lg px-3 py-1.5 font-mono text-xs text-bb-ink2 hover:bg-bb-chip hover:text-bb-head" role="menuitem" tabIndex="-1" id="menu-item-1">
              EN
            </a>
            <a href="#" onClick={() => changeLanguage('ES')} className="block rounded-lg px-3 py-1.5 font-mono text-xs text-bb-ink2 hover:bg-bb-chip hover:text-bb-head" role="menuitem" tabIndex="-1" id="menu-item-0">
              ES
            </a>
            <a href="#" onClick={() => changeLanguage('PT')} className="block rounded-lg px-3 py-1.5 font-mono text-xs text-bb-ink2 hover:bg-bb-chip hover:text-bb-head" role="menuitem" tabIndex="-1" id="menu-item-2">
              PT
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector
