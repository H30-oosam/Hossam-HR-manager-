import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Search, Filter, Plus, MoreVertical, Edit2, Trash2, 
  Mail, Phone, MapPin, BadgeCheck, Clock, X, Upload, Camera, Loader2,
  Calendar, Briefcase, Building2, UserCircle, Shield, Award, LineChart
} from 'lucide-react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { Employee } from '../types';
import { logActivity, ActivityType } from '../services/activityService';
import { exportToExcel } from '../utils/exportUtils';
import { FileSpreadsheet, ExternalLink, MessageCircle } from 'lucide-react';

const Employees = () => {
  const { isRTL, currency } = useUIStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Employee | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    status: 'active' | 'on_leave' | 'terminated';
    employeeId: string;
    hireDate: string;
    salary: number;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    status: 'active',
    employeeId: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: 0,
  });

  useEffect(() => {
    const q = query(collection(db, 'employees'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
      setEmployees(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'employees');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for base64 storage
        alert(isRTL ? 'الصورة كبيرة جداً. يرجى اختيار صورة أقل من 1 ميجابايت.' : 'Image is too large. Please select an image under 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      status: 'active',
      employeeId: '',
      hireDate: new Date().toISOString().split('T')[0],
      salary: 0,
    });
    setPhotoPreview(null);
    setEditingEmployee(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { department, ...rest } = formData;
      const data = {
        ...rest,
        departmentId: department,
        photoURL: photoPreview || '',
        updatedAt: serverTimestamp(),
      };

      if (editingEmployee) {
        await updateDoc(doc(db, 'employees', editingEmployee.id!), data);
        if (user) {
          logActivity(user as any, 'UPDATE_EMPLOYEE', `Updated employee: ${formData.firstName} ${formData.lastName}`, ActivityType.UPDATE, 'employees');
        }
      } else {
        await addDoc(collection(db, 'employees'), {
          ...data,
          createdAt: serverTimestamp(),
        });
        if (user) {
          logActivity(user as any, 'CREATE_EMPLOYEE', `Added new employee: ${formData.firstName} ${formData.lastName}`, ActivityType.CREATE, 'employees');
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'employees');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      position: employee.position || '',
      department: employee.departmentId || '', // Using departmentId as department for simplification
      status: employee.status || 'active',
      employeeId: employee.employeeId || '',
      hireDate: employee.hireDate || '',
      salary: employee.salary || 0,
    });
    setPhotoPreview(employee.photoURL || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا الموظف؟' : 'Are you sure you want to delete this employee?')) {
      try {
        await deleteDoc(doc(db, 'employees', id));
        if (user) {
          logActivity(user as any, 'DELETE_EMPLOYEE', `Deleted employee ID: ${id}`, ActivityType.DELETE, 'employees');
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `employees/${id}`);
      }
    }
  };

  const handleImportExcel = () => {
    alert(isRTL ? 'محاكاة استيراد ملف Excel: سيتم قراءة البيانات وإضافتها تلقائياً' : 'Excel Import Simulation: Data will be read and added automatically');
    // Simulated data addition
    const newEmp = {
      firstName: 'Imported',
      lastName: 'User',
      email: 'imported@example.com',
      phone: '000-000-000',
      position: 'Consultant',
      department: 'HR',
      status: 'active' as const,
      employeeId: 'IMP-' + Math.floor(Math.random() * 1000),
      hireDate: new Date().toISOString().split('T')[0],
      salary: 0,
      photoURL: '',
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };
    addDoc(collection(db, 'employees'), newEmp);
  };

  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic">
            {isRTL ? 'إدارة الموظفين والملفات' : 'Employee & File Management'}
          </h1>
          <p className="text-gray-500 font-bold text-sm">
            {isRTL ? 'عرض وإدارة أعضاء فريقك وملفاتهم' : 'View and manage your team members and their dossiers'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleImportExcel}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group active:scale-95"
          >
            <Upload className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold">{isRTL ? 'استيراد Excel' : 'Import'}</span>
          </button>
          <button 
            onClick={() => exportToExcel(employees, 'Employees_List', 'Employees')}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group active:scale-95"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold">{isRTL ? 'تصدير Excel' : 'Export'}</span>
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 font-bold active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>{isRTL ? 'إضافة موظف' : 'Add Employee'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-2xl shadow-indigo-200/20 overflow-hidden">
        {/* ... (search and filters) */}
        
        <div className="p-6 border-b border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isRTL ? 'بحث عن موظف...' : 'Search employees...'}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/80 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-white/80 rounded-xl text-sm text-slate-600 hover:bg-white/80 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              <span>{isRTL ? 'تصفية' : 'Filters'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-auto max-h-[700px] relative transition-all">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p>{isRTL ? 'جاري تحميل الموظفين...' : 'Loading employees...'}</p>
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-md shadow-sm">
                <tr>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/40 first:rounded-tl-[1.5rem]">{isRTL ? 'الموظف' : 'Employee'}</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/40">{isRTL ? 'القسم' : 'Department'}</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/40">{isRTL ? 'الراتب' : 'Salary'}</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/40">{isRTL ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/40">{isRTL ? 'تاريخ الانضمام' : 'Join Date'}</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-white/40 last:rounded-tr-[1.5rem]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-indigo-50/40 transition-colors group odd:bg-white/40 even:bg-slate-50/40">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="flex items-center gap-4 cursor-pointer group/profile"
                        onClick={() => setSelectedProfile(employee)}
                      >
                        {employee.photoURL ? (
                          <img src={employee.photoURL} alt="" className="w-12 h-12 rounded-2xl object-cover border-4 border-white shadow-xl group-hover/profile:scale-110 transition-transform" />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-black group-hover/profile:scale-110 transition-transform">
                            {employee.firstName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-black text-slate-900 group-hover/profile:text-indigo-600 transition-colors">{employee.firstName} {employee.lastName}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                            <BadgeCheck className="w-3 h-3 text-indigo-500" />
                            {employee.position}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full inline-block">
                        {employee.departmentId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-black text-slate-800">
                        {currency} {Number(employee.salary).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          employee.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}></span>
                        {employee.status === 'active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'في إجازة' : 'On Leave')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.hireDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(employee)}
                          className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(employee.id!)}
                          className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>{isRTL ? `عرض ${filteredEmployees.length} من ${employees.length} موظف` : `Showing ${filteredEmployees.length} of ${employees.length} employees`}</span>
        </div>
      </div>

      {/* Profile Details Drawer */}
      {selectedProfile && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[110]"
            onClick={() => setSelectedProfile(null)}
          ></div>
          <div className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-xl bg-white shadow-2xl z-[120] overflow-y-auto animate-in ${isRTL ? 'slide-in-from-left' : 'slide-in-from-right'} duration-300`}>
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b p-8 flex items-center justify-between z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-200">
                  {selectedProfile.photoURL ? (
                    <img src={selectedProfile.photoURL} alt="" className="w-full h-full object-cover rounded-[1.5rem]" />
                  ) : (
                    <span>{selectedProfile.firstName.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">{selectedProfile.firstName} {selectedProfile.lastName}</h2>
                  <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">{selectedProfile.position}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProfile(null)}
                className="p-3 hover:bg-slate-100 rounded-[1.5rem] transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-10 space-y-12">
              {/* Quick Vision Section */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center gap-3 mb-4 text-indigo-600">
                       <Calendar className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isRTL ? 'تاريخ التعيين' : 'Hire Date'}</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 italic">{selectedProfile.hireDate}</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center gap-3 mb-4 text-emerald-600">
                       <Wallet className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isRTL ? 'الراتب السنوي' : 'Annual Salary'}</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 italic">{currency} {(Number(selectedProfile.salary) * 12).toLocaleString()}</p>
                 </div>
              </div>

              {/* Personal Info Hub */}
              <div className="space-y-6">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <UserCircle className="w-5 h-5 text-indigo-500" />
                    {isRTL ? 'المعلومات الشخصية' : 'Identity Hub'}
                 </h3>
                 <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[1.5rem] hover:border-indigo-100 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Mail className="w-5 h-5" /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                             <p className="font-bold text-slate-800">{selectedProfile.email}</p>
                          </div>
                       </div>
                       <ExternalLink className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[1.5rem] hover:border-indigo-100 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Phone className="w-5 h-5" /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Line</p>
                             <p className="font-bold text-slate-800">{selectedProfile.phone}</p>
                          </div>
                       </div>
                       <MessageCircle className="w-4 h-4 text-indigo-400" />
                    </div>
                 </div>
              </div>

              {/* Professional Insights */}
              <div className="space-y-6">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <Shield className="w-5 h-5 text-indigo-500" />
                    {isRTL ? 'المعلومات الوظيفية' : 'Professional Record'}
                 </h3>
                 <div className="p-8 bg-indigo-900 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-200">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                          <Building2 className="w-6 h-6 text-indigo-300" />
                          <span className="text-xl font-black italic uppercase tracking-tighter">{selectedProfile.departmentId}</span>
                       </div>
                       <Award className="w-8 h-8 text-amber-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Position Level</p>
                          <p className="font-bold text-lg">Senior Strategic</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Contract Type</p>
                          <p className="font-bold text-lg">Full-time Talent</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Performance Indicator */}
              <div className="space-y-6">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <LineChart className="w-5 h-5 text-indigo-500" />
                    {isRTL ? 'إحصائيات الأداء' : 'Success Metrics'}
                 </h3>
                 <div className="grid grid-cols-3 gap-4">
                    {[
                       { label: 'Attendance', val: '98%', color: 'text-emerald-600' },
                       { label: 'Efficiency', val: '92%', color: 'text-indigo-600' },
                       { label: 'Kpis Met', val: '14/15', color: 'text-amber-600' }
                    ].map((stat, i) => (
                       <div key={i} className="text-center p-6 bg-white border border-slate-100 rounded-[1.5rem]">
                          <p className={`text-xl font-black italic mb-1 ${stat.color}`}>{stat.val}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Action Zone */}
              <div className="flex gap-4 pt-10">
                 <button 
                   onClick={() => handleEdit(selectedProfile)}
                   className="flex-1 py-4 bg-slate-900 text-white rounded-[1.5rem] font-bold text-sm tracking-widest uppercase hover:bg-black transition-all active:scale-95"
                 >
                    {isRTL ? 'تعديل الملف' : 'Modify Record'}
                 </button>
                 <button className="flex-1 py-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] font-bold text-sm tracking-widest uppercase hover:bg-indigo-100 transition-all active:scale-95">
                    {isRTL ? 'عرض المستندات' : 'Vault Access'}
                 </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal for adding/editing employees */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingEmployee ? (isRTL ? 'تعديل بيانات الموظف' : 'Edit Employee') : (isRTL ? 'إضافة موظف جديد' : 'Add New Employee')}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-10 h-10 text-indigo-300" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {isRTL ? 'اسحب وأفلت أو انقر للتحميل (الحد الأقصى 1 ميجابايت)' : 'Max size 1MB. Optimized for base64.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">{isRTL ? 'الاسم الأول' : 'First Name'}</label>
                  <input
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">{isRTL ? 'اسم العائلة' : 'Last Name'}</label>
                  <input
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">{isRTL ? 'رقم الهاتف' : 'Phone'}</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">{isRTL ? 'المسمى الوظيفي' : 'Position'}</label>
                  <input
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">{isRTL ? 'القسم' : 'Department'}</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white font-bold"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="">{isRTL ? 'اختر القسم' : 'Select Department'}</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Ops">Operations</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">{isRTL ? `الراتب الأساسي (${currency})` : `Basic Salary (${currency})`}</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">{isRTL ? 'الحالة' : 'Status'}</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white font-bold"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="active">{isRTL ? 'نشط' : 'Active'}</option>
                    <option value="on_leave">{isRTL ? 'في إجازة' : 'On Leave'}</option>
                    <option value="terminated">{isRTL ? 'تم إنهاء الخدمة' : 'Terminated'}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">{isRTL ? 'الرقم الوظيفي' : 'Employee ID'}</label>
                  <input
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingEmployee ? (isRTL ? 'تحديث' : 'Update') : (isRTL ? 'حفظ' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
