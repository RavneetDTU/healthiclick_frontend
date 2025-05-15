"use client";

import React, { useEffect } from "react";
import { useExerciseStore } from "./store/ExerciseStore";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Header } from "@/shared/atoms/Header";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { Footer } from "@/shared/atoms/Footer";

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
  const { weekDay, setWeekDay, exercisesByDay, loadMockExercises } =
    useExerciseStore();

  useEffect(() => {
    loadMockExercises();
  }, [loadMockExercises]);

  const exercises = exercisesByDay[weekDay] || [];

  return (
    <div className="min-h-screen bg-[#fef7f2]">
      <Header />

      <div className="flex"> 
        <Sidebar />

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

            <div className="bg-white rounded shadow p-4">
              <h3 className="text-xl font-semibold mb-4">Exercise Table</h3>
              <table className="table-auto w-full text-sm">
                <thead className="text-left border-b">
                  <tr>
                    <th className="px-2 py-2">Exercise Name</th>
                    <th className="px-2 py-2">Duration</th>
                    <th className="px-2 py-2">Video Link</th>
                    <th className="px-2 py-2"></th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {exercises.map((ex, index) => (
                    <tr key={index} className="border-b hover:bg-slate-100">
                      <td className="px-2 py-2">{ex.name}</td>
                      <td className="px-2 py-2">{ex.duration}</td>
                      <td className="px-2 py-2">
                        <a
                          href={ex.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {ex.videoUrl}
                        </a>
                      </td>
                      <td className="text-green-500 text-xl px-2 py-2">
                        <FaCheck />
                      </td>
                      <td className="text-red-500 text-xl px-2 py-2">
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
    </div>
  );
};
