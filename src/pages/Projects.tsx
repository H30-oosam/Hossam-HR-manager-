import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Search, Filter, MoreVertical, 
  Clock, Calendar, CheckCircle2, Loader2, Users, LayoutGrid, List
} from 'lucide-react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { logActivity, ActivityType } from '../services/activityService';

const Projects = () => {
  const { isRTL, currency } = useUIStore();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    budget: 0,
  });

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'projects'), {
        ...formData,
        createdBy: user?.uid,
        createdAt: serverTimestamp(),
      });
      if (user) {
        logActivity(user as any, 'CREATE_PROJECT', `Created project: ${formData.name}`, ActivityType.CREATE, 'projects');
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '', status: 'planning', startDate: '', endDate: '', budget: 0 });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic">
            {isRTL ? 'إدارة المشاريع' : 'Project Management'}
          </h1>
          <p className="text-gray-500 font-bold text-sm">
            {isRTL ? 'تخطيط ومتابعة مشاريع الشركة' : 'Plan and track company projects'}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-bold"
        >
          <Plus className="w-5 h-5" />
          <span>{isRTL ? 'مشروع جديد' : 'New Project'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : projects.map((project) => (
          <div key={project.id} className="bg-white/60 border border-white/80 p-6 rounded-[2rem] shadow-xl shadow-indigo-100/20 hover:shadow-2xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                project.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {project.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{project.name}</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">{project.description}</p>
            
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{project.endDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-indigo-600">{currency} {project.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">{isRTL ? 'إضافة مشروع جديد' : 'New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder={isRTL ? 'اسم المشروع' : 'Project Name'}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <textarea 
                placeholder={isRTL ? 'الوصف' : 'Description'}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 h-32"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="date"
                  className="px-4 py-3 bg-slate-50 border-none rounded-xl"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
                <input 
                  type="number"
                  placeholder={isRTL ? 'الميزانية' : 'Budget'}
                  className="px-4 py-3 bg-slate-50 border-none rounded-xl"
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100">
                  {isRTL ? 'حفظ' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
