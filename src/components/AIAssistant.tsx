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
    <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-8 shadow-2xl shadow-indigo-200/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl text-white shadow-lg shadow-indigo-200">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {isRTL ? 'مساعد التوظيف الذكي' : 'AI HR Assistant'}
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            {isRTL ? 'مدعوم من Gemini AI' : 'Powered by Gemini AI'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {response && (
          <div className="p-6 bg-white/80 rounded-3xl border border-indigo-100/50 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-3">
              <Bot className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
              <div className="prose prose-indigo max-w-none prose-sm text-slate-700">
                <Markdown>{response}</Markdown>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleAsk} className="relative mt-4">
          <input
            type="text"
            className="w-full bg-white/50 border border-white/80 rounded-2xl pl-6 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
            placeholder={isRTL ? 'اسأل عن سياسات الموارد البشرية، اقتراحات التوظيف...' : 'Ask about HR policies, recruitment tips...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
