import React, { useState, useRef, useEffect } from 'react';

// --- SVG Icons --- //
const HomeIcon = ({ active }: { active?: boolean }) => (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill={active ? "#3B82F6" : "#9CA3AF"} xmlns="http://www.w3.org/2000/svg">
        <path d="M21.63 11.16L12.75 4.09C12.31 3.74 11.69 3.74 11.25 4.09L2.37 11.16C1.61 11.78 2.13 13 3.1 13H4.11V20C4.11 20.55 4.56 21 5.11 21H8.66C9.21 21 9.66 20.55 9.66 20V15.5C9.66 14.95 10.11 14.5 10.66 14.5H13.34C13.89 14.5 14.34 14.95 14.34 15.5V20C14.34 20.55 14.79 21 15.34 21H18.89C19.44 21 19.89 20.55 19.89 20V13H20.9C21.87 13 22.39 11.78 21.63 11.16Z"/>
    </svg>
);

const SwapIcon = () => (
    <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3L21 8L16 13" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 21L3 16L8 11" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const SettingsIcon = ({ active }: { active?: boolean }) => (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke={active ? "#3B82F6" : "#9CA3AF"} strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.43 12.98C19.52 12.67 19.56 12.34 19.56 12C19.56 11.66 19.52 11.33 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.06 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.65 7.44 6.05L4.94 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.22 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.48 11.33 4.44 11.66 4.44 12C4.44 12.34 4.48 12.67 4.57 12.98L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.04 4.94 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.35 16.56 17.95L19.06 18.95C19.27 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98Z" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- Components --- //
interface BottomNavBarProps {
    onSendClick: () => void;
    onReceiveClick: () => void;
}

const NavItem = ({ icon, active = false, onClick }: { icon: React.ReactNode, active?: boolean, onClick?: () => void }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${active ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`} aria-pressed={active}>
        {icon}
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onSendClick, onReceiveClick }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsActionMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleActionClick = (action: 'send' | 'receive') => {
        setIsActionMenuOpen(false);
        if (action === 'send') onSendClick();
        else onReceiveClick();
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 h-[70px] bg-black/80 backdrop-blur-lg border-t border-gray-800 z-40">
                <div className="flex justify-around items-center h-full max-w-7xl mx-auto px-4">
                    <NavItem icon={<HomeIcon active={activeTab === 'home'} />} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                    <div className="w-16 h-16" /> {/* Placeholder for central button */}
                    <NavItem icon={<SettingsIcon active={activeTab === 'settings'} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </div>
            </div>

            {/* Central Action Button and Menu */}
            <div ref={menuRef} className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
                {isActionMenuOpen && (
                    <div className="flex flex-col gap-3 mb-4 p-3 bg-gray-800 rounded-xl shadow-lg animate-fade-in-fast">
                        <button onClick={() => handleActionClick('send')} className="flex items-center gap-3 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" /></svg>
                           <span>Send</span>
                        </button>
                        <button onClick={() => handleActionClick('receive')} className="flex items-center gap-3 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>
                           <span>Receive</span>
                        </button>
                    </div>
                )}
                 <button 
                    onClick={() => setIsActionMenuOpen(prev => !prev)} 
                    className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                    aria-label="Actions"
                    aria-expanded={isActionMenuOpen}
                >
                    <SwapIcon />
                </button>
            </div>
        </>
    );
};

export default BottomNavBar;