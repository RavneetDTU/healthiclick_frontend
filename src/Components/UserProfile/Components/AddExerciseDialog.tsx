"use client";

import { useState, useEffect, useRef } from "react";
import { useProfileStore } from "../store/userProfileStore";
import { Toast } from "@/Components/ui/Toast";

interface ExerciseItem {
  id: number;
  exercise_name: string;
  duration: string;
  video_link: string;
  weekday: string;
  sectionName: string;
  time?: string;
}

type ExerciseInput = {
  exercise_name: string;
  duration: string;
  video_link: string;
};

interface ExerciseSection {
  id: number;
  sectionName: string;
  editing: boolean;
  newSectionName: string;
  time: string;
  exercises: ExerciseInput[];
}

export default function AddExerciseDialog() {
  const { dialogOpen, setDialogOpen } = useProfileStore();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [weekday, setWeekday] = useState<string>("monday");
  const [sections, setSections] = useState<ExerciseSection[]>([
    {
      id: Date.now(),
      sectionName: "Exercise",
      newSectionName: "Exercise",
      editing: false,
      time: "",
      exercises: [
        { exercise_name: "", duration: "", video_link: "" },
        { exercise_name: "", duration: "", video_link: "" },
      ],
    },
  ]);
  const [savedExercises, setSavedExercises] = useState<ExerciseItem[]>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
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
        editing: true,
        time: "",
        exercises: [{ exercise_name: "", duration: "", video_link: "" }],
      },
    ]);
  };

  const handleSectionNameInputChange = (sectionIndex: number, value: string) => {
    const updated = [...sections];
    updated[sectionIndex].newSectionName = value;
    setSections(updated);
  };

  const handleDone = () => {
    for (const section of sections) {
      for (const ex of section.exercises) {
        if (!ex.exercise_name || !ex.duration || !ex.video_link) {
          showToast("Please fill all fields", "error");
          return;
        }
      }
    }

    const allExercises: ExerciseItem[] = sections.flatMap((section) =>
      section.exercises.map((ex, i) => ({
        id: Date.now() + i,
        weekday,
        sectionName: section.sectionName,
        time: section.time,
        ...ex,
      }))
    );

    const updated = [...savedExercises, ...allExercises];
    setSavedExercises(updated);
    localStorage.setItem("saved_exercises", JSON.stringify(updated));
    showToast("Exercises saved", "success");
    setDialogOpen("exercise", false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
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

  if (!dialogOpen.exercise) return null;

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div
          ref={dialogRef}
          className="bg-white rounded-lg shadow-lg w-full max-w-[90%] max-h-screen overflow-y-auto"
        >
          <h2 className="text-xl font-semibold text-center mt-4">Add Exercises</h2>

          <div className="text-center mt-2 mb-4">
            <select
              value={weekday}
              onChange={(e) => setWeekday(e.target.value)}
              className="w-40 p-2 border rounded"
            >
              {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
                (day) => (
                  <option key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="px-6 pb-4 space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="border-t pt-4">
                <div className="flex flex-wrap gap-3 items-center  justify-between mb-2">
                  <input
                    type="text"
                    value={section.newSectionName}
                    onChange={(e) => handleSectionNameInputChange(sectionIndex, e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  />

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Time:</label>
                    <input
                      type="time"
                      value={section.time}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[sectionIndex].time = e.target.value;
                        setSections(updated);
                      }}
                      className="border px-2 py-1 rounded text-sm mr-2"
                    />
                  </div>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-3 pr-2">
                  {section.exercises.map((ex, exerciseIndex) => (
                    <div className="flex gap-4" key={exerciseIndex}>
                      <input
                        type="text"
                        placeholder="Exercise name"
                        value={ex.exercise_name}
                        onChange={(e) =>
                          handleInputChange(sectionIndex, exerciseIndex, "exercise_name", e.target.value)
                        }
                        className="w-64 p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={ex.duration}
                        onChange={(e) =>
                          handleInputChange(sectionIndex, exerciseIndex, "duration", e.target.value)
                        }
                        className="w-40 p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Video Link"
                        value={ex.video_link}
                        onChange={(e) =>
                          handleInputChange(sectionIndex, exerciseIndex, "video_link", e.target.value)
                        }
                        className="flex-1 p-2 border rounded"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddMoreExercise(sectionIndex)}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add More
                </button>
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <button
                onClick={handleDone}
                className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
              >
                Done
              </button>
              <button
                onClick={handleAddSection}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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