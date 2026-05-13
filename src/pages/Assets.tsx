import React, { useState } from 'react';
import { 
  Laptop, Smartphone, CreditCard, Box, 
  Search, Plus, User, Calendar, AlertCircle,
  CheckCircle2, Clock, MoreVertical, Download
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';

const Assets = () => {
  const { isRTL } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');

  const mockAssets = [
    { id: 1, name: 'MacBook Pro 14"', category: 'Laptop', sn: 'MBP-2024-X1', assignedTo: 'Alice Freeman', status: 'In Use', date: '2024-01-15' },
    { id: 2, name: 'iPhone 15 Pro', category: 'Mobile', sn: 'IPH-992-B2', assignedTo: 'Zaid Al-Harbi', status: 'In Use', date: '2024-02-10' },
    { id: 3, name: 'Dell UltraSharp 27"', category: 'Monitor', sn: 'DEL-U27-M1', assignedTo: 'Sarah Chen', status: 'Available', date: '-' },
    { id: 4, name: 'Access Card #402', category: 'Security', sn: 'AC-402', assignedTo: 'Omar Farooq', status: 'In Use', date: '2023-12-01' },
    { id: 5, name: 'Logitech MX Master 3', category: 'Input', sn: 'LOG-MX3-S1', assignedTo: 'David Miller', status: 'In Repair', date: '2024-05-01' },
  ];

  const filteredAssets = mockAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.sn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Use': return 'bg-emerald-50 text-emerald-600';
      case 'Available': return 'bg-blue-50 text-blue-600';
      case 'In Repair': return 'bg-rose-50 text-rose-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'Mobile': return <Smartphone className="w-5 h-5" />;
      case 'Security': return <CreditCard className="w-5 h-5" />;
      default: return <Box className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">
            {isRTL ? 'إدارة الأصول والعهد' : 'IT Asset & Equipment'}
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-1">
            {isRTL ? 'تتبع الأجهزة والعهد المسلمة للموظفين' : 'Track company hardware and equipment assigned to team members'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          <span>{isRTL ? 'إضافة أصل جديد' : 'Register New Asset'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: isRTL ? 'إجمالي الأصول' : 'Total Assets', val: '248', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: isRTL ? 'قيد الاستخدام' : 'Assigned', val: '192', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: isRTL ? 'متوفر' : 'Available', val: '46', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: isRTL ? 'قيد الإصلاح' : 'Maintenance', val: '10', color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/80 shadow-2xl shadow-indigo-100/20">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
             <div className={`text-2xl font-black ${stat.color} italic`}>{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/80 shadow-2xl shadow-indigo-200/20 overflow-hidden">
        <div className="p-8 border-b border-white/40 flex items-center justify-between flex-wrap gap-4">
           <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder={isRTL ? 'البحث بالاسم أو الرقم التسلسلي...' : 'Search asset name or S/N...'}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/80 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-bold text-xs uppercase tracking-widest">
            <Download className="w-4 h-4" />
            <span>{isRTL ? 'تقرير الجرد' : 'Inventory Report'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'الأصل' : 'Asset'}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'الفئة' : 'Category'}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'مسلم لـ' : 'Assigned To'}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'تاريخ التسليم' : 'Assign Date'}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'الحالة' : 'Status'}</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-white/40 transition-all group">
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                            {getCategoryIcon(asset.category)}
                         </div>
                         <div>
                            <div className="text-sm font-bold text-slate-900">{asset.name}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">S/N: {asset.sn}</div>
                         </div>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-600">{asset.category}</span>
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <User className="w-4 h-4 text-slate-300" />
                         <span className="text-sm font-bold text-slate-700">{asset.assignedTo}</span>
                      </div>
                   </td>
                   <td className="px-8 py-6 whitespace-nowrap">
                      <span className="text-xs font-black text-slate-400 uppercase">{asset.date}</span>
                   </td>
                   <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                   </td>
                   <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Assets;
