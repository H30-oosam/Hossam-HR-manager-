import React, { useState } from 'react';
import { Wallet, Download, CreditCard, PieChart as PieChartIcon, TrendingUp, User, Plus, Search, Filter } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { logActivity, ActivityType } from '../services/activityService';

const data = [
  { name: 'Jan', amount: 45000 },
  { name: 'Feb', amount: 46200 },
  { name: 'Mar', amount: 45800 },
  { name: 'Apr', amount: 48000 },
  { name: 'May', amount: 47500 },
];

const Payroll = () => {
  const { isRTL, currency } = useUIStore();
  const { user } = useAuthStore();
  const [payrollList, setPayrollList] = useState([
    { id: '1', name: 'Alice Freeman', month: 'May 2024', base: 4500, allowances: 1200, deductions: 500, netSalary: `${currency} 5,200`, status: 'paid' },
    { id: '2', name: 'Zaid Al-Harbi', month: 'May 2024', base: 4000, allowances: 1000, deductions: 200, netSalary: `${currency} 4,800`, status: 'paid' },
    { id: '3', name: 'Sarah Chen', month: 'May 2024', base: 5500, allowances: 1500, deductions: 900, netSalary: `${currency} 6,100`, status: 'draft' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ name: '', month: 'June 2024', base: '', allowances: '', deductions: '' });

  const handleAddPayroll = () => {
    if (newEntry.name && newEntry.base) {
      const base = parseFloat(newEntry.base);
      const allow = parseFloat(newEntry.allowances || '0');
      const deduct = parseFloat(newEntry.deductions || '0');
      const net = base + allow - deduct;

      const entry = {
        id: Math.random().toString(36).substr(2, 9),
        name: newEntry.name,
        month: newEntry.month,
        base,
        allowances: allow,
        deductions: deduct,
        netSalary: `${currency} ${net.toLocaleString()}`,
        status: 'draft'
      };

      setPayrollList([entry, ...payrollList]);
      setShowModal(false);
      setNewEntry({ name: '', month: 'June 2024', base: '', allowances: '', deductions: '' });
      
      if (user) {
        logActivity(user as any, 'CREATE_PAYROLL', `Issued payroll for ${newEntry.name}`, ActivityType.CREATE, 'payroll');
      }
    }
  };

  function format(date: Date, fmt: string) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic">
            {isRTL ? 'إدارة الرواتب والتعويضات' : 'Payroll Engine Pro'}
          </h1>
          <p className="text-gray-500 font-bold text-sm">
            {isRTL ? 'إدارة كشوف المرتبات والمدفوعات والضرائب' : 'Precision payroll processing with automated tax & deduction calculations'}
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>{isRTL ? 'إصدار مسير' : 'Issue Payroll'}</span>
          </button>
        </div>
      </div>

      {/* Modal Integration */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-indigo-950/20 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-[3rem] p-10 border border-white shadow-2xl shadow-indigo-200 animate-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase mb-6">
                {isRTL ? 'بيانات المسير الجديد' : 'New Payroll Entry'}
              </h2>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 block">{isRTL ? 'الموظف' : 'Employee'}</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                      value={newEntry.name}
                      onChange={e => setNewEntry({...newEntry, name: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 block">{isRTL ? 'الأساسي' : 'Base'}</label>
                        <input 
                          type="number"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                          value={newEntry.base}
                          onChange={e => setNewEntry({...newEntry, base: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 block">{isRTL ? 'البدلات' : 'Allowances'}</label>
                        <input 
                          type="number"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                          value={newEntry.allowances}
                          onChange={e => setNewEntry({...newEntry, allowances: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 block">{isRTL ? 'الاستقطاعات' : 'Deductions'}</label>
                        <input 
                          type="number"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                          value={newEntry.deductions}
                          onChange={e => setNewEntry({...newEntry, deductions: e.target.value})}
                        />
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 mt-10">
                 <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-sm active:scale-95 transition-transform"
                 >
                   {isRTL ? 'إلغاء' : 'Cancel'}
                 </button>
                 <button 
                  onClick={handleAddPayroll}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm shadow-xl shadow-indigo-100 active:scale-95 transition-transform"
                 >
                   {isRTL ? 'حفظ' : 'Process'}
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200">
              <div className="flex justify-between items-start mb-10">
                <Wallet className="w-10 h-10 opacity-50" />
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">{isRTL ? 'إجمالي الصرف' : 'Total Payout'}</span>
              </div>
              <h2 className="text-4xl font-bold mb-2">{currency} 1,284,500</h2>
              <p className="text-sm text-indigo-100">+{isRTL ? '4.2% من الشهر الماضي' : '4.2% from last month'}</p>
           </div>

           <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-8 shadow-2xl shadow-indigo-200/20">
              <h3 className="text-lg font-bold text-gray-900 mb-6">{isRTL ? 'اتجاهات الميزانية' : 'Budget Trends'}</h3>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-8 shadow-2xl shadow-indigo-200/20 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">{isRTL ? 'كشوف المرتبات الأخيرة' : 'Recent Payrolls'}</h3>
              <button className="text-indigo-600 font-bold text-sm hover:underline">{isRTL ? 'عرض الكل' : 'View All'}</button>
            </div>
            <div className="space-y-4">
              {payrollList.map(item => (
                <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/50 border border-white/80 rounded-[2rem] hover:bg-white transition-all shadow-sm group">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shadow-sm group-hover:scale-110 transition-transform">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.month}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 flex-1 px-8">
                     <div className="text-center">
                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{isRTL ? 'الأساسي' : 'Base'}</div>
                        <div className="text-sm font-bold text-slate-600">{(item as any).base ? `${currency} ${(item as any).base}` : '-'}</div>
                     </div>
                     <div className="text-center">
                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{isRTL ? 'بدلات' : 'Allow.'}</div>
                        <div className="text-sm font-bold text-emerald-600">{(item as any).allowances ? `+${currency} ${(item as any).allowances}` : '-'}</div>
                     </div>
                     <div className="text-center">
                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{isRTL ? 'خصومات' : 'Deduc.'}</div>
                        <div className="text-sm font-bold text-rose-600">{(item as any).deductions ? `-${currency} ${(item as any).deductions}` : '-'}</div>
                     </div>
                     <div className="text-center">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'الصافي' : 'Net Salary'}</div>
                        <div className="text-sm font-black text-indigo-600 italic underline decoration-indigo-100">{item.netSalary}</div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      item.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.status}
                    </span>
                    <button className="p-2.5 bg-white text-indigo-600 border border-slate-100 rounded-xl hover:shadow-lg transition-all active:scale-95 shadow-sm">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
