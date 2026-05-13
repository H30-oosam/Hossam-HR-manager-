import React, { useState } from 'react';
import { 
  FileText, Download, Search, Filter, 
  Plus, FileCheck, FileWarning, BadgeCheck,
  Briefcase, ShieldAlert, ScrollText, Printer,
  Share2, MoreVertical, Eye
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';

const Documents = () => {
  const { isRTL } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');

  const documentTemplates = [
    { id: 1, title: 'Standard Employment Contract', titleAr: 'عقد عمل قياسي', category: 'Contracts', categoryAr: 'عقود', icon: FileCheck, type: 'DOCX', size: '45 KB' },
    { id: 2, title: 'Non-Disclosure Agreement (NDA)', titleAr: 'اتفاقية عدم الإفصاح', category: 'Legal', categoryAr: 'قانوني', icon: ShieldAlert, type: 'PDF', size: '120 KB' },
    { id: 3, title: 'Offer Letter Template', titleAr: 'نموذج عرض وظيفي', category: 'Recruitment', categoryAr: 'توظيف', icon: Briefcase, type: 'DOCX', size: '32 KB' },
    { id: 4, title: 'Termination Notice', titleAr: 'إشعار إنهاء الخدمة', category: 'HR Policy', categoryAr: 'سياسات', icon: FileWarning, type: 'PDF', size: '88 KB' },
    { id: 5, title: 'Experience Certificate', titleAr: 'شهادة خبرة', category: 'Certificates', categoryAr: 'شهادات', icon: BadgeCheck, type: 'DOCX', size: '28 KB' },
    { id: 6, title: 'Salary Certificate', titleAr: 'شهادة راتب', category: 'Financial', categoryAr: 'مالي', icon: ScrollText, type: 'PDF', size: '54 KB' },
    { id: 7, title: 'Employee Performance Warning', titleAr: 'إنذار أداء موظف', category: 'HR Policy', categoryAr: 'سياسات', icon: ShieldAlert, type: 'DOCX', size: '40 KB' },
    { id: 8, title: 'Loan Request Form', titleAr: 'نموذج طلب سلفة', category: 'Financial', categoryAr: 'مالي', icon: ScrollText, type: 'PDF', size: '65 KB' },
  ];

  const filteredDocs = documentTemplates.filter(doc => 
    (isRTL ? doc.titleAr : doc.title).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">
            {isRTL ? 'مكتبة النماذج والوثائق' : 'Template & Document Library'}
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-1">
            {isRTL ? 'إدارة وتحميل نماذج العقود والأوراق الإدارية' : 'Manage and download administrative templates and legal contracts'}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-[2rem] font-bold shadow-xl shadow-indigo-100/10 hover:bg-slate-50 transition-all active:scale-95">
            <Printer className="w-5 h-5" />
            <span>{isRTL ? 'طباعة الكل' : 'Print All'}</span>
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            <span>{isRTL ? 'إضافة نموذج' : 'Add Template'}</span>
          </button>
        </div>
      </div>

      {/* Grid Categories Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: isRTL ? 'العقود' : 'Contracts', count: 12, icon: FileCheck, color: 'text-indigo-600' },
           { label: isRTL ? 'السياسات' : 'Policies', count: 8, icon: ShieldAlert, color: 'text-amber-600' },
           { label: isRTL ? 'الشهادات' : 'Certificates', count: 5, icon: BadgeCheck, color: 'text-emerald-600' },
           { label: isRTL ? 'عام' : 'General', count: 15, icon: FileText, color: 'text-slate-600' },
         ].map((cat, i) => (
           <div key={i} className="bg-white/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/80 shadow-2xl shadow-indigo-100/10 flex items-center justify-between group cursor-pointer hover:scale-105 transition-transform">
              <div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.label}</div>
                 <div className="text-xl font-black text-slate-800 italic">{cat.count}</div>
              </div>
              <cat.icon className={`w-8 h-8 ${cat.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
           </div>
         ))}
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/80 shadow-2xl shadow-indigo-200/20 overflow-hidden">
        <div className="p-8 border-b border-white/40 flex items-center justify-between flex-wrap gap-4">
           <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder={isRTL ? 'بحث عن نموذج أو وثيقة...' : 'Search for a template...'}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/80 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'تصفية حسب:' : 'Filter By:'}</span>
             <select className="bg-white/50 border border-white/80 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-4 focus:ring-indigo-100 transition-all">
                <option>{isRTL ? 'جميع الأنواع' : 'All Types'}</option>
                <option>Word (DOCX)</option>
                <option>PDF</option>
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/40">
           {filteredDocs.map((doc) => (
             <div key={doc.id} className="p-8 bg-white/60 hover:bg-white transition-all group flex items-center justify-between border-b border-white/40 md:border-e md:even:border-e-0">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-white rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform relative overflow-hidden">
                      <doc.icon className="w-7 h-7 relative z-10" />
                      <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {isRTL ? doc.titleAr : doc.title}
                      </h4>
                      <div className="flex items-center gap-3">
                         <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-black text-slate-400 rounded-lg uppercase tracking-widest">
                           {isRTL ? doc.categoryAr : doc.category}
                         </span>
                         <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                         <span className="text-[9px] font-black text-indigo-500 uppercase">{doc.type} • {doc.size}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                   <button className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all" title="View">
                      <Eye className="w-4 h-4" />
                   </button>
                   <button className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all" title="Download">
                      <Download className="w-4 h-4" />
                   </button>
                   <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                      <Share2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Documents;
