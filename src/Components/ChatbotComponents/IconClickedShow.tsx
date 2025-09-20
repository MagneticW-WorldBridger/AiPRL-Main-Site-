import React from "react";
import Character01 from "../../assets/GraphicContent/Character01.png";

interface IconClickedShowProps {
    isVisible: boolean;
    onClose: () => void;
    onChatClick: () => void;
}

function IconClickedShow({ isVisible, onClose, onChatClick }: IconClickedShowProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-24 sm:right-8 z-40 animate-fade-in" onClick={onClose}>
            <div className="relative rounded-2xl pt-4 sm:p-6 max-w-xs sm:max-w-md">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex-shrink-0 order-1 sm:order-2">
                        <img
                            src={Character01}
                            alt="Customer Service"
                            className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                        />
                    </div>

                    <div className="flex-1 order-2 sm:order-1 bg-white rounded-2xl p-4 shadow-2xl w-[85%] sm:w-full">
                        <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-2 text-center sm:text-left">
                            Welcome to our website!
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed text-center sm:text-left">
                            Nice to meet you! If you have any questions about our services, feel free to contact us.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex justify-center sm:justify-start">
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            onChatClick();
                        }}
                        className="px-6 sm:px-8 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-medium py-3 rounded-full transition-all duration-300 shadow-lg text-sm sm:text-base cursor-pointer"
                    >
                        Chat with store consultant
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IconClickedShow;