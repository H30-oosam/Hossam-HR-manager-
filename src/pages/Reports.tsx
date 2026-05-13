import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, FileText, Filter, TrendingUp, Calendar, 
  ArrowUpRight, Users, UserMinus, UserCheck, Briefcase, 
  Stethoscope, Banknote, MapPin, Search, GraduationCap, Clock,
  FileSpreadsheet, PieChart as PieIcon
} from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useUIStore } from '../store/uiStore';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { Employee } from '../types';

const reportCategories = [
  { id: 'all', name: 'All Reports', nameAr: 'كل التقارير' },
  { id: 'workforce', name: 'Workforce', nameAr: 'العمالة' },
  { id: 'financial', name: 'Financial', nameAr: 'المالية' },
  { id: 'leaves', name: 'Leaves & Health', nameAr: 'الإجازات والصحة' },
  { id: 'recruitment', name: 'Recruitment', nameAr: 'التوظيف والتدريب' },
];

const Reports = () => {
  const { isRTL, currency } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'employees'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEmployees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(emp => {
      const dept = emp.departmentId || (isRTL ? 'غير محدد' : 'Unassigned');
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [employees, isRTL]);

  const salaryData = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(emp => {
      const dept = emp.departmentId || (isRTL ? 'غير محدد' : 'Unassigned');
      counts[dept] = (counts[dept] || 0) + (Number(emp.salary) || 0);
    });
    return Object.entries(counts).map(([name, amount]) => ({ name, amount }));
  }, [employees, isRTL]);

  const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

  const allReports = [
    { id: 1, title: 'Monthly Movement', titleAr: 'الحركة الشهرية', category: 'workforce', icon: TrendingUp },
    { id: 2, title: 'Internal Transfer Details', titleAr: 'تفاصيل النقل الداخلي', category: 'workforce', icon: MapPin },
    { id: 3, title: 'Turnover Rate', titleAr: 'معدل دوران العمالة', category: 'workforce', icon: UserMinus },
    { id: 4, title: 'Annual Avg Manpower', titleAr: 'متوسط العمالة السنوي', category: 'workforce', icon: Users },
    { id: 5, title: 'Resident Analysis', titleAr: 'تحليل المستقيلين', category: 'workforce', icon: FileText },
    { id: 6, title: 'Resignation Reasons', titleAr: 'أسباب ترك العمل', category: 'workforce', icon: FileText },
    { id: 7, title: 'Probation Resignees', titleAr: 'مستقيلي فترة التجربة', category: 'workforce', icon: Clock },
    { id: 8, title: 'Leaves Balance', titleAr: 'رصيد الإجازات', category: 'leaves', icon: Calendar },
    { id: 9, title: 'Sick Leave Cases', titleAr: 'حالات المرضي', category: 'leaves', icon: Stethoscope },
    { id: 10, title: 'Employee Cost', titleAr: 'تكلفة الموظف', category: 'financial', icon: Banknote },
    { id: 11, title: 'Labor Disputes', titleAr: 'القضايا العمالية', category: 'workforce', icon: FileText },
    { id: 12, title: 'Special Events', titleAr: 'الأحداث الخاصة', category: 'all', icon: Calendar },
    { id: 13, title: 'Ideal Employee', titleAr: 'العامل المثالي', category: 'all', icon: UserCheck },
    { id: 14, title: 'Detailed Transfers', titleAr: 'النقل الداخلي التفصيلي', category: 'workforce', icon: MapPin },
    { id: 15, title: 'Promotions & Increases', titleAr: 'الترقيات والزيادات', category: 'financial', icon: TrendingUp },
    { id: 16, title: 'Vacant Positions', titleAr: 'الوظائف الشاغرة', category: 'recruitment', icon: Briefcase },
    { id: 17, title: 'Avg Age & Service', titleAr: 'متوسط الأعمار والخدمة', category: 'workforce', icon: Users },
    { id: 18, title: 'HR Expenses', titleAr: 'مصروفات HR', category: 'financial', icon: Banknote },
    { id: 19, title: 'Casual & Part Time', titleAr: 'العمالة المؤقتة', category: 'workforce', icon: Clock },
    { id: 20, title: 'Recruits Costing', titleAr: 'المعينين وتكلفة التعيين', category: 'recruitment', icon: Banknote },
    { id: 21, title: 'Contract Types', titleAr: 'أنواع العقود', category: 'workforce', icon: FileText },
    { id: 22, title: 'Chronic Illness', titleAr: 'الحالات المرضية المزمنة', category: 'leaves', icon: Stethoscope },
    { id: 23, title: 'Training & Participants', titleAr: 'التدريب والمشاركين', category: 'recruitment', icon: GraduationCap },
    { id: 24, title: 'Overtime Hours & Cost', titleAr: 'ساعات العمل الإضافي', category: 'financial', icon: Clock },
  ];

  const filteredReports = allReports.filter(report => {
    const matchesSearch = (isRTL ? report.titleAr : report.title).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || report.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExportExcel = (report: any) => {
    const data = employees.length > 0 ? employees.map(e => ({
      [isRTL ? 'الموظف' : 'Employee']: `${e.firstName} ${e.lastName}`,
      [isRTL ? 'القسم' : 'Department']: e.departmentId,
      [isRTL ? 'الراتب' : 'Salary']: e.salary
    })) : [
      { [isRTL ? 'الاسم' : 'Name']: 'N/A', [isRTL ? 'القيمة' : 'Value']: 0 }
    ];
    exportToExcel(data, isRTL ? report.titleAr : report.title, 'Report');
  };

  const handleExportPDF = (report: any) => {
    const data = employees.length > 0 ? employees.map(e => ({
      [isRTL ? 'الموظف' : 'Employee']: `${e.firstName} ${e.lastName}`,
      [isRTL ? 'القسم' : 'Department']: e.departmentId,
      [isRTL ? 'المسمى' : 'Position']: e.position
    })) : [
      { [isRTL ? 'الاسم' : 'Name']: 'N/A' }
    ];
    exportToPDF(data, isRTL ? report.titleAr : report.title, isRTL ? report.titleAr : report.title);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">
            {isRTL ? 'نظام التقارير التحليلية' : 'Analytical Reporting System'}
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-1">
            {isRTL ? '٢٤ تقريراً متخصصاً لإدارة الموارد البشرية والعمليات' : '24 specialized reports for HR and operations management'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder={isRTL ? 'ابحث في التقارير...' : 'Search reports...'}
              className="pl-10 pr-4 py-3 bg-white/60 border border-white/80 rounded-2xl text-sm font-bold min-w-[280px] focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-8 shadow-2xl shadow-indigo-200/20">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{isRTL ? 'توزيع الأقسام' : 'Department Distribution'}</h3>
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Headcount by dept</p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <PieIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="h-[300px]">
             {employees.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-300 font-bold uppercase italic tracking-tighter">
                   {isRTL ? 'لا توجد بيانات متاحة' : 'No Data Available'}
                </div>
             )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
             {departmentData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                   <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                   <span className="truncate">{item.name}: {item.value}</span>
                </div>
             ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-8 shadow-2xl shadow-indigo-200/20">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{isRTL ? 'تحليل الرواتب' : 'Salary Analysis'}</h3>
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Cost by department</p>
            </div>
             <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Banknote className="w-6 h-6" />
            </div>
          </div>
          <div className="h-[300px]">
             {employees.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryData}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dx={-10} tickFormatter={(value) => `${currency} ${value.toLocaleString()}`} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={40} fill="#6366f1">
                      {salaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-300 font-bold uppercase italic tracking-tighter">
                   {isRTL ? 'لا توجد بيانات متاحة' : 'No Data Available'}
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
        {reportCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
              activeCategory === cat.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                : 'bg-white/50 text-slate-500 hover:bg-white/80'
            }`}
          >
            {isRTL ? cat.nameAr : cat.name}
          </button>
        ))}
      </div>

      {/* 24 Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <div 
            key={report.id} 
            className="group bg-white/40 hover:bg-white/80 backdrop-blur-md border border-white/60 p-5 rounded-3xl transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <report.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {isRTL ? report.titleAr : report.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  ID: #{report.id.toString().padStart(2, '0')} • {report.category}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={() => handleExportExcel(report)}
                className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all active:scale-90"
                title="Excel"
              >
                <FileSpreadsheet className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleExportPDF(report)}
                className="p-2 hover:bg-rose-100 text-rose-600 rounded-xl transition-all active:scale-90"
                title="PDF"
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <BarChart3 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">
              {isRTL ? 'لم يتم العثور على تقارير تطابق بحثك' : 'No reports found matching your search'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
