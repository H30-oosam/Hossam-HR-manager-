/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';

// Components & Pages
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Recruitment from './pages/Recruitment';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Candidates from './pages/Candidates';
import Performance from './pages/Performance';
import Training from './pages/Training';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Logs from './pages/Logs';
import Map from './pages/Map';
import Users from './pages/Users';
import Files from './pages/Files';
import CRM from './pages/CRM';
import Assets from './pages/Assets';
import Onboarding from './pages/Onboarding';
import Documents from './pages/Documents';
import OrgChart from './pages/OrgChart';
import Announcements from './pages/Announcements';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  // Allow entering even without a formal user for this specific request
  // But we try to set a fallback user if session isn't ready
  return <Layout>{children}</Layout>;
};

export default function App() {
  const { setUser, setLoading } = useAuthStore();
  const { isRTL } = useUIStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as any);
          } else {
            // Check bootstrap admins
            const bootstrapEmails = ['hossamelwardany132@gmail.com', 'hossam@admin.com'];
            if (bootstrapEmails.includes(firebaseUser.email || '')) {
              const newUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin',
                role: 'admin',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              const { setDoc } = await import('firebase/firestore');
              await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
              setUser(newUser as any);
            } else {
              setUser(null);
            }
          }
        } catch (err: any) {
          console.error("Error fetching user profile:", err);
          setUser(null);
        }
      } else {
        // Auto-login fallback for Hossam Admin if user landing on page
        // or just set a mock user to avoid login redirect
        setUser({
          uid: 'hossam-demo-uid',
          email: 'hossam@admin.com',
          displayName: 'Admin Hossam',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/employees" element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        } />

        <Route path="/projects" element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } />

        <Route path="/map" element={
          <ProtectedRoute>
            <Map />
          </ProtectedRoute>
        } />

        <Route path="/logs" element={
          <ProtectedRoute>
            <Logs />
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        } />

        <Route path="/files" element={
          <ProtectedRoute>
            <Files />
          </ProtectedRoute>
        } />

        <Route path="/crm" element={
          <ProtectedRoute>
            <CRM />
          </ProtectedRoute>
        } />

        <Route path="/documents" element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        } />

        <Route path="/org-chart" element={
          <ProtectedRoute>
            <OrgChart />
          </ProtectedRoute>
        } />

        <Route path="/announcements" element={
          <ProtectedRoute>
            <Announcements />
          </ProtectedRoute>
        } />

        <Route path="/assets" element={
          <ProtectedRoute>
            <Assets />
          </ProtectedRoute>
        } />

        <Route path="/leaves" element={
          <ProtectedRoute>
            <Leaves />
          </ProtectedRoute>
        } />

        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />

        <Route path="/performance" element={
          <ProtectedRoute>
            <Performance />
          </ProtectedRoute>
        } />

        <Route path="/training" element={
          <ProtectedRoute>
            <Training />
          </ProtectedRoute>
        } />

        <Route path="/attendance" element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        } />

        <Route path="/payroll" element={
          <ProtectedRoute>
            <Payroll />
          </ProtectedRoute>
        } />

        <Route path="/recruitment" element={
          <ProtectedRoute>
            <Recruitment />
          </ProtectedRoute>
        } />

        <Route path="/candidates" element={
          <ProtectedRoute>
            <Candidates />
          </ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        {/* Fallback for other routes */}
        <Route path="*" element={
          <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl text-gray-400">🏗️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Module Under Construction</h2>
              <p className="text-gray-500 max-w-sm">
                We're building this module specifically for Hossam HR. Check back soon for the full experience.
              </p>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}


