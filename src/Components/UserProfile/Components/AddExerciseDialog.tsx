"use client";

import { useState, useEffect, useRef } from "react";
import { useProfileStore } from "../store/userProfileStore";
import { Toast } from "@/Components/ui/Toast";

type ExerciseInput = {
  exercise_name: string;
  duration: string;
  video_link: string;
  comment: string;
};

interface ExerciseSection {
  id: number;
  sectionName: string;
  newSectionName: string;
  time: string;
  exercises: ExerciseInput[];
}

export default function AddExerciseDialog() {
  const { dialogOpen, setDialogOpen, user } = useProfileStore();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [weekday, setWeekday] = useState<string>("monday");
  const [sections, setSections] = useState<ExerciseSection[]>([
    {
      id: Date.now(),
      sectionName: "Exercise",
      newSectionName: "Exercise",
      time: "",
      exercises: [
        { exercise_name: "", duration: "", video_link: "", comment: "" },
      ],
    },
  ]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
  };

  const handleInputChange = (
    sectionIndex: number,
    exerciseIndex: number,
    field: keyof ExerciseInput,
    value: string
  ) => {
    const updated = [...sections];
    updated[sectionIndex].exercises[exerciseIndex][field] = value;
    setSections(updated);
  };

  const handleAddMoreExercise = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].exercises.push({
      exercise_name: "",
      duration: "",
      video_link: "",
      comment: "",
    });
    setSections(updated);
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        sectionName: `Section ${sections.length + 1}`,
        newSectionName: `Section ${sections.length + 1}`,
        time: "",
        exercises: [
          { exercise_name: "", duration: "", video_link: "", comment: "" },
        ],
      },
    ]);
  };

  const handleSectionNameInputChange = (
    sectionIndex: number,
    value: string
  ) => {
    const updated = [...sections];
    updated[sectionIndex].newSectionName = value;
    setSections(updated);
  };

  const handleDone = async () => {
    for (const section of sections) {
      for (const ex of section.exercises) {
        if (
          !ex.exercise_name ||
          !ex.duration ||
          !ex.video_link ||
          !ex.comment
        ) {
          showToast("Please fill all fields", "error");
          return;
        }
      }
    }

    const payload = sections.map((section) => ({
      name: section.newSectionName,
      time: section.time,
      elements: section.exercises.map((ex) => ({
        exercise_name: ex.exercise_name,
        duration: ex.duration,
        video_link: ex.video_link,
        comment: ex.comment,
      })),
      weekday,
    }));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/exercises?user_id=${user.userid}&weekday=${weekday}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      showToast("Exercises saved", "success");
      setDialogOpen("exercise", false);

      // Reload the page after a short delay to show the toast message
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      let message = "Something went wrong";
      if (error instanceof Error) {
        message = error.message;
      }
      showToast(message, "error");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setDialogOpen("exercise", false);
      }
    };

    if (dialogOpen.exercise) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [dialogOpen.exercise, setDialogOpen]);

  const initialSectionCount = useRef(sections.length); // Track initial section count

  // Reset sections when weekday changes
  useEffect(() => {
    if (!dialogOpen.exercise) return;
    
    // Create empty sections preserving the structure
    const newSections = Array(initialSectionCount.current)
      .fill(null)
      .map((_, i) => ({
        id: Date.now() + i, // New unique ID
        sectionName: `Section ${i + 1}`,
        newSectionName: `Section ${i + 1}`,
        time: "",
        exercises: [
          { exercise_name: "", duration: "", video_link: "", comment: "" },
        ],
      }));

    setSections(newSections);
  }, [weekday, dialogOpen.exercise]); 

  if (!dialogOpen.exercise) return null;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div
          ref={dialogRef}
          className="bg-white rounded-xl shadow-lg w-full md:max-w-[90%] max-h-screen overflow-y-auto"
        >
          <h2 className="text-xl font-semibold text-center mt-5 text-teal-700">
            Add Exercises
          </h2>

          <div className="text-center mt-2 mb-4">
            <select
              value={weekday}
              onChange={(e) => setWeekday(e.target.value)}
              className="w-40 p-2 border rounded text-sm"
            >
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="px-6 pb-6 space-y-8">
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="border-t pt-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-3 items-center">
                  <input
                    type="text"
                    value={section.newSectionName}
                    onChange={(e) =>
                      handleSectionNameInputChange(sectionIndex, e.target.value)
                    }
                    className="border px-3 py-2 rounded text-sm w-full md:w-1/2"
                  />

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">
                      Time:
                    </label>
                    <input
                      type="time"
                      value={section.time}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[sectionIndex].time = e.target.value;
                        setSections(updated);
                      }}
                      className="border px-3 py-2 rounded text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {section.exercises.map((ex, exerciseIndex) => (
                    <div key={exerciseIndex} className="flex flex-wrap gap-3">
                      <input
                        type="text"
                        placeholder="Exercise name"
                        value={ex.exercise_name}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            exerciseIndex,
                            "exercise_name",
                            e.target.value
                          )
                        }
                        className="w-40 md:w-64 p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={ex.duration}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            exerciseIndex,
                            "duration",
                            e.target.value
                          )
                        }
                        className="w-36 p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Video Link"
                        value={ex.video_link}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            exerciseIndex,
                            "video_link",
                            e.target.value
                          )
                        }
                        className="flex-1 p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Comment"
                        value={ex.comment}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            exerciseIndex,
                            "comment",
                            e.target.value
                          )
                        }
                        className="flex-1 p-2 border rounded"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddMoreExercise(sectionIndex)}
                  className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Add More
                </button>
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <button
                onClick={handleDone}
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                Done
              </button>
              <button
                onClick={handleAddSection}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
