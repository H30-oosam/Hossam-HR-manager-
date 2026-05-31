import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Search, Filter, 
  Clock, Calendar, CheckCircle2, Loader2, Users, 
  Trash2, User, AlertCircle
} from 'lucide-react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { logActivity, ActivityType } from '../services/activityService';

const Tasks = () => {
  const { isRTL } = useUIStore();
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    assignedTo: '',
  });

  const getDueStatus = (dueDateStr: string, status: string) => {
    if (status === 'done' || !dueDateStr) return null;
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    if (dueDateStr < todayStr) {
      return 'overdue';
    }
    
    if (dueDateStr === todayStr) {
      return 'due-soon';
    }
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    if (dueDateStr === tomorrowStr) {
      const dueTime = new Date(dueDateStr + 'T23:59:59').getTime();
      if (dueTime - now.getTime() <= 24 * 60 * 60 * 1000) {
        return 'due-soon';
      }
    }
    
    return null;
  };

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tasks'), {
        ...formData,
        createdBy: user?.uid,
        createdAt: serverTimestamp(),
      });
      if (user) {
        logActivity(user as any, 'CREATE_TASK', `Created task: ${formData.title}`, ActivityType.CREATE, 'tasks');
      }
      setIsModalOpen(false);
      setFormData({ title: '', priority: 'medium', status: 'todo', dueDate: '', assignedTo: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    await updateDoc(doc(db, 'tasks', taskId), { status: newStatus });
  };

  const deleteTask = async (taskId: string) => {
    if (window.confirm('Delete this task?')) {
      await deleteDoc(doc(db, 'tasks', taskId));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic">
            {isRTL ? 'متابعة المهام' : 'Task Tracker'}
          </h1>
          <p className="text-gray-500 font-bold text-sm">
            {isRTL ? 'إدارة مهام الفريق والإنتاجية' : 'Manage team tasks and productivity'}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-bold"
        >
          <Plus className="w-5 h-5" />
          <span>{isRTL ? 'مهمة جديدة' : 'New Task'}</span>
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-2xl shadow-indigo-200/20 overflow-hidden">
        <div className="p-6 border-b border-white/40 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">{isRTL ? 'المهام الجارية' : 'Ongoing Tasks'}</h3>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase">Todo: {tasks.filter(t => t.status !== 'done').length}</div>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase">Done: {tasks.filter(t => t.status === 'done').length}</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
          ) : tasks.map((task) => {
            const dueStatus = getDueStatus(task.dueDate, task.status);
            const rowClass = dueStatus === 'overdue'
              ? 'p-5 flex items-center justify-between bg-rose-500/10 border-s-4 border-s-rose-500 hover:bg-rose-500/15 transition-all group'
              : dueStatus === 'due-soon'
              ? 'p-5 flex items-center justify-between bg-amber-500/10 border-s-4 border-s-amber-500 hover:bg-amber-500/15 transition-all group'
              : 'p-5 flex items-center justify-between hover:bg-white/5 transition-colors group';

            return (
              <div key={task.id} className={rowClass}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleTask(task.id, task.status)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent hover:border-indigo-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div>
                    <h4 className={`text-sm font-bold transition-all flex items-center gap-2 ${
                      task.status === 'done' 
                        ? 'text-slate-400 line-through' 
                        : dueStatus === 'overdue' 
                        ? 'text-rose-100 hover:text-rose-50' 
                        : dueStatus === 'due-soon' 
                        ? 'text-amber-100 hover:text-amber-50' 
                        : 'text-slate-100 hover:text-white'
                    }`}>
                      <span>{task.title}</span>
                      {dueStatus && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                          dueStatus === 'overdue' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          <AlertCircle className="w-3 h-3 animate-pulse" />
                          {dueStatus === 'overdue' ? (isRTL ? 'متأخر' : 'Overdue') : (isRTL ? 'قريباً' : 'Due Soon')}
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Clock className="w-3 h-3" />
                        {task.dueDate}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        task.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 border border-white/10">
                    <User className="w-4 h-4" />
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">{isRTL ? 'إضافة مهمة جديدة' : 'New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder={isRTL ? 'عنوان المهمة' : 'Task Title'}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold appearance-none"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input 
                  type="date"
                  className="px-4 py-3 bg-slate-50 border-none rounded-xl text-sm"
                  value={formData.dueDate}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100">
                  {isRTL ? 'حفظ' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
