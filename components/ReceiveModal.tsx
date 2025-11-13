import React, { useState } from 'react';
import Spinner from './Spinner';

interface ReceiveModalProps {
  address: string;
  onClose: () => void;
  qrCodeDataUrl: string | null | 'error';
}

const CopyIcon = () => (
    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ReceiveModal: React.FC<ReceiveModalProps> = ({ address, onClose, qrCodeDataUrl }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(address).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    // Add a simple fade-in and slide-up animation using a style tag
    const animationStyles = `
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
    `;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity animate-fade-in"
            onClick={onClose}
        >
            <style>{animationStyles}</style>
            <div 
                className="bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700 w-full max-w-sm m-4 text-center transform transition-all animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold text-white">Receive Bitcoin</h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
                        <CloseIcon />
                     </button>
                </div>
                
                <div className="bg-white p-4 rounded-lg inline-block mb-4 shadow-md">
                    {qrCodeDataUrl === 'error' ? (
                        <div className="w-[200px] h-[200px] flex flex-col items-center justify-center text-red-500 bg-gray-100 rounded-md p-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs font-semibold text-center text-gray-700">QR code failed to load.</p>
                        </div>
                    ) : qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt="Bitcoin Wallet QR Code" width={200} height={200} />
                    ) : (
                        <div className="w-[200px] h-[200px] flex items-center justify-center">
                            <Spinner />
                        </div>
                    )}
                </div>
                
                <p className="text-gray-400 mb-4 text-sm">Only send Bitcoin (BTC) to this address.</p>
                
                <div className="bg-gray-800 p-3 rounded-lg flex items-center justify-between gap-2">
                    <p className="text-white font-mono text-sm break-all text-left">{address}</p>
                    <button onClick={handleCopy} title={isCopied ? "Copied!" : "Copy Address"} className="p-2 rounded-lg hover:bg-gray-700 flex-shrink-0">
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300"
                >
                    Confirmed
                </button>
            </div>
        </div>
    );
};

export default ReceiveModal;