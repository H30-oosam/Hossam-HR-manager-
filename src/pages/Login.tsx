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
import { Github, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('hossam@admin.com');
  const [password, setPassword] = useState('1321994');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
          role: ['hossamelwardany132@gmail.com', 'hossam@admin.com'].includes(user.email || '') ? 'admin' : 'employee',
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
          role: ['hossamelwardany132@gmail.com', 'hossam@admin.com'].includes(result.user.email || '') ? 'admin' : 'employee',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const userPath = `users/${result.user.uid}`;
        try {
          await setDoc(doc(db, 'users', result.user.uid), newUser);
        } catch (err) {
          console.error("Error creating user profile:", err);
          // If profile creation fails, we still set the user state so they can see the dashboard, 
          // though some features might be limited.
        }
        setUser(newUser as any);
      } else {
        try {
          result = await signInWithEmailAndPassword(auth, email, password);
        } catch (signInErr: any) {
          // If the admin user doesn't exist, try creating it automatically
          if ((signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') && email === 'hossam@admin.com') {
            result = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = {
              uid: result.user.uid,
              email: result.user.email!,
              displayName: 'Admin Hossam',
              role: 'admin',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', result.user.uid), newUser);
            setUser(newUser as any);
            navigate('/');
            return;
          }
          throw signInErr;
        }
        const userPath = `users/${result.user.uid}`;
        try {
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as any);
          }
        } catch (err) {
          console.error("Error fetching profile on login:", err);
        }
      }
      navigate('/');
    } catch (err: any) {
      setError(isSignUp ? 'Could not create account. Email might be in use.' : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden shadow-indigo-200/20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200">
              H
            </div>
            <span className="text-2xl font-bold text-indigo-900 tracking-tight">Hossam HR</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isSignUp ? 'Create your account' : 'Sign in to workspace'}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {isSignUp ? 'Join Hossam HR today' : 'Enter your credentials to access your account'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-600 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-indigo-600 hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          <div className="my-8 flex items-center gap-4 text-slate-400">
            <div className="flex-1 h-px bg-white/40"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 h-px bg-white/40"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-white/50 border border-white/80 rounded-xl hover:bg-white/80 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-bold text-slate-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white/50 border border-white/80 rounded-xl hover:bg-white/80 transition-all shadow-sm">
              <Github className="w-5 h-5 text-slate-900" />
              <span className="font-bold text-slate-700">GitHub</span>
            </button>
          </div>
        </div>

        <div className="bg-indigo-900/5 p-6 text-center border-t border-white/40">
          <p className="text-sm text-slate-600 font-medium">
            Don't have an account? <a href="#" className="text-indigo-600 font-bold hover:underline">Contact HR</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
