'use client';

import React, { memo, useCallback, useState } from 'react';
import Link from 'next/link';
import MenuIcon from '../Icons/menuIcon';

import './index.scss';

const Navbar: React.FC = () => {

  const [isMobileMenuVisible, setIsMobileMenuVisible] =
    useState<boolean>(false);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuVisible((prevState) => {
      if (!prevState) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }

      return !prevState;
    });
  }, [setIsMobileMenuVisible]);

  const handleNavbarItemClick = useCallback(() => {
    if (isMobileSize && isMobileMenuVisible) {
      handleMobileMenuToggle();
    }
  }, []);

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      url: '/',
    },
    {
      id: 'about',
      label: 'About',
      url: '/about',
    },
    {
      id: 'contact',
      label: 'Contact',
      url: '/contact',
    },
    {
      id: 'sign-in',
      label: 'Sign in',
      url: '/sign-in',
    },
    {
      id: 'sign-up',
      label: 'Sign Up',
      url: '/sign-up',
    },
  ];

  const isMobileSize = true
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-container">
          <Link href="/" className="navbar-logo">
            Logo
          </Link>
          <ul
            className={`navbar-menu${isMobileSize ? ' mobile-sized' : ''}${
              isMobileSize && isMobileMenuVisible ? ' menu-opened' : ''
            }`}
          >
            {menuItems.map((item) => {
              return (
                <li
                  key={item.id}
                  onClick={handleNavbarItemClick}
                  className="navbar-item"
                >
                  <Link href={item.url}>{item.label}</Link>
                </li>
              );
            })}
          </ul>
          {isMobileSize && (
            <MenuIcon
              isOpen={isMobileMenuVisible}
              onClick={handleMobileMenuToggle}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
