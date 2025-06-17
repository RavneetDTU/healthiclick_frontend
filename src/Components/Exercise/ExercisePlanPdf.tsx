"use client";

import React, { useEffect, useState } from "react";
import { useProfileStore } from "../UserProfile/store/userProfileStore";
import { Toast } from "../ui/Toast";

const ExercisePlanPdfPage = () => {
  const { user } = useProfileStore();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      const token = localStorage.getItem("token");
      if (!user?.userid || !token) {
        setToast({ message: "User not authenticated", type: "error" });
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/exercise-plan-pdf/${user.userid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("PDF not available");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Failed to load PDF:", error);
        setToast({ message: "Failed to load exercise PDF", type: "error" });
      }
    };

    fetchPdf();
  }, [user?.userid]);

  return (
    <div className="min-h-screen p-6 bg-[#fef7f2]">
      <h2 className="text-2xl font-bold mb-4 text-orange-700">Your Exercise Plan</h2>
      <p className="mb-6 text-gray-700">
        Hey, your dietician has uploaded your exercise plan in document format. Please download the exercise plan below.
      </p>

      {pdfUrl ? (
        <>
          <iframe
            src={pdfUrl}
            title="Diet Plan PDF"
            className="w-full h-[80vh] border rounded mb-4"
          />
          <a
            href={pdfUrl}
            download={`diet_plan_${user?.userid}.pdf`}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download Exercise Plan
          </a>
        </>
      ) : (
        <p className="text-sm text-gray-500">Loading PDF...</p>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ExercisePlanPdfPage;
