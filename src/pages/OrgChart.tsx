import React, { useState, useEffect } from 'react';
import { 
  Users, User, ChevronRight, ChevronDown, 
  Search, ZoomIn, ZoomOut, Maximize2,
  Building2, Briefcase, Mail, Phone
} from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useUIStore } from '../store/uiStore';
import { Employee } from '../types';

const OrgChart = () => {
  const { isRTL } = useUIStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const q = query(collection(db, 'employees'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEmployees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const departments = Array.from(new Set(employees.map(e => e.departmentId || 'Unassigned')));

  const toggleDept = (dept: string) => {
    setExpandedDepts(prev => ({ ...prev, [dept]: !prev[dept] }));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">
            {isRTL ? 'الهيكل التنظيمي' : 'Organizational Chart'}
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-1">
            {isRTL ? 'عرض التسلسل الإداري وتوزيع القوى العاملة' : 'Visualize company hierarchy and workforce distribution'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
           <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
              <ZoomIn className="w-5 h-5" />
           </button>
           <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
              <ZoomOut className="w-5 h-5" />
           </button>
           <div className="h-8 w-px bg-slate-100 mx-2"></div>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder={isRTL ? 'بحث عن موظف...' : 'Find employee...'}
                className="pl-10 pr-4 py-3 bg-white/60 border border-white/80 rounded-2xl text-sm font-bold min-w-[240px] focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/80 p-8 shadow-2xl shadow-indigo-200/20 min-h-[600px]">
         {/* Tree Visualization Start */}
         <div className="flex flex-col items-center">
            {/* CEO / Top Level Hero Card */}
            <div className="mb-16 relative">
               <div className="bg-indigo-600 p-1 rounded-[2.5rem] shadow-2xl shadow-indigo-200">
                  <div className="bg-white rounded-[2.2rem] p-6 flex items-center gap-6 min-w-[320px]">
                     <div className="w-20 h-20 bg-indigo-50 border-4 border-indigo-100 rounded-[1.5rem] flex items-center justify-center text-indigo-600 text-3xl font-black">
                        H
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase">Hossam Elwardany</h2>
                        <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mt-1">Founder & CEO</p>
                        <div className="flex gap-2 mt-3">
                           <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-all">
                              <Mail className="w-4 h-4" />
                           </div>
                           <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-all">
                              <Phone className="w-4 h-4" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               {/* Connector Line Down */}
               <div className="absolute left-1/2 -bottom-16 w-0.5 h-16 bg-gradient-to-b from-indigo-600 to-indigo-200 -translate-x-1/2"></div>
            </div>

            {/* Department Level Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 w-full">
               {departments.map((dept) => (
                  <div key={dept} className="relative pt-8">
                     {/* Horizontal line connector */}
                     <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-100"></div>
                     <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-indigo-100 -translate-x-1/2"></div>
                     
                     <div 
                        onClick={() => toggleDept(dept)}
                        className="cursor-pointer bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xl shadow-indigo-100/20 hover:border-indigo-200 transition-all group"
                     >
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                 <Building2 className="w-5 h-5" />
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-all">{dept}</h4>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {employees.filter(e => e.departmentId === dept).length} {isRTL ? 'موظف' : 'Members'}
                                 </span>
                              </div>
                           </div>
                           {expandedDepts[dept] ? <ChevronDown className="w-5 h-5 text-slate-300" /> : <ChevronRight className="w-5 h-5 text-slate-300" />}
                        </div>

                        {expandedDepts[dept] && (
                           <div className="mt-6 space-y-3 pt-4 border-t border-slate-50">
                              {employees
                                 .filter(e => e.departmentId === dept)
                                 .map((emp) => (
                                    <div key={emp.id} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                                       <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                                          {emp.firstName.charAt(0)}
                                       </div>
                                       <div>
                                          <div className="text-xs font-bold text-slate-800">{emp.firstName} {emp.lastName}</div>
                                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{emp.position}</div>
                                       </div>
                                    </div>
                                 ))
                              }
                           </div>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         {loading && (
            <div className="h-full flex items-center justify-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
         )}
      </div>
    </div>
  );
};

export default OrgChart;
