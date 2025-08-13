// Components/UploadSection.tsx
"use client";

import React, { useState } from "react";
import { getMedicalRecords, uploadMedicalRecord } from "@/lib/api";
import { useProfileStore } from "@/Components/UserProfile/store/userProfileStore";

const RECORD_TYPES = [
  { value: "lab_reports", label: "Lab Reports" },
  { value: "prescriptions", label: "Prescriptions" },
  { value: "diagnostic_reports", label: "Diagnostic Reports" },
  { value: "vaccination_records", label: "Vaccination Records" },
  { value: "medical_certificates", label: "Medical Certificates" },
];

export default function UploadReportSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordType, setRecordType] = useState("");
  const [title, setTitle] = useState(""); // ✅ new state for title
  const [submitting, setSubmitting] = useState(false);

  const { user } = useProfileStore();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !user?.userid || !recordType || !title.trim()) return;

    try {
      setSubmitting(true);
      // ✅ pass title to API
      await uploadMedicalRecord(user.userid, recordType, selectedFile, title.trim());

      // refresh list after upload
      await getMedicalRecords(user.userid, recordType);
      
      // reset inputs
      setSelectedFile(null);
      setRecordType("");
      setTitle("");
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded mb-6 p-6">
      <h3 className="text-2xl font-semibold text-gray-800">Upload a New Report</h3>
      <p className="mt-2 text-gray-600">Select the record type and file to upload your health report</p>

      {/* Record Type Dropdown */}
      <div className="mt-4">
        <select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2.5"
        >
          <option value="">-- Select Record Type --</option>
          {RECORD_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Title Input (after dropdown as requested) */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter report title (e.g., blood report)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2.5"
        />
      </div>

      {/* File Input */}
      <div className="mt-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2.5"
        />
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || !recordType || !title.trim() || submitting}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-60"
        >
          {submitting ? "Uploading..." : "Upload Report"}
        </button>
      </div>
    </div>
  );
}
