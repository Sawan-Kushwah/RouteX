import { createPortal } from "react-dom";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-999">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-80 shadow-xl">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{message}</p>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 cursor-pointer rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
