import React, { useState } from 'react';
import { 
  BookOpen, PlayCircle, GraduationCap, Clock,
  Search, Plus, Award, Layout, FileText,
  Star, Users, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';

const Training = () => {
  const { isRTL } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');

  const courses = [
    { id: 1, title: 'Strategic Leadership 2024', duration: '12 weeks', status: 'In Progress', students: 45, rating: 4.9, image: 'https://images.unsplash.com/photo-1542744173-8e7e53816216?w=400&q=80' },
    { id: 2, title: 'Advanced Data Visualisation', duration: '4 weeks', status: 'Scheduled', students: 120, rating: 4.7, image: 'https://images.unsplash.com/photo-1551288049-bbbda536639a?w=400&q=80' },
    { id: 3, title: 'Soft Skills & Communication', duration: '2 weeks', status: 'Completed', students: 85, rating: 4.8, image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80' },
    { id: 4, title: 'Project Management Pro', duration: '8 weeks', status: 'In Progress', students: 30, rating: 4.6, image: 'https://images.unsplash.com/photo-1454165833767-131438967b20?w=400&q=80' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">
            {isRTL ? 'التدريب والتطوير المهني' : 'Learning & Development'}
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-1">
            {isRTL ? 'إدارة الدورات التدريبية وتطوير مهارات الفريق' : 'Manage training courses and develop team skillsets'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          <span>{isRTL ? 'إضافة دورة' : 'Add Course'}</span>
        </button>
      </div>

      {/* Banner Card */}
      <div className="relative h-64 rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-200">
         <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80" 
            className="absolute inset-0 w-full h-full object-cover" 
            alt="Learning"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/80 via-indigo-950/40 to-transparent flex flex-col justify-center px-12">
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-full w-fit px-4 py-1 text-white text-[10px] font-black uppercase tracking-widest mb-4">
              Featured Course
            </div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4 max-w-lg">
               Mastering Corporate Strategy
            </h2>
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-950 rounded-2xl font-black uppercase text-sm w-fit active:scale-95 transition-transform">
               <span>Start Learning</span>
               <PlayCircle className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {courses.map((course) => (
           <div key={course.id} className="group bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-xl shadow-indigo-100/20 overflow-hidden hover:scale-[1.02] transition-all">
             <div className="relative h-48 overflow-hidden">
                <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={course.title} />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-indigo-600 uppercase">
                   {course.status}
                </div>
             </div>
             
             <div className="p-6">
                <h4 className="font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{course.title}</h4>
                
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration}</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-slate-600">{course.rating}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                   <div className="flex items-center -space-x-2">
                       {[0, 1, 2].map((i) => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
                       ))}
                       <span className="pl-3 text-[10px] font-black text-slate-400">+{course.students}</span>
                   </div>
                   <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Training;
