import React, { useState, useCallback, useEffect } from 'react';
import type { Transaction } from '../types';
import { analyzeSpending } from '../services/geminiService';
import SkeletonLoader from './SkeletonLoader';

const GeminiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="url(#paint0_linear_1_2)"/>
    <path d="M12 4.01953C9.46788 4.01953 7.15178 5.23399 5.64648 7.05859L12 12L18.3535 7.05859C16.8482 5.23399 14.5321 4.01953 12 4.01953Z" fill="white" fillOpacity="0.8"/>
    <path d="M12 19.9805C14.5321 19.9805 16.8482 18.766 18.3535 16.9414L12 12L5.64648 16.9414C7.15178 18.766 9.46788 19.9805 12 19.9805Z" fill="white" fillOpacity="0.8"/>
    <defs>
    <linearGradient id="paint0_linear_1_2" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
    <stop stopColor="#4285F4"/>
    <stop offset="1" stopColor="#9B72CB"/>
    </linearGradient>
    </defs>
  </svg>
);

const RefreshIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5M15 9l-6 6m0-6l6 6" />
    </svg>
);


const MarkdownRenderer = ({ content }: { content: string }) => {
    // A simple markdown-like renderer for this use case
    const lines = content.split('\n');
    return (
        <div>
            {lines.map((line, index) => {
                if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-md font-semibold mt-3 mb-1 text-gray-200">{line.substring(4)}</h3>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-lg font-bold mt-4 mb-2 text-white">{line.substring(3)}</h2>;
                }
                if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-xl font-bold mt-4 mb-2 text-white">{line.substring(2)}</h1>;
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                    return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
                }
                if (line.trim() === '') {
                    return <br key={index} />;
                }
                return <p key={index} className="mb-2">{line}</p>;
            })}
        </div>
    );
};

const InsightSkeleton = () => (
    <div className="space-y-4">
        <SkeletonLoader className="h-5 w-3/4" />
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-5/6" />
        <SkeletonLoader className="h-4 w-1/2" />
        <br />
        <SkeletonLoader className="h-5 w-1/2" />
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-4/6" />
    </div>
);

// FIX: Define props interface for GeminiInsights component.
interface GeminiInsightsProps {
  transactions: Transaction[] | null;
}

const GeminiInsights: React.FC<GeminiInsightsProps> = ({ transactions }) => {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getInsights = useCallback(async () => {
    if (!transactions || transactions.length === 0) {
        setLoading(false);
        setInsights('');
        return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await analyzeSpending(transactions);
      setInsights(result);
    // FIX: Corrected syntax for try...catch...finally block.
    } catch (err: any) {
      setError(err.message || 'Failed to get insights.');
    } finally {
      setLoading(false);
    }
  }, [transactions]);

  useEffect(() => {
    getInsights();
  }, [getInsights]);
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <GeminiIcon />
            AI Spending Insights
        </h2>
        {!loading && (
             <button onClick={getInsights} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Refresh insights">
                <RefreshIcon />
            </button>
        )}
      </div>
      
      {loading && <InsightSkeleton />}

      {error && !loading && <p className="text-red-400">{error}</p>}
      
      {insights && !loading && (
        <div className="text-gray-300 prose prose-invert prose-sm max-w-none animate-fade-in-fast">
          <MarkdownRenderer content={insights} />
        </div>
      )}

      {!loading && !insights && !error && (
        <p className="text-gray-400">No transactions available to analyze.</p>
      )}
    </div>
  );
};

export default GeminiInsights;