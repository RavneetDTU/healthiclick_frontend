import React, { useState, useEffect } from "react";

export type FieldType = "text" | "date" | "select";

export interface Field {
  label: string;
  name: string;
  type: FieldType;
  options?: string[];
}

interface EditPopupProps<T extends Record<string, unknown>> {
  isOpen: boolean;
  title: string;
  groupedData: Record<string, T[]>;
  onClose: () => void;
  onSave: (updatedData: Record<string, T[]>) => void;
  visibleFields?: (keyof T)[];
}

const EditPopup = <T extends Record<string, unknown>>({
  isOpen,
  title,
  groupedData,
  onClose,
  onSave,
  visibleFields,
}: EditPopupProps<T>) => {
  const [formData, setFormData] = useState<Record<string, T[]>>(groupedData);

  useEffect(() => {
    setFormData(groupedData);
  }, [groupedData]);

  const handleChange = (
    groupKey: string,
    index: number,
    fieldName: keyof T,
    value: string
  ) => {
    const updatedGroup = [...formData[groupKey]];
    updatedGroup[index] = {
      ...updatedGroup[index],
      [fieldName]: value,
    };
    setFormData({
      ...formData,
      [groupKey]: updatedGroup,
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[95vh] overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-800">{title}</h2>
        </div>

        {Object.entries(formData).map(([groupTitle, items]) => (
          <div key={groupTitle} className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-700">{groupTitle}</h3>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(item) as (keyof T)[])
                  .filter((key) => !visibleFields || visibleFields.includes(key))
                  .map((key) => (
                    <div key={String(key)}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1 capitalize">
                        {String(key).replace(/_/g, " ")}
                      </label>
                      <input
                        type="text"
                        name={String(key)}
                        value={String(item[key])}
                        onChange={(e) =>
                          handleChange(groupTitle, index, key, e.target.value)
                        }
                        className="w-full border rounded px-4 py-2"
                      />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-200 text-gray-800 dark:text-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
