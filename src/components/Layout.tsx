import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useUIStore } from '../store/uiStore';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isRTL } = useUIStore();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = isRTL ? 'ar' : 'en';
  }, [isRTL]);

  return (
    <div className={`min-h-screen flex ${isRTL ? 'rtl' : 'ltr'} bg-slate-50/50`}>
      <Sidebar />
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isRTL ? 'lg:mr-72' : 'lg:ml-72'
      }`}>
        <Navbar />
        <div className="p-4 md:p-8 pb-16 w-full max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;
