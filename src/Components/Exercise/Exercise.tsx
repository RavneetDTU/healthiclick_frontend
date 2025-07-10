"use client";

import React, { useEffect, useState } from "react";
import { useExerciseStore } from "./store/ExerciseStore";
import { useProfileStore } from "../UserProfile/store/userProfileStore";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Header } from "@/shared/atoms/Header";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { Footer } from "@/shared/atoms/Footer";
import { Toast } from "../ui/Toast";
import Link from "next/link";
import {
  fetchExercisePlan,
  fetchExercisePdfAvailability,
  fetchExerciseLastUpdate,
} from "@/lib/api";

interface ExerciseElement {
  exercise_name: string;
  duration: string;
  video_link: string;
  comment?: string;
}

interface ExerciseSection {
  name: string;
  time: string;
  weekday: string;
  elements: ExerciseElement[];
}

interface StructuredExercise extends ExerciseElement {
  id: number;
  weekday: string;
  category: string;
}

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const ExercisePage = () => {
  const { weekDay, setWeekDay } = useExerciseStore();
  const { user } = useProfileStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] =
    useState<StructuredExercise | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [structuredExercises, setStructuredExercises] = useState<
    Record<string, StructuredExercise[]>
  >({});
  const [pdfAvailable, setPdfAvailable] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async (): Promise<void> => {
      const weekdayLower = weekDay?.toLowerCase();
      const token = localStorage.getItem("token");
  
      if (!user?.userid || !weekdayLower || !token) {
        console.warn("⏳ Skipping fetch: missing userId, weekday, or token");
        return;
      }
  
      try {
        const data: ExerciseSection[] = await fetchExercisePlan(
          user.userid,
          weekdayLower,
        );
  
        if (data.length === 0) {
          console.warn("⚠️ API returned empty list, skipping state update");
          return;
        }
  
        const structured: Record<string, StructuredExercise[]> = {};
  
        data.forEach((section, sectionIndex) => {
          const category = section.name || `Session ${sectionIndex + 1}`;
          const entries: StructuredExercise[] = section.elements.map(
            (el, idx) => ({
              id: sectionIndex * 100 + idx,
              exercise_name: el.exercise_name,
              duration: el.duration,
              video_link: el.video_link,
              comment: el.comment,
              weekday: section.weekday,
              category,
            })
          );
  
          if (!structured[category]) {
            structured[category] = entries;
          } else {
            structured[category] = [...structured[category], ...entries];
          }
        });
  
        setStructuredExercises(structured);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message.includes("403")
              ? "You are not authorized to access this exercise plan."
              : error.message
            : "Unknown error";
        console.error("❌ Fetch failed:", message);
        setToast({ message, type: "error" });
      }
    };
  
    fetchExercises();
  }, [user?.userid, weekDay]);
  

  useEffect(() => {
    const checkPdfAvailability = async () => {
      if (!user?.userid) return;

      try {
        await fetchExercisePdfAvailability(user?.userid);
        setPdfAvailable(true);
      } catch (err) {
        console.warn("❌ PDF not available" , err);
        setPdfAvailable(false);
      }

      try {
        const planData = await fetchExerciseLastUpdate(user?.userid);
        const uploadedAt = planData?.[0]?.uploaded_at;

        if (uploadedAt) {
          const dt = new Date(uploadedAt);
          const formatted = dt.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          setLastUpdated(formatted);
        }
      } catch (err) {
        console.error("Error fetching last update:", err);
      }
    };

    checkPdfAvailability();
  }, [user?.userid]);

  const handleTrackExercise = async (
    exerciseId: number,
    followed: boolean,
    reason: string
  ): Promise<void> => {
    console.log("📝 Reason for action:", reason);

    setToast({
      message: followed ? "Exercise completed" : "Exercise skipped",
      type: followed ? "success" : "error",
    });
  };

  const openModal = (exercise: StructuredExercise): void => {
    setSelectedExercise(exercise);
    setModalOpen(true);
  };

  const submitReason = (): void => {
    if (selectedExercise) {
      handleTrackExercise(
        selectedExercise.id,
        false,
        reason || "No reason given"
      );
    }
    setModalOpen(false);
    setReason("");
    setNotes("");
    setSelectedExercise(null);
  };


  // If user is not logged in, show a message

  if (!user?.userid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your exercise plan.</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="p-4 sm:p-6 overflow-y-auto w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Exercise Plan</h2>

          <div className="mb-6">
            <label className="text-base sm:text-lg font-medium mr-2 sm:mr-4">
              Weekdays
            </label>
            <select
              className="border rounded px-3 py-1 text-sm bg-white"
              value={weekDay}
              onChange={(e) => setWeekDay(e.target.value)}
            >
              <option value="">Choose a Day...</option>
              {weekDays.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {structuredExercises &&
            Object.keys(structuredExercises).length === 0 && (
              <div className="bg-teal-100 border border-teal-300 text-gray-600 p-4 rounded mb-6">
                Your trainer hasn`t uploaded or added your exercise plan yet.
              </div>
            )}

          {pdfAvailable && (
            <div className="mb-6">
              <Link href="/feature/ExercisePlanPdf" target="_blank">
                <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
                  View Uploaded Exercise Plan
                </button>
              </Link>
              {lastUpdated && (
                <p className="text-sm text-gray-600 mt-2">
                  Last updated on: {lastUpdated}
                </p>
              )}
            </div>
          )}

          {Object.entries(structuredExercises).map(([sessionTitle, items]) => (
            <div key={sessionTitle} className="mb-6 bg-white rounded shadow-md">
              <div className="border-b px-4 py-2 font-semibold text-base sm:text-lg">
                {sessionTitle}
              </div>
              <div className="px-2 sm:px-4 py-2 overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full table-auto border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          Exercise Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          Duration
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          Video Link
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          Comment
                        </th>
                        <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-teal-100 dark:hover:bg-gray-700"
                        >
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 capitalize whitespace-nowrap">
                            {item.exercise_name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            {item.duration}
                          </td>
                          <td className="px-4 py-2 text-sm whitespace-nowrap">
                            <a
                              href={item.video_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-xs sm:text-sm"
                            >
                              {item.video_link}
                            </a>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            {item.comment}
                          </td>
                          <td className="px-4 py-2 text-sm text-center text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            <div className="flex justify-center items-center gap-4">
                              <div
                                className="text-green-500 text-xl cursor-pointer"
                                onClick={() =>
                                  handleTrackExercise(
                                    item.id,
                                    true,
                                    "Completed"
                                  )
                                }
                              >
                                <FaCheck />
                              </div>
                              <div
                                className="text-red-500 text-xl cursor-pointer"
                                onClick={() => openModal(item)}
                              >
                                <ImCross />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      <Footer />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {modalOpen && selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Reason for skipping: {selectedExercise.exercise_name}
            </h3>
            <label className="block mb-2 text-sm font-medium">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="E.g. Sore muscles"
            />
            <label className="block mb-2 text-sm font-medium">
              Additional Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={3}
              placeholder="Any other information you want to add"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-300 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={submitReason}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
