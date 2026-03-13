import React, { useState } from 'react';
import { Save, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SaveButtonProps {
  tool: string;
  prompt: string;
  response: string;
  className?: string;
}

export default function SaveButton({ tool, prompt, response, className = "" }: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  const handleSave = async () => {
    if (!token || isSaving) return;

    setIsSaving(true);
    setError(null);
    
    try {
      const res = await fetch('/api/history/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tool,
          prompt: prompt.substring(0, 500), // Limit prompt length for storage
          response
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error(data.message || 'Failed to save result');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      setError('Failed to save result. Try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-end gap-1">
      <button 
        onClick={handleSave}
        disabled={isSaving}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
          saveSuccess 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
        } ${className}`}
      >
        {isSaving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : saveSuccess ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Save className="w-3.5 h-3.5" />
        )}
        {saveSuccess ? 'Result saved successfully' : 'Save Result'}
      </button>
      {error && (
        <span className="text-[10px] text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </span>
      )}
    </div>
  );
}
