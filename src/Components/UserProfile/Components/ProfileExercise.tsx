"use client";

import React, { useEffect, useState } from "react";
import { Toast } from "@/Components/ui/Toast";
import EditPopup from "@/Components/EditPopUpComponent/EditPopUp";
import { weekDays } from "@/Components/DietPlan/store/DietStore";
import { useProfileStore } from "../store/userProfileStore";
import { useDietPlanStore } from "@/Components/DietPlan/store/DietStore";

export interface ExerciseElement {
  exercise_name: string;
  duration: string;
  video_link: string;
  comment?: string;
}

export interface ExerciseSection {
  name: string;
  time: string;
  weekday: string;
  elements: ExerciseElement[];
}

export interface StructuredExercise extends ExerciseElement {
  id: number;
  weekday: string;
  category: string;
  [key: string]: unknown;
}

function ProfileExercise() {
  const { user } = useProfileStore();
  const { weekDay, setWeekDay } = useDietPlanStore();

  const [structuredExercises, setStructuredExercises] = useState<
    Record<string, StructuredExercise[]>
  >({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [editInitialData, setEditInitialData] = useState<
    Record<string, StructuredExercise[]>
  >({});

  const openEditPopup = () => {
    setEditInitialData(structuredExercises);
    setEditPopupOpen(true);
  };

  const handleEditSave = async (
    updatedData: Record<string, StructuredExercise[]>
  ) => {
    if (!user?.userid || !weekDay) {
      setToast({ message: "Missing user or weekday info", type: "error" });
      return;
    }

    const token = localStorage.getItem("token");

    const formattedPayload = Object.entries(updatedData).map(
      ([category, items]) => ({
        name: category,
        time: new Date().toISOString(), // Adjust if needed
        weekday: weekDay,
        elements: items.map((item) => ({
          exercise_name: item.exercise_name,
          duration: item.duration,
          video_link: item.video_link,
          comment: item.comment,
        })),
      })
    );

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/exercises?user_id=${
          user.userid
        }&weekday=${weekDay.toLowerCase()}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedPayload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update exercises: ${errorText}`);
      }

      setStructuredExercises(updatedData); // optimistic UI update
      setToast({ message: "Exercise updated successfully", type: "success" });
    } catch (error: unknown) {
      console.error("PUT request failed:", error);
      setToast({
        message: "Failed to update exercises",
        type: "error",
      });
    }
  };

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
          error instanceof Error ? error.message : "Unknown error";
        console.error("❌ Fetch failed:", message);
        setToast({ message, type: "error" });
      }
    };

    fetchExercises();
  }, [user?.userid, weekDay]);

  return (
    <div className="h-fit bg-gray-50">
      <div className="p-2 md:p-4 overflow-y-auto w-full">
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

          <button onClick={openEditPopup}>
            <span className="ml-2 text-sm text-teal-600 hover:underline">
              Edit
            </span>
          </button>
        </div>

        {Object.entries(structuredExercises).map(([sessionTitle, items]) => (
          <div key={sessionTitle} className="mb-2 bg-white rounded shadow-md">
            <div className="border-b px-4 py-2 font-semibold text-base sm:text-lg">
              {sessionTitle}
            </div>
            <div className="px-2 sm:px-4 py-2 overflow-x-auto">
              <div className="min-w-full">
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-1/4">
                        Exercise Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-1/4">
                        Duration
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-1/4">
                        Video Link
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-1/4">
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-teal-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 capitalize">
                          {item.exercise_name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                          {item.duration}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <a
                            href={item.video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-xs sm:text-sm"
                          >
                            {item.video_link}
                          </a>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                          {item.comment}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <EditPopup<StructuredExercise>
        isOpen={editPopupOpen}
        title="Edit Exercise Plan"
        groupedData={editInitialData}
        onClose={() => setEditPopupOpen(false)}
        onSave={handleEditSave}
        visibleFields={["exercise_name", "duration", "video_link", "comment"]}
        sectionNameKey="category"
        itemDefaults={
          {
            exercise_name: "",
            duration: "",
            video_link: "",
            comment: "",
          } as StructuredExercise
        }
      />
    </div>
  );
}

export default ProfileExercise;
