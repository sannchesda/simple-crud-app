import { ReactNode } from "react";

interface SimpleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    // children: ReactNode | null;
    triggerButton?: ReactNode;
}

export default function SimpleModal({ 
    isOpen, 
    onClose, 
    title, 
    // children, 
    triggerButton 
}: SimpleModalProps) {
    return (
        <div className="p-8">
            {triggerButton}

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">{title}</h2>
                        {/* <div className="mb-4">adasd</div> */}
                        <button
                            onClick={onClose}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
