import React from 'react';
import { Bell, Search, Globe, Sun, Moon, Menu, X } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

const Navbar = () => {
  const { isRTL, toggleRTL, theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <header className="h-20 bg-slate-900/40 backdrop-blur-3xl border-b border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2.5 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all shadow-sm lg:hidden active:scale-95"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        <div className="hidden md:block w-full max-w-sm">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder={isRTL ? 'ابحث هنا...' : 'Global Search...'}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-white/5 transition-all placeholder:text-white/20"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleRTL}
          className="p-2 text-white/60 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
          title={isRTL ? 'English' : 'العربية'}
        >
          <Globe className="w-5 h-5" />
          <span className="text-sm font-black uppercase tracking-widest">{isRTL ? 'EN' : 'AR'}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 text-white/60 hover:bg-white/10 rounded-lg transition-colors"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <button className="p-2 text-white/60 hover:bg-white/10 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
        </button>

        <div className="h-8 w-px bg-white/10 mx-2"></div>

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
