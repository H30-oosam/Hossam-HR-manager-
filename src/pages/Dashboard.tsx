import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, UserCheck, Calendar, Wallet, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Briefcase
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';

const data = [
  { name: 'Jan', attendance: 92, leave: 8 },
  { name: 'Feb', attendance: 95, leave: 5 },
  { name: 'Mar', attendance: 94, leave: 6 },
  { name: 'Apr', attendance: 90, leave: 10 },
  { name: 'May', attendance: 96, leave: 4 },
  { name: 'Jun', attendance: 93, leave: 7 },
];

const recruitmentData = [
  { name: 'Applied', value: 450 },
  { name: 'Screening', value: 120 },
  { name: 'Interview', value: 45 },
  { name: 'Offered', value: 12 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const KPICard = ({ title, value, change, icon: Icon, trend }: any) => {
  const { isRTL } = useUIStore();
  return (
    <div className="glass-card p-6 group hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/50 text-indigo-600 shadow-sm shadow-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black ${trend === 'up' ? 'text-emerald-600 bg-emerald-100/50' : 'text-rose-600 bg-rose-100/50'} px-2.5 py-1 rounded-full uppercase tracking-widest`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}%
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">{value}</p>
      </div>
    </div>
  );
};

import AIAssistant from '../components/AIAssistant';
import { Megaphone, ScrollText, Timer } from 'lucide-react';

const Dashboard = () => {
  const { isRTL, currency } = useUIStore();

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-indigo-950 tracking-tighter uppercase italic">
            {isRTL ? 'لوحة قيادة الشركة' : 'Enterprise Command'}
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-1">
            {isRTL ? 'نظرة عامة على القوى العاملة والعمليات' : 'Strategic overview of global workforce and operations'}
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 Operational
              </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title={isRTL ? 'إجمالي الموظفين' : 'Headcount'} 
          value="1,284" 
          change="4.2" 
          icon={Users} 
          trend="up" 
        />
        <KPICard 
          title={isRTL ? 'معدل الاحتفاظ' : 'Retention'} 
          value="98.2%" 
          change="1.5" 
          icon={UserCheck} 
          trend="up" 
        />
        <KPICard 
          title={isRTL ? 'صرف الرواتب' : 'Payroll Payout'} 
          value={`${currency} 1.2M`} 
          change="2.4" 
          icon={Wallet} 
          trend="down" 
        />
        <KPICard 
          title={isRTL ? 'المشاريع النشطة' : 'Active Ops'} 
          value="24" 
          change="12" 
          icon={Briefcase} 
          trend="up" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/80 p-10 shadow-2xl shadow-indigo-200/20 transition-all">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase">
                {isRTL ? 'تحليلات الحضور' : 'Attendance Analytics'}
              </h3>
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{isRTL ? 'اتجاه آخر 30 يومًا' : 'Last 30 Days trend'}</p>
            </div>
            <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Export Report</button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#6366f1" fillOpacity={1} fill="url(#colorAttendance)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-200">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-indigo-200" />
             </div>
             <h3 className="text-xl font-black italic tracking-tighter uppercase">
               {isRTL ? 'إعلانات الشركة' : 'Company Hub'}
             </h3>
          </div>
          <div className="space-y-6">
             {[
                { title: 'Summer Working Hours', date: 'June 1st', icon: Timer },
                { title: 'New Employee Handbook', date: 'Effective Now', icon: ScrollText },
                { title: 'Annual Team Retreat', date: 'July 15-18', icon: Calendar }
             ].map((ann, i) => (
                <div key={i} className="group cursor-pointer flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                   <div className="flex items-center gap-4">
                      <ann.icon className="w-5 h-5 text-indigo-300" />
                      <div>
                         <div className="text-sm font-bold group-hover:text-indigo-200 transition-colors uppercase tracking-tight">{ann.title}</div>
                         <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{ann.date}</div>
                      </div>
                   </div>
                   <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
             ))}
          </div>
          <button className="w-full mt-10 py-4 bg-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-indigo-900 transition-all shadow-xl shadow-black/10">
             {isRTL ? 'مشاهدة الكل' : 'Global Bulletin'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/80 p-10 shadow-2xl shadow-indigo-200/20">
          <h3 className="text-lg font-black text-slate-900 italic tracking-tighter uppercase mb-8">
            {isRTL ? 'قمع التوظيف' : 'Talent Pipeline'}
          </h3>
          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={recruitmentData}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {recruitmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-2xl font-black text-slate-900 italic">630</span>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Candidates</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
             {recruitmentData.map((item, index) => (
               <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.value}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="lg:col-span-2">
           <AIAssistant />
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
