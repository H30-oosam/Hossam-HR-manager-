import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';
import { generateHRAdvice } from '../services/geminiService';
import { useUIStore } from '../store/uiStore';
import Markdown from 'react-markdown';

const AIAssistant = () => {
  const { isRTL } = useUIStore();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse(null);
    try {
      const result = await generateHRAdvice(input);
      setResponse(result || 'No advice found.');
    } catch (error) {
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-10 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl text-white shadow-lg">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">
            {isRTL ? 'مساعد التوظيف الذكي' : 'Strategic Engine'}
          </h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            {isRTL ? 'مدعوم من Gemini AI' : 'Powered by Gemini AI'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {response && (
          <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-4">
              <Bot className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
              <div className="prose prose-invert prose-indigo max-w-none prose-sm text-slate-300">
                <Markdown>{response}</Markdown>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleAsk} className="relative mt-4">
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-16 py-5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-white/5 transition-all placeholder:text-white/20 font-bold"
            placeholder={isRTL ? 'اسأل عن سياسات الموارد البشرية، اقتراحات التوظيف...' : 'Ask about HR policies, recruitment tips...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-white hover:text-indigo-900 transition-all shadow-xl shadow-black/10 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
