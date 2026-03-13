import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  BookOpen, 
  Brain, 
  Code, 
  PenTool, 
  Library, 
  FileText, 
  Layers, 
  Quote
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PROMPT_TEMPLATES } from './constants/prompts';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Layout from './components/common/Layout';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const History = lazy(() => import('./pages/History'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const AuthForm = lazy(() => import('./pages/Auth'));

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, isLoading: authLoading } = useAuth();

  const tools = [
    { id: 'notes', name: 'Notes Generator', icon: BookOpen, color: 'text-blue-400', desc: 'Summarize lectures instantly', view: 'tools/notes' },
    { id: 'lecture', name: 'Lecture → Notes', icon: FileText, color: 'text-indigo-400', desc: 'Convert lectures to study kits', view: 'tools/lecture' },
    { id: 'study', name: 'Study Package', icon: Library, color: 'text-rose-400', desc: 'Full study kit in one click', view: 'tools/study' },
    { id: 'quiz', name: 'Quiz Generator', icon: Brain, color: 'text-purple-400', desc: 'Create practice tests', view: 'tools/quiz' },
    { id: 'flashcards', name: 'Flashcards', icon: Layers, color: 'text-emerald-400', desc: 'Active recall revision', view: 'tools/flashcards' },
    { id: 'exam', name: 'Exam Generator', icon: FileText, color: 'text-amber-400', desc: 'Create full exam papers', view: 'tools/exam' },
    { id: 'code', name: 'Code Helper', icon: Code, color: 'text-amber-400', desc: 'Understand & optimize code', view: 'tools/code' },
    { id: 'homework', name: 'Assignment Writer', icon: PenTool, color: 'text-emerald-400', desc: 'Get structured answers', view: 'tools/homework' },
    { id: 'citation', name: 'Citation Generator', icon: Quote, color: 'text-indigo-400', desc: 'Generate academic references', view: 'tools/citation' },
  ];

  if (authLoading) return <LoadingSpinner className="min-h-screen" />;

  if (!user) {
    return (
      <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
        <AuthForm type="login" onToggle={() => {}} />
      </Suspense>
    );
  }

  return (
    <Layout onSearch={(query) => {}}>
      <Suspense fallback={<LoadingSpinner className="min-h-[400px]" />}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard tools={tools} />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/chat" element={<Navigate to="/tools/chat" replace />} />
            <Route path="/history" element={<History />} />
            <Route path="/search" element={<SearchResults query="" onNavigate={() => {}} />} />
            
            {/* Centralized Tool Router */}
            <Route path="/tools/:toolId" element={<ToolsPage />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </Layout>
  );
}
