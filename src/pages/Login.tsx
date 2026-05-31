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
      {/* Dynamic Background Image - Night Sky with Moon */}
      <div 
        className="absolute inset-0 z-0 scale-110"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1472552944321-70211136d0c4?q=80&w=2500&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.6)'
        }}
      />
      
      {/* Animated Moon Overlay Effect */}
      <div className="absolute top-10 right-10 md:top-20 md:right-40 w-32 h-32 md:w-64 md:h-64 rounded-full bg-white/20 blur-3xl z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-card bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-10 md:p-14 shadow-2xl shadow-black/50">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
              {isSignUp ? 'Register' : 'Login'}
            </h1>
          </div>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs font-black uppercase tracking-widest rounded-2xl text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-8">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Email</label>
              <div className="relative border-b border-white/20 group-focus-within:border-white transition-colors pb-2">
                <input
                  type="email"
                  required
                  className="w-full bg-transparent border-none text-white text-lg font-bold placeholder:text-white/20 outline-none px-1"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative border-b border-white/20 group-focus-within:border-white transition-colors pb-2">
                <input
                  type="password"
                  required
                  className="w-full bg-transparent border-none text-white text-lg font-bold placeholder:text-white/20 outline-none px-1"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest px-1">
              <label className="flex items-center gap-2 text-white/60 cursor-pointer hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-transparent text-indigo-600 focus:ring-0" 
                />
                Remember Me
              </label>
              <button type="button" className="text-white/60 hover:text-white transition-colors">
                Forget Password
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-slate-900 font-black rounded-full uppercase text-xs tracking-[0.3em] hover:bg-indigo-50 transition-all active:scale-95 shadow-xl shadow-black/20"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Register' : 'log in')}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
              {isSignUp ? 'Already Have Account' : "Don't Have Account"}{' '}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-white hover:underline ml-1"
              >
                {isSignUp ? 'Login' : 'Register'}
              </button>
            </p>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Connect with</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-[10px] font-black uppercase text-white tracking-widest">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <Github className="w-5 h-5 text-white" />
              <span className="text-[10px] font-black uppercase text-white tracking-widest">GitHub</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Decorative leaf shapes as seen in the bottom right corner of the image */}
      <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-tr from-white to-transparent transform rotate-45 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]" />
      </div>
    </div>
  );
};

export default Login;
