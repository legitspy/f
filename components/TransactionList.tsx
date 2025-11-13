import React, { useState, useMemo } from 'react';
import type { Transaction } from '../types';
import SkeletonLoader from './SkeletonLoader';

const ReceivedIcon = () => (
    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center border-2 border-green-500/50">
      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19V5m0 14l-4-4m4 4l4-4" />
      </svg>
    </div>
);

const SentIcon = () => (
    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center border-2 border-red-500/50">
      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 5v14m0-14l-4 4m4-4l4 4" />
      </svg>
    </div>
);

const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const formatDate = (dateString: string, timeString: string | undefined) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);

    const datePart = `${day} ${month} '${year}`;
    if (timeString) {
        return `${datePart}, ${timeString}`;
    }
    return datePart;
};

const truncateHash = (hash: string, start: number = 6, end: number = 6): string => {
    if (!hash || hash.length <= start + end) {
        return hash;
    }
    return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
};


const TransactionRow = ({ tx, isExpanded, onToggle }: { tx: Transaction; isExpanded: boolean; onToggle: () => void; }) => {
    const isSent = tx.amount < 0;
    return (
        <>
            <button onClick={onToggle} className="w-full p-4 text-left hover:bg-gray-800/50 transition-colors duration-200 focus:outline-none">
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            {isSent ? <SentIcon /> : <ReceivedIcon />}
                        </div>
                        <div>
                            <p className="font-semibold text-white text-base">{tx.category}</p>
                            <p className="text-sm text-gray-400">{formatDate(tx.date, tx.time)}</p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-3">
                        <div>
                            <p className={`font-semibold text-base ${isSent ? 'text-red-400' : 'text-green-400'}`}>
                                {isSent ? '' : '+'} {tx.amount.toFixed(8)} BTC
                            </p>
                            {tx.status === 'Done' && (
                                <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                                    Confirmed
                                </span>
                            )}
                        </div>
                         <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </button>
            {isExpanded && (
                <div className="px-4 pb-4 pt-0 text-base text-gray-300 animate-fade-in">
                    <div className="border-t border-gray-800 pt-3 mt-3 space-y-3">
                        {tx.hash && (
                           <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-400">Hash ID:</span>
                                <a 
                                    href={`https://www.blockchain.com/btc/tx/${tx.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-base break-all ml-4 text-right text-blue-400 hover:underline"
                                >
                                    {truncateHash(tx.hash)}
                                </a>
                           </div>
                        )}
                         {tx.fee && (
                           <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-400">Fee:</span>
                                <span>{tx.fee.toFixed(8)} BTC</span>
                           </div>
                        )}
                        {tx.destination && (
                           <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-400 flex-shrink-0">Receiver:</span>
                                <span className="font-mono text-base break-all ml-4 text-right">{tx.destination}</span>
                           </div>
                        )}
                         {tx.source && (
                           <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-400 flex-shrink-0">Sender:</span>
                                <span className="font-mono text-base break-all ml-4 text-right">{tx.source}</span>
                           </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

const TransactionRowSkeleton = () => (
    <li className="p-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 w-2/3">
                <SkeletonLoader className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="w-full">
                    <SkeletonLoader className="h-5 w-24 mb-2" />
                    <SkeletonLoader className="h-4 w-32" />
                </div>
            </div>
            <div className="text-right w-1/3">
                <SkeletonLoader className="h-5 w-28 mb-2 ml-auto" />
                <SkeletonLoader className="h-4 w-20 ml-auto" />
            </div>
        </div>
    </li>
);

const TransactionList: React.FC<{ transactions: Transaction[] | null; isLoading: boolean; }> = ({ transactions, isLoading }) => {
    const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
    const [filters, setFilters] = useState({ search: '', category: 'All' });

    const handleToggleExpand = (txId: string) => {
      setExpandedTxId(prevId => (prevId === txId ? null : txId));
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handleCategoryChange = (category: 'All' | 'Sent' | 'Received') => {
        setFilters(prev => ({ ...prev, category }));
    };

    const filteredTransactions = useMemo(() => {
        if (!transactions) return [];
        return transactions.filter(tx => {
            const searchLower = filters.search.toLowerCase();
            if (filters.category !== 'All' && tx.category !== filters.category) {
                return false;
            }
            if (filters.search && !(
                tx.description.toLowerCase().includes(searchLower) ||
                tx.amount.toString().includes(filters.search) ||
                (tx.hash && tx.hash.toLowerCase().includes(searchLower)) ||
                (tx.source && tx.source.toLowerCase().includes(searchLower)) ||
                (tx.destination && tx.destination.toLowerCase().includes(searchLower))
            )) {
                return false;
            }
            return true;
        });
    }, [transactions, filters]);
    
    if (isLoading) {
        return (
            <div className="bg-gray-900 rounded-2xl border border-gray-800">
                <div className="p-4 border-b border-gray-800">
                    <SkeletonLoader className="h-6 w-48 mb-4" />
                    <SkeletonLoader className="h-10 w-full" />
                </div>
                <ul className="divide-y divide-gray-800">
                    {Array.from({ length: 5 }).map((_, i) => <TransactionRowSkeleton key={i} />)}
                </ul>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-900 rounded-2xl border border-gray-800">
            <div className="p-4 border-b border-gray-800">
                 <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by amount, address, hash..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 pl-10"
                        />
                    </div>
                    <div className="flex-shrink-0 grid grid-cols-3 gap-1 rounded-lg bg-gray-800 p-1">
                        {(['All', 'Sent', 'Received'] as const).map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filters.category === cat ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                 </div>
            </div>
            
            {filteredTransactions.length > 0 ? (
                 <ul className="divide-y divide-gray-800">
                    {filteredTransactions.map(tx => (
                        <li key={tx.id}>
                            <TransactionRow 
                                tx={tx} 
                                isExpanded={expandedTxId === tx.id} 
                                onToggle={() => handleToggleExpand(tx.id)}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-12 text-center text-gray-400">
                    <p>No transactions found.</p>
                </div>
            )}
        </div>
    );
};

export default TransactionList;