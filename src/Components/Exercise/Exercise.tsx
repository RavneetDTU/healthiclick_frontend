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
  const [selectedExercise, setSelectedExercise] = useState<StructuredExercise | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [structuredExercises, setStructuredExercises] = useState<Record<string, StructuredExercise[]>>({});

  useEffect(() => {
    const fetchExercises = async (): Promise<void> => {
      const token = localStorage.getItem("token");
      const weekdayLower = weekDay?.toLowerCase();

      if (!user?.userid || !weekdayLower) {
        console.warn("⏳ Skipping fetch: missing userId or weekday");
        return;
      }

      if (!token) {
        setToast({ message: "User not authenticated", type: "error" });
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/exercise-plan/${user.userid}?weekday=${weekdayLower}`;

      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data: ExerciseSection[] = await response.json();

        if (data.length === 0) {
          console.warn("⚠️ API returned empty list, skipping state update");
          return;
        }

        const structured: Record<string, StructuredExercise[]> = {};

        data.forEach((section, sectionIndex) => {
          const category = section.name || `Session ${sectionIndex + 1}`;
          const entries: StructuredExercise[] = section.elements.map((el, idx) => ({
            id: sectionIndex * 100 + idx,
            exercise_name: el.exercise_name,
            duration: el.duration,
            video_link: el.video_link,
            comment: el.comment,
            weekday: section.weekday,
            category,
          }));

          if (!structured[category]) {
            structured[category] = entries;
          } else {
            structured[category] = [...structured[category], ...entries];
          }
        });

        setStructuredExercises(structured);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ Fetch failed:", message);
        setToast({ message, type: "error" });
      }
    };

    fetchExercises();
  }, [user?.userid, weekDay]);

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
      handleTrackExercise(selectedExercise.id, false, reason || "No reason given");
    }
    setModalOpen(false);
    setReason("");
    setNotes("");
    setSelectedExercise(null);
  };

  return (
    <div className="min-h-screen bg-[#fef7f2]">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="p-4 sm:p-6 overflow-y-auto w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Exercise Plan</h2>

          <div className="mb-6">
            <label className="text-base sm:text-lg font-medium mr-2 sm:mr-4">Weekdays</label>
            <select
              className="border rounded px-3 py-1 text-sm bg-white"
              value={weekDay}
              onChange={(e) => setWeekDay(e.target.value)}
            >
              <option value="">Choose a Day...</option>
              {weekDays.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          {Object.entries(structuredExercises).map(([sessionTitle, items]) => (
            <div key={sessionTitle} className="mb-6 bg-white rounded shadow-md">
              <div className="border-b px-4 py-2 font-semibold text-base sm:text-lg">
                {sessionTitle}
              </div>
              <div className="px-2 sm:px-4 py-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap justify-between items-center py-2 rounded px-2 hover:bg-orange-100"
                  >
                    <div className="w-full sm:w-48 text-sm sm:text-base capitalize">
                      {item.exercise_name}
                    </div>
                    <div className="w-1/3 sm:w-24 text-sm">{item.duration}</div>
                    <a
                      href={item.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-1/3 text-blue-600 underline text-xs sm:text-sm"
                    >
                      {item.video_link}
                    </a>
                    <div
                      className="text-green-500 text-xl cursor-pointer"
                      onClick={() => handleTrackExercise(item.id, true, "Completed")}
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
                ))}
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
                className="px-4 py-2 bg-gray-300 rounded"
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
