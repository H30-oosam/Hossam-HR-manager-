import React from 'react';
import { Bell, Search, Globe, Sun, Moon, Menu, X } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

const Navbar = () => {
  const { isRTL, toggleRTL, theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <header className="h-20 bg-white/40 backdrop-blur-xl border-b border-white/40 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm lg:hidden active:scale-95"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        <div className="hidden md:block w-full max-w-sm">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder={isRTL ? 'ابحث هنا...' : 'Global Search...'}
              className="w-full bg-white/60 border border-white/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleRTL}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          title={isRTL ? 'English' : 'العربية'}
        >
          <Globe className="w-5 h-5" />
          <span className="text-sm font-medium">{isRTL ? 'EN' : 'AR'}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            {/* User info already in sidebar for small screens, keeping space here for consistency */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
