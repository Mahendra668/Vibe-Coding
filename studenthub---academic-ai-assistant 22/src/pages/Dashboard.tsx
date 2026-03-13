import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { ToolCard } from '../components/common/ToolCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface DashboardProps {
  tools: any[];
}

const Dashboard = ({ tools }: DashboardProps) => {
  const { token, user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) return;
      try {
        const result = await apiService.get<any>('/api/user/dashboard', token);
        if (result.success) {
          setDashboardData(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (isLoading) return <LoadingSpinner className="min-h-[400px]" />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Welcome back, <span className="text-indigo-400">{user?.name}</span></h1>
          <p className="text-zinc-500">What would you like to achieve today?</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#121214] border border-white/5 rounded-2xl px-6 py-3 shadow-lg">
            <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold block mb-1">Saved Items</span>
            <span className="text-2xl font-black text-indigo-400">{dashboardData?.stats?.savedItems || 0}</span>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold">Academic Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard 
              key={tool.id}
              name={tool.name}
              desc={tool.desc}
              icon={tool.icon}
              color={tool.color}
              onClick={() => navigate(`/${tool.view}`)}
            />
          ))}
        </div>
      </section>

      {dashboardData?.recentActivity?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold">Recent Activity</h2>
            </div>
            <button onClick={() => navigate('/history')} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            {dashboardData.recentActivity.map((item: any, idx: number) => (
              <div key={idx} onClick={() => navigate('/history')} className="p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-200">{item.tool}</h4>
                      <p className="text-xs text-zinc-500 truncate max-w-md">{item.prompt}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
