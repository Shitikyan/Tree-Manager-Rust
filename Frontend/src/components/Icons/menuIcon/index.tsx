'use client';

import './index.scss';

interface MenuIconProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function MenuIcon({ isOpen, onClick }: MenuIconProps) {
  return (
    <div onClick={onClick} className={`menu-icon${isOpen ? ' opened' : ''}`}>
      <div className="bar bar-1"></div>
      <div className="bar bar-2"></div>
      <div className="bar bar-3"></div>
    </div>
  );
}
