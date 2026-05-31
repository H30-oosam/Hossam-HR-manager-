import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CalendarDays, 
  Wallet, 
  Briefcase, 
  GraduationCap, 
  Settings, 
  LogOut,
  LayoutDashboard,
  UserPlus,
  TrendingUp,
  CheckSquare,
  Map,
  History,
  ScrollText,
  Megaphone,
  FileText,
  BarChart3,
  Shield,
  Heart,
  Rocket,
  Box,
  Calendar
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { HossamLogo } from './HossamLogo';

const Sidebar = () => {
  const { isRTL, systemName, sidebarOpen, setSidebarOpen } = useUIStore();
  const { user } = useAuthStore();


  const handleSignOut = async () => {
    await signOut(auth);
  };

  const navItems = [
    { name: isRTL ? 'لوحة القيادة' : 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: isRTL ? 'الموظفين' : 'Employees', icon: Users, path: '/employees' },
    { name: isRTL ? 'المشاريع' : 'Projects', icon: Briefcase, path: '/projects' },
    { name: isRTL ? 'المهام' : 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: isRTL ? 'الإعلانات' : 'News', icon: Megaphone, path: '/announcements' },
    { name: isRTL ? 'الهيكل التنظيمي' : 'Org Chart', icon: Users, path: '/org-chart' },
    { name: isRTL ? 'الملفات' : 'Files', icon: FileText, path: '/files' },
    { name: isRTL ? 'النماذج' : 'Documents', icon: ScrollText, path: '/documents' },
    { name: isRTL ? 'الخريطة' : 'Map', icon: Map, path: '/map' },
    { name: isRTL ? 'الأصول' : 'Assets', icon: Box, path: '/assets' },
    { name: isRTL ? 'الإجازات' : 'Leaves', icon: Calendar, path: '/leaves' },
    { name: isRTL ? 'الحضور' : 'Attendance', icon: Clock, path: '/attendance' },
    { name: isRTL ? 'الرواتب' : 'Payroll', icon: Wallet, path: '/payroll' },
    { name: isRTL ? 'التوظيف' : 'Recruitment', icon: Briefcase, path: '/recruitment' },
    { name: isRTL ? 'المرشحين' : 'Candidates', icon: UserPlus, path: '/candidates' },
    { name: isRTL ? 'الإعداد' : 'Onboarding', icon: Rocket, path: '/onboarding' },
    { name: isRTL ? 'تجربة الموظف' : 'Employee CRM', icon: Heart, path: '/crm' },
    { name: isRTL ? 'الأداء' : 'Performance', icon: TrendingUp, path: '/performance' },
    { name: isRTL ? 'التدريب' : 'Training', icon: GraduationCap, path: '/training' },
    { name: isRTL ? 'التقارير' : 'Reports', icon: BarChart3, path: '/reports' },
    { name: isRTL ? 'سجل النشاط' : 'Activity Logs', icon: History, path: '/logs' },
    { name: isRTL ? 'المستخدمين' : 'Users', icon: Shield, path: '/users' },
    { name: isRTL ? 'الإعدادات' : 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] transition-opacity duration-300 lg:hidden ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div className={`fixed top-0 bottom-0 w-72 bg-slate-950/40 backdrop-blur-3xl border-e border-white/5 flex flex-col z-[60] transition-transform duration-300 ease-out lg:translate-x-0 ${
        isRTL 
          ? `right-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}` 
          : `left-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
      }`}>
        <div className="p-6 border-b border-white/10 mb-2 flex justify-center">
          <HossamLogo size="md" lightText={true} />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 scale-[1.02]'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className={`w-5 h-5 transition-transform`} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/20">
          <div className="mb-4 px-4 py-3 flex items-center gap-3 bg-white/5 rounded-2xl border border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 font-black flex-shrink-0 border border-indigo-500/20">
               {user?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate uppercase tracking-tight">
                {user?.displayName || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate font-black uppercase tracking-widest">
                {user?.role || 'Guest'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-black text-rose-500 bg-rose-50/50 rounded-2xl hover:bg-rose-50 transition-all active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            <span>{isRTL ? 'تسجيل الخروج' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
