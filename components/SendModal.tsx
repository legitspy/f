import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

interface SendModalProps {
  balance: number;
  onClose: () => void;
  walletAddress: string;
}

// A simple (not exhaustive) regex for bitcoin address validation (supports P2PKH, P2SH, and Bech32)
const BTC_ADDRESS_REGEX = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SendModal: React.FC<SendModalProps> = ({ balance, onClose, walletAddress }) => {
    const [step, setStep] = useState(1); // 1: input, 2: confirm, 3: success
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [speed, setSpeed] = useState('normal');
    const [fee, setFee] = useState(0);
    const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [btcToUsdRate, setBtcToUsdRate] = useState<number | null>(null);

    const feeRates: { [key: string]: number } = {
        economy: 0.00001000,
        normal: 0.00003200,
        priority: 0.00010000,
    };

    const validateAddress = (address: string) => {
        return BTC_ADDRESS_REGEX.test(address);
    };

    useEffect(() => {
        const fetchBtcPrice = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
                if (!response.ok) {
                    throw new Error('Failed to fetch BTC price');
                }
                const data = await response.json();
                if (data.bitcoin && data.bitcoin.usd) {
                    setBtcToUsdRate(data.bitcoin.usd);
                }
            } catch (priceError) {
                console.error("Failed to fetch BTC price for modal:", priceError);
            }
        };
        fetchBtcPrice();
    }, []);

    useEffect(() => {
        setFee(feeRates[speed]);
    }, [speed]);

    const handleValidation = () => {
        const newErrors: { recipient?: string; amount?: string } = {};
        
        if (!validateAddress(recipient)) {
            newErrors.recipient = 'Invalid Bitcoin address format.';
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            newErrors.amount = 'Please enter a valid amount greater than 0.';
        } else if (numericAmount + fee > balance) {
            newErrors.amount = 'Insufficient balance for this transaction.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (handleValidation()) {
            setStep(2);
        }
    };
    
    const handleConfirmSend = () => {
        setIsSubmitting(true);
        // Simulate network request
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(3);
        }, 1500);
    };

    const totalDeduction = parseFloat(amount || '0') + fee;
    
    const renderInputStep = () => (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Send Bitcoin</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
                    <CloseIcon />
                </button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-1">Recipient Address</label>
                    <input
                        type="text"
                        id="recipient"
                        value={recipient}
                        onChange={(e) => {
                            setRecipient(e.target.value);
                            if (errors.recipient) handleValidation(); // Re-validate on change
                        }}
                        placeholder="Enter Bitcoin address"
                        className={`w-full bg-gray-800 border text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 ${errors.recipient ? 'border-red-500' : 'border-gray-700'}`}
                    />
                    {errors.recipient && <p className="text-red-400 text-xs mt-1">{errors.recipient}</p>}
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (BTC)</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => {
                            setAmount(e.target.value);
                            if (errors.amount) handleValidation(); // Re-validate on change
                        }}
                        placeholder="0.00000000"
                        step="0.00000001"
                        className={`w-full bg-gray-800 border text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 ${errors.amount ? 'border-red-500' : 'border-gray-700'}`}
                    />
                     {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Speed</label>
                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-800 p-1">
                        {[
                            { id: 'economy', label: 'Economy' },
                            { id: 'normal', label: 'Normal' },
                            { id: 'priority', label: 'Priority' }
                        ].map(({id, label}) => (
                             <button
                                key={id}
                                onClick={() => setSpeed(id)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${speed === id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">Estimated Fee: {fee.toFixed(8)} BTC</p>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleContinue}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </>
    );

    const renderConfirmStep = () => (
         <>
            <h2 className="text-xl font-bold text-white text-center mb-6">Confirm Transaction</h2>
            <div className="space-y-3 bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                    <span className="text-gray-400 flex-shrink-0">Sending from</span>
                    <span className="font-mono text-white text-sm break-all text-right ml-4">{walletAddress}</span>
                </div>
                <div className="flex justify-between items-start">
                    <span className="text-gray-400 flex-shrink-0">Recipient</span>
                    <span className="font-mono text-white text-sm break-all text-right ml-4">{recipient}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Amount</span>
                    <div className="text-right">
                        <p className="font-semibold text-white">{parseFloat(amount).toFixed(8)} BTC</p>
                        {btcToUsdRate && <p className="text-xs text-gray-400">≈ ${(parseFloat(amount) * btcToUsdRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>}
                    </div>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-400">Fee</span>
                    <div className="text-right">
                        <p className="font-semibold text-white">{fee.toFixed(8)} BTC</p>
                        {btcToUsdRate && <p className="text-xs text-gray-400">≈ ${(fee * btcToUsdRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>}
                    </div>
                </div>
                 <div className="border-t border-gray-700 my-2"></div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">Total</span>
                    <div className="text-right">
                        <p className="font-bold text-white text-lg">{totalDeduction.toFixed(8)} BTC</p>
                        {btcToUsdRate && <p className="text-sm text-gray-400">≈ ${(totalDeduction * btcToUsdRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>}
                    </div>
                </div>
            </div>
             <div className="mt-6 flex gap-4">
                 <button
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300"
                >
                    Back
                </button>
                <button
                    onClick={handleConfirmSend}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 flex items-center justify-center"
                >
                    {isSubmitting ? <Spinner /> : 'Confirm & Send'}
                </button>
            </div>
        </>
    );

    const renderSuccessStep = () => (
        <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Transaction Submitted</h2>
            <p className="text-gray-400 mb-6">Your transaction has been submitted for signing and broadcasting to the network.</p>
            <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300"
            >
                Done
            </button>
        </div>
    );
    
    // Animation styles
    const animationStyles = `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
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
                className="bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700 w-full max-w-md m-4 transform transition-all animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {step === 1 && renderInputStep()}
                {step === 2 && renderConfirmStep()}
                {step === 3 && renderSuccessStep()}
            </div>
        </div>
    );
};

export default SendModal;