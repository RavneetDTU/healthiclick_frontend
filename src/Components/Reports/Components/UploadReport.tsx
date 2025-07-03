// Components/UploadSection.tsx
import React, { useState } from "react";

export default function UploadReportSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    // Here, you can handle the file upload logic, such as sending it to your server
    console.log("Uploading file:", selectedFile.name);
  };

  return (
    <div className="bg-white shadow rounded mb-6 p-6">
      <h3 className="text-2xl font-semibold text-gray-800">Upload a New Report</h3>
      <p className="mt-2 text-gray-600">Select a file to upload your health report</p>
      
      <div className="mt-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2.5"
        />
      </div>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Upload Report
        </button>
      </div>
    </div>
  );
}
