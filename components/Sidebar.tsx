
import React from 'react';
import { NavLink } from 'react-router-dom';
// FIX: Added LogoutIcon to the import from constants.
import { NAV_ITEMS, LogoutIcon } from '../constants.tsx';
import { NavItemType } from '../types.ts';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Logo = () => (
    <div className="flex items-center space-x-2 px-4 mb-6">
        <div className="grid grid-cols-2 gap-1">
            <span className="w-4 h-4 bg-blue-500 rounded-sm"></span>
            <span className="w-4 h-4 bg-red-500 rounded-sm"></span>
            <span className="w-4 h-4 bg-yellow-400 rounded-sm"></span>
            <span className="w-4 h-4 bg-green-500 rounded-sm"></span>
        </div>
        <span className="font-bold text-xl text-slate-800">ExamRedi</span>
    </div>
);

const NavItem: React.FC<{ item: NavItemType }> = ({ item }) => (
    <NavLink
        to={item.path}
        className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-primary-light text-primary font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`
        }
    >
        {item.icon}
        <span>{item.name}</span>
    </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
      <>
        {/* Backdrop for mobile */}
        <div
            className={`fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`}
            onClick={onClose}
            aria-hidden="true"
        ></div>

        <aside 
            className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col p-4 transform transition-transform duration-300 ease-in-out z-40
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            md:relative md:translate-x-0 md:z-auto`}
        >
            <Logo />
            <nav className="flex-1 space-y-2">
                {NAV_ITEMS.map((item) => (
                    <NavItem key={item.path} item={item} />
                ))}
            </nav>
            <div className="mt-auto space-y-4">
                <button className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200">
                    Upgrade
                </button>
                <button className="flex items-center space-x-3 w-full text-red-500 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200">
                    <LogoutIcon />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
      </>
    );
};

export default Sidebar;