import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, UserPlus, Shield, ShieldAlert, 
  ShieldCheck, MoreVertical, Trash2, Mail, Lock
} from 'lucide-react';
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { logActivity, ActivityType } from '../services/activityService';

interface SystemUser {
  id: string;
  email: string;
  role: 'super-admin' | 'admin' | 'manager' | 'employee';
  displayName: string;
}

const Users = () => {
  const { isRTL } = useUIStore();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SystemUser)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      if (currentUser) {
        logActivity(
          currentUser as any, 
          'UPDATE_USER_ROLE', 
          `Changed user role: ${userId} to ${newRole}`, 
          ActivityType.UPDATE, 
          'users'
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin': return <ShieldAlert className="w-4 h-4 text-purple-500" />;
      case 'admin': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'manager': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      default: return <Shield className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic">
            {isRTL ? 'إدارة المستخدمين والصلاحيات' : 'User Management & Permissions'}
          </h1>
          <p className="text-gray-500 font-bold text-sm">
            {isRTL ? 'التحكم في من يمكنه الوصول للنظام وماذا يشاهد' : 'Control who can access the system and what they see'}
          </p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-2xl shadow-indigo-200/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'المستخدم' : 'User'}</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'الدور / الصلاحية' : 'Role / Permission'}</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                        {user.displayName?.charAt(0) || user.email.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{user.displayName || 'Unnamed User'}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">ID: {user.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <select 
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider outline-none border-none ring-0 ${
                        user.role === 'super-admin' ? 'bg-purple-950/20 text-purple-400' : 
                        user.role === 'admin' ? 'bg-rose-500/10 text-rose-400' : 
                        user.role === 'manager' ? 'bg-emerald-500/10 text-emerald-400' : 
                        'bg-white/5 text-slate-400'
                      }`}
                    >
                      {currentUser?.role === 'super-admin' && (
                        <option value="super-admin">Super Admin</option>
                      )}
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </select>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-300">
                      <UsersIcon className="w-12 h-12" />
                      <p className="font-bold">{isRTL ? 'لا يوجد مستخدمين مسجلين' : 'No registered users found'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
