import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface PopupComponentProps {
  date: Date | null;
  feedback: string;
  onDateChange: (date: Date | null) => void;
  onFeedbackChange: (feedback: string) => void;
  onClose: () => void;
  onSave?: () => void; // optional save handler
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
    <div className="fixed inset-0 bg-gray-700/50 dark:bg-gray-700/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Schedule Next Follow-up</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Date</label>
          <DatePicker
            selected={date}
            onChange={onDateChange}
            className="border px-3 py-1 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Feedback</label>
          <input
            type="text"
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            className="border px-3 py-1 rounded w-full"
            placeholder="Enter feedback..."
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave?.(); // call if provided
              onClose();
            }}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
