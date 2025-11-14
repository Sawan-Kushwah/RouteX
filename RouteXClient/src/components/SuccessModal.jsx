import React from 'react'

export default function SuccessModal({
    visible = true,
    heading = 'Success!',
    details = {},
    onClose,
    buttonText = 'OK',
    autoClose = false,
    autoCloseDelay = 3000
}) {
    if (!visible) return null

    React.useEffect(() => {
        if (autoClose && visible) {
            const timer = setTimeout(onClose, autoCloseDelay)
            return () => clearTimeout(timer)
        }
    }, [visible, autoClose, autoCloseDelay, onClose])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md text-center transform transition-all duration-300 scale-100">
                <div className="flex flex-col items-center gap-6">
                    {/* Green Tick Circle */}
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 shadow-lg">
                        <svg className="w-10 h-10 text-green-600 dark:text-green-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Heading */}
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent dark:from-green-400 dark:to-green-300">
                            {heading}
                        </h3>
                    </div>

                    {/* Details */}
                    {Object.keys(details).length > 0 && (
                        <div className="text-left w-full bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                            {Object.entries(details).map(([key, value]) => {

                                if (key == '_id' || key == '__v' || key == 'updatedAt') return null;
                                return (

                                    <div key={key} className="flex justify-between items-start gap-2">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                                        </span>
                                        <span className="text-gray-600 dark:text-gray-400 text-right">{value || '-'}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Button */}
                    <button
                        onClick={onClose}
                        className="mt-6 px-6 py-3 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer dark:from-green-600 dark:to-green-700"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    )
}
