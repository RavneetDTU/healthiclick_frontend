"use client";

import React, { useEffect, useState } from "react";
import { useProfileStore } from "../UserProfile/store/userProfileStore";
import { Toast } from "../ui/Toast";
import { ExerciseWeekDays, useExerciseStore } from "./store/ExerciseStore";

const DietPlanPdfPage = () => {
  const { user } = useProfileStore();
  const { ExerciseWeekDay, setExerciseWeekDay } = useExerciseStore();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchPdf = async (day: string) => {
    const token = localStorage.getItem("token");
    if (!user?.userid || !token) {
      setToast({ message: "User not authenticated", type: "error" });
      return;
    }

    setIsLoading(true);
    setPdfUrl(null); // Clear previous PDF while loading new one

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/daily-exercise-plan-pdf/${user.userid}/${day.toLowerCase()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("PDF not available for selected day");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Failed to load PDF:", error);
      setToast({ 
        message: `No diet plan available for ${day}`, 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPdf(ExerciseWeekDay);
  }, [user?.userid, ExerciseWeekDay]);

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExerciseWeekDay(e.target.value);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-teal-700">Your Exercise Plan</h2>
        <p className="mb-6 text-gray-700">
          View your Exercise plan for each day of the week. Select a day to view the corresponding plan.
        </p>

        {/* Weekday Selector */}
        <div className="mb-6">
          <label htmlFor="ExerciseWeekday" className="block text-sm font-medium text-gray-700 mb-2">
            Select Day of Week
          </label>
          <select
            id="ExerciseWeekday"
            value={ExerciseWeekDay}
            onChange={handleDayChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            disabled={isLoading}
          >
            {ExerciseWeekDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading {ExerciseWeekDay}`s plan...</p>
          </div>
        ) : pdfUrl ? (
          <>
            <div className="rounded-md overflow-hidden border mb-4">
              <iframe
                src={pdfUrl}
                title={`Diet Plan PDF - ${ExerciseWeekDay}`}
                className="w-full h-[80vh]"
              />
            </div>
            <a
              href={pdfUrl}
              download={`diet_plan_${ExerciseWeekDay.toLowerCase()}_${user?.userid}.pdf`}
              className="inline-block px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
            >
              Download {ExerciseWeekDay}`s Diet Plan
            </a>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No Exercise plan available for {ExerciseWeekDay}
            </p>
          </div>
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

export default DietPlanPdfPage;