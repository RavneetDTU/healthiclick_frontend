"use client";

import React, { useEffect, useState } from "react";
import { useExerciseStore } from "./store/ExerciseStore";
import { useProfileStore } from "../UserProfile/store/userProfileStore";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Header } from "@/shared/atoms/Header";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { Footer } from "@/shared/atoms/Footer";
import axios from "axios";
import { Exercise } from "./store/ExerciseStore";

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
  const { user } = useProfileStore();
  const {
    weekDay,
    setWeekDay,
    setExercisesByDay,
    exercisesByDay,
  } = useExerciseStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!user?.userid || !weekDay) return; 
  
    const fetchExercises = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user?.userid || !weekDay) {
        console.warn("Missing token, user ID or weekday");
        return;
      }
  
      const weekdayParam = weekDay.toLowerCase();
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/exercise-plan/${user.userid}?weekday=${weekdayParam}`;
  
      try {
        const response = await axios.get<Exercise[]>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const rawExercises = response.data;
  
        setExercisesByDay((prev) => ({
          ...prev,
          [weekdayParam]: rawExercises,
        }));
      } catch (error) {
        console.error("Failed to fetch exercise plan:", error);
      }
    };
  
    fetchExercises();
  }, [weekDay, user?.userid, setExercisesByDay]);
  

  const exercises: Exercise[] = exercisesByDay[weekDay.toLowerCase()] || [];

  const openModal = (exerciseName: string) => {
    setSelectedExercise(exerciseName);
    setModalOpen(true);
  };

  const submitReason = () => {
    console.log("Reason for skipping:", {
      exercise: selectedExercise,
      reason,
      notes,
    });
    setModalOpen(false);
    setReason("");
    setNotes("");
    setSelectedExercise(null);
  };

  return (
    <div className="min-h-screen bg-[#fef7f2]">
      <Header />
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-hidden">
          <main className="p-6 overflow-y-auto h-full">
            <h2 className="text-3xl font-bold mb-6">Exercise</h2>

            <div className="mb-6">
              <label className="text-lg font-medium mr-4">Weekdays</label>
              <select
                className="border rounded px-4 py-1 text-sm bg-white"
                value={weekDay}
                onChange={(e) => setWeekDay(e.target.value)}
              >
                {weekDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded shadow p-4 overflow-scroll">
              <h3 className="text-xl font-semibold mb-4">Exercise Table</h3>
              <table className="table-auto w-full text-sm overflow-x-auto">
                <thead className="text-left border-b">
                  <tr>
                    <th className="px-2 py-2 whitespace-nowrap">Exercise Name</th>
                    <th className="px-2 py-2 whitespace-nowrap">Duration</th>
                    <th className="px-2 py-2 whitespace-nowrap">Video Link</th>
                    <th className="px-2 py-2 whitespace-nowrap"></th>
                    <th className="px-2 py-2 whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  {exercises.map((ex, index) => (
                    <tr key={index} className="border-b hover:bg-slate-100">
                      <td className="px-2 py-2 whitespace-nowrap">{ex.exercise_name}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{ex.duration}</td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <a
                          href={ex.video_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {ex.video_link}
                        </a>
                      </td>
                      <td className="text-green-500 text-xl px-2 py-2 whitespace-nowrap">
                        <FaCheck />
                      </td>
                      <td
                        className="text-red-500 text-xl px-2 py-2 whitespace-nowrap cursor-pointer"
                        onClick={() => openModal(ex.exercise_name)}
                      >
                        <ImCross />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      <Footer />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reason for skipping: {selectedExercise}</h3>
            <label className="block mb-2 text-sm font-medium">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="E.g. Sore muscles"
            />
            <label className="block mb-2 text-sm font-medium">Additional Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={3}
              placeholder="Any other information you want to add"
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={submitReason}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
