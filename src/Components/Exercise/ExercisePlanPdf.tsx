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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-teal-700">Your Exercise Plan</h2>
        <p className="mb-6 text-gray-700">
          Hey, your dietician has uploaded your exercise plan in document format. Please download the plan below.
        </p>

        {pdfUrl ? (
          <>
            <div className="rounded-md overflow-hidden border mb-4">
              <iframe
                src={pdfUrl}
                title="Exercise Plan PDF"
                className="w-full h-[80vh]"
              />
            </div>
            <a
              href={pdfUrl}
              download={`exercise_plan_${user?.userid}.pdf`}
              className="inline-block px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Download Exercise Plan
            </a>
          </>
        ) : (
          <p className="text-sm text-gray-500">Loading PDF...</p>
        )}
      </div>

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
