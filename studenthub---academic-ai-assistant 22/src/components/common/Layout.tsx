import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Library, 
  Layers, 
  Brain, 
  Code, 
  PenTool, 
  Quote, 
  Clock, 
  User, 
  Settings, 
  ArrowLeft, 
  Sparkles 
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../SearchBar';

interface LayoutProps {
  children: React.ReactNode;
  onSearch: (query: string) => void;
}

export default function Layout({ children, onSearch }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-[#0D0D0E] hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">StudentHub</span>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-2">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/tools/chat" icon={MessageSquare} label="AI Chat" />
          <div className="pt-4 pb-2 px-4">
            <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Academic Tools</span>
          </div>
          <NavItem to="/tools/notes" icon={BookOpen} label="Notes Gen" />
          <NavItem to="/tools/lecture" icon={FileText} label="Lecture → Notes" />
          <NavItem to="/tools/study" icon={Library} label="Study Package" />
          <NavItem to="/tools/flashcards" icon={Layers} label="Flashcards" />
          <NavItem to="/tools/exam" icon={FileText} label="Exam Gen" />
          <NavItem to="/tools/quiz" icon={Brain} label="Quiz Gen" />
          <NavItem to="/tools/code" icon={Code} label="Code Helper" />
          <NavItem to="/tools/homework" icon={PenTool} label="Assignment Writer" />
          <NavItem to="/tools/citation" icon={Quote} label="Citation Gen" />
          <div className="pt-4 pb-2 px-4">
            <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Account</span>
          </div>
          <NavItem to="/history" icon={Clock} label="History" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-zinc-500 truncate">Scholar</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-red-400 transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            {!isDashboard && (
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <SearchBar onSearch={onSearch} onNavigate={(view) => navigate(view === 'dashboard' ? '/' : `/${view}`)} />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400">
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
          {children}
        </div>

        {/* Footer */}
        <footer className="mt-auto py-8 px-8 border-t border-white/5 text-center">
          <p className="text-xs text-zinc-600">
            &copy; 2026 StudentHub Academic Platform. Built with Gemini & Groq.
          </p>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}
