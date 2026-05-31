import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Mail, Lock, UserPlus, LogIn, Github } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'motion/react';
import { HossamLogo } from '../components/HossamLogo';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('hossam@admin.com');
  const [password, setPassword] = useState('1321994');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();


  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userPath = `users/${user.uid}`;

      let userDoc;
      try {
        userDoc = await getDoc(doc(db, 'users', user.uid));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, userPath);
      }
      
      if (!userDoc || !userDoc.exists()) {
        const newUser = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'New User',
          role: (user.email === 'hossam@admin.com') ? 'super-admin' : (['hossamelwardany132@gmail.com'].includes(user.email || '') ? 'admin' : 'employee'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        try {
          await setDoc(doc(db, 'users', user.uid), newUser);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, userPath);
        }
        setUser(newUser as any);
      } else {
        setUser(userDoc.data() as any);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = {
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.email?.split('@')[0] || 'User',
          role: (result.user.email === 'hossam@admin.com') ? 'super-admin' : (['hossamelwardany132@gmail.com'].includes(result.user.email || '') ? 'admin' : 'employee'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        try {
          await setDoc(doc(db, 'users', result.user.uid), newUser);
        } catch (err) {
          console.error("Error creating user profile:", err);
        }
        setUser(newUser as any);
      } else {
        try {
          result = await signInWithEmailAndPassword(auth, email, password);
        } catch (signInErr: any) {
          // If login fails and it's the bootstrap admin credentials, try to register it client-side
          if (email === 'hossam@admin.com' && password === '1321994' && (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential')) {
            try {
              result = await createUserWithEmailAndPassword(auth, email, password);
            } catch (createErr) {
              throw signInErr; // throw original if registration also fails
            }
          } else {
            throw signInErr;
          }
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Ensure hossam@admin.com always gets the 'super-admin' role
            if (result.user.email === 'hossam@admin.com' && data.role !== 'super-admin') {
              data.role = 'super-admin';
              await setDoc(doc(db, 'users', result.user.uid), data, { merge: true });
            }
            setUser(data as any);
          } else {
            // Restore or create profile if doc is missing
            const restoredUser = {
              uid: result.user.uid,
              email: result.user.email!,
              displayName: result.user.email === 'hossam@admin.com' ? 'Admin Hossam' : (result.user.displayName || result.user.email?.split('@')[0] || 'User'),
              role: (result.user.email === 'hossam@admin.com') ? 'super-admin' : (['hossamelwardany132@gmail.com'].includes(result.user.email || '') ? 'admin' : 'employee'),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', result.user.uid), restoredUser);
            setUser(restoredUser as any);
          }
        } catch (err) {
          console.error("Error fetching or creating profile on login:", err);
        }
      }
      navigate('/');
    } catch (err: any) {
      setError(isSignUp ? 'Could not create account.' : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Sophisticated radial light source glows that match the enterprise deep blue look */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-950/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg mt-4 mb-4"
      >
        <div className="glass-card bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 md:p-12 shadow-2xl shadow-black/80">
          
          {/* High Fidelity Brand Logo & Slogan Header */}
          <div className="flex flex-col items-center mb-8">
            <HossamLogo size="lg" lightText={true} />
            <div className="h-[2px] w-1/3 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent mt-6 mb-4"></div>
            <h1 className="text-xl font-black text-white uppercase tracking-wider">
              {isSignUp ? 'إنشاء حساب جديد / Register' : 'تسجيل الدخول / Log In'}
            </h1>
          </div>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-8 p-4 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-2xl text-center"
            >
              {error === 'Invalid email or password' ? 'خطأ في البريد الإلكتروني أو كلمة المرور / Invalid email or password' : error}
            </motion.div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-6">
            {/* Email field */}
            <div className="space-y-1 group">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex justify-between px-1">
                <span>البريد الإلكتروني</span>
                <span>Email Address</span>
              </label>
              <div className="relative border-b border-white/15 group-focus-within:border-indigo-400 transition-colors pb-2">
                <input
                  type="email"
                  required
                  className="w-full bg-transparent border-none text-white text-base font-bold placeholder:text-white/10 outline-none px-1"
                  placeholder="hossam@admin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1 group">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex justify-between px-1">
                <span>كلمة المرور</span>
                <span>Password</span>
              </label>
              <div className="relative border-b border-white/15 group-focus-within:border-indigo-400 transition-colors pb-2">
                <input
                  type="password"
                  required
                  className="w-full bg-transparent border-none text-white text-base font-bold placeholder:text-white/10 outline-none px-1"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Remember Me & Forget Password */}
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider px-1 py-1 text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-transparent text-indigo-500 focus:ring-0 focus:ring-offset-0" 
                />
                <span>تذكرني</span> / <span>Remember</span>
              </label>
              <button type="button" className="hover:text-white transition-colors">
                نسيت كلمة المرور؟ / Forget?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-500 font-extrabold text-white rounded-2xl uppercase text-[11px] tracking-[0.25em] transition-all duration-300 active:scale-98 shadow-lg shadow-indigo-950/50 border border-indigo-500/20"
            >
              {loading ? 'جاري التحميل... / Processing...' : (isSignUp ? 'إنشاء حساب / Sign Up' : 'دخول / Sign In')}
            </button>
          </form>

          {/* Sign Up / Sign In toggle */}
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-[11px] font-bold text-slate-400 tracking-wider">
              {isSignUp ? 'هل لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}{' '}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-indigo-400 hover:text-indigo-300 hover:underline ml-1 font-extrabold transition-colors"
              >
                {isSignUp ? 'تسجيل الدخول / Login' : 'إنشاء حساب / Register'}
              </button>
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-white/5 flex-1"></div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">أو عبر</span>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          {/* Social Sign In Buttons */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2.5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-[10px] font-black uppercase text-white tracking-wider">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2.5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl transition-all">
              <Github className="w-4 h-4 text-white" />
              <span className="text-[10px] font-black uppercase text-white tracking-wider">GitHub</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
