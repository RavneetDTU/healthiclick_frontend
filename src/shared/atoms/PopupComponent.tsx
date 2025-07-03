import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface PopupComponentProps {
  date: Date | null;
  feedback: string;
  onDateChange: (date: Date | null) => void;
  onFeedbackChange: (feedback: string) => void;
  onClose: () => void;
  onSave?: () => void;
}

export const PopupComponent: React.FC<PopupComponentProps> = ({
  date,
  feedback,
  onDateChange,
  onFeedbackChange,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-700/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Schedule Next Follow-up</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <DatePicker
            selected={date}
            onChange={onDateChange}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
          <input
            type="text"
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter feedback..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave?.();
              onClose();
            }}
            className="px-4 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
