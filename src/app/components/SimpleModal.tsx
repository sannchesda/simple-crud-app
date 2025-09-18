import { ReactNode, useEffect } from "react";

interface SimpleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: ReactNode;
    triggerButton?: ReactNode;
}

export default function SimpleModal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    triggerButton 
}: SimpleModalProps) {
    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return triggerButton || null;

    return (
        <>
            {triggerButton}
            <div 
                className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 animate-fade-in"
                onClick={onClose}
            >
                <div 
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 w-full max-w-md mx-4 animate-bounce-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                            title="Close modal"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                        {children || (
                            <div className="text-gray-600 dark:text-gray-300 mb-6">
                                <p className="mb-4">This todo already exists in your list.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Please try adding a different todo or edit the existing one.</p>
                            </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
