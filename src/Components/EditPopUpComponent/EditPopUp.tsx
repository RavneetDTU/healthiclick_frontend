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
  sectionNameKey: string;
  itemDefaults: Partial<T>;
}

const EditPopup = <T extends Record<string, unknown>>({
  isOpen,
  title,
  groupedData,
  onClose,
  onSave,
  visibleFields,
  sectionNameKey,
  itemDefaults,
}: EditPopupProps<T>) => {
  const [sections, setSections] = useState<
    { id: string; name: string; items: T[] }[]
  >([]);

  useEffect(() => {
    const initialSections = Object.entries(groupedData).map(
      ([name, items], index) => ({
        id: `section-${index}-${Date.now()}`,
        name,
        items,
      })
    );
    setSections(initialSections);
  }, [groupedData]);

  const handleChange = (
    sectionId: string,
    itemIndex: number,
    fieldName: keyof T,
    value: string
  ) => {
    setSections(prev =>
      prev.map(section => {
        if (section.id === sectionId) {
          const updatedItems = [...section.items];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            [fieldName]: value,
          };
          return { ...section, items: updatedItems };
        }
        return section;
      })
    );
  };

  const handleDeleteItem = (sectionId: string, itemIndex: number) => {
    setSections(prev =>
      prev.map(section => {
        if (section.id === sectionId) {
          const updatedItems = section.items.filter(
            (_, i) => i !== itemIndex
          );
          return { ...section, items: updatedItems };
        }
        return section;
      })
    );
  };

  // NEW: Delete entire section handler
  const handleDeleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const handleAddSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      name: `New Section ${sections.length + 1}`,
      items: [
        {
          ...itemDefaults,
          id: Date.now(),
        } as unknown as T,
      ],
    };
    setSections(prev => [...prev, newSection]);
  };

  const handleAddItem = (sectionId: string) => {
    setSections(prev =>
      prev.map(section => {
        if (section.id === sectionId) {
          const newItem = {
            ...itemDefaults,
            id: Date.now(),
            [sectionNameKey]: section.name,
          } as unknown as T;
          return {
            ...section,
            items: [...section.items, newItem],
          };
        }
        return section;
      })
    );
  };

  const handleSave = () => {
    const updatedData = sections.reduce(
      (acc, section) => {
        acc[section.name] = section.items;
        return acc;
      },
      {} as Record<string, T[]>
    );
    onSave(updatedData);
    onClose();
  };

  const handleSectionNameChange = (sectionId: string, newName: string) => {
    setSections(prev =>
      prev.map(section => {
        if (section.id === sectionId) {
          const updatedItems = section.items.map(item => ({
            ...item,
            [sectionNameKey]: newName,
          }));
          return { ...section, name: newName, items: updatedItems };
        }
        return section;
      })
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        </div>

        {sections.map(section => (
          <div key={section.id} className="space-y-4 border-b pb-4">
            {/* Section Header with Name and Delete Button */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                  {sectionNameKey}
                </label>
                <input
                  type="text"
                  value={section.name}
                  onChange={e => handleSectionNameChange(section.id, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              
              {/* NEW: Delete Section Button */}
              <button
                onClick={() => handleDeleteSection(section.id)}
                className="mt-5 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition whitespace-nowrap"
              >
                Delete Section
              </button>
            </div>

            {section.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                {(Object.keys(item) as (keyof T)[])
                  .filter(key => !visibleFields || visibleFields.includes(key))
                  .map(key => (
                    <div key={String(key)}>
                      <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                        {String(key).replace(/_/g, " ")}
                      </label>
                      <input
                        type="text"
                        name={String(key)}
                        value={String(item[key])}
                        onChange={e =>
                          handleChange(section.id, index, key, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                  ))}
                <div className="flex justify-end items-center">
                  <button
                    onClick={() => handleDeleteItem(section.id, index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete Item
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={() => handleAddItem(section.id)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                Add Item
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAddSection}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            Add Section
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;