"use client";

import { useState } from "react";
import { useProfileStore } from "../store/userProfileStore";
import { colors } from "@/lib/theme";

export default function ProfileTabs() {
  const { user, meals, exercises, appointments } = useProfileStore();
  const [activeTab, setActiveTab] = useState("diet");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab("diet")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "diet"
                ? "border-orange-500 text-orange-500 dark:text-orange-100"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Diet Plan
          </button>
          <button
            onClick={() => setActiveTab("exercise")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "exercise"
                ? "border-orange-500 text-orange-500 dark:text-orange-200"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Exercise Plan
          </button>
          <button
            onClick={() => setActiveTab("client")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "client"
                ? "border-orange-500 text-orange-500 dark:text-orange-200"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Client Data
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "diet" && (
          <div>
            <h3 className="font-medium mb-3 text-sm sm:text-base">
              Meal Schedule
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <th className="text-left p-2 border-b border-gray-200 dark:border-gray-700 font-medium">
                      Meal
                    </th>
                    <th className="text-left p-2 border-b border-gray-200 dark:border-gray-700 font-medium">
                      Quantity
                    </th>
                    <th className="text-left p-2 border-b border-gray-200 dark:border-gray-700 font-medium">
                      Recipe
                    </th>
                    <th className="text-left p-2 border-b border-gray-200 dark:border-gray-700 font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {meals.map((meal) => (
                    <tr
                      key={meal.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <td className="p-2 font-medium">{meal.meal_name}</td>
                      <td className="p-2">{meal.quantity}</td>
                      <td className="p-2 max-w-xs truncate">{meal.recipe}</td>
                      <td className="p-2 text-gray-500 dark:text-gray-400">
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(new Date(meal.date))}
                      </td>
                    </tr>
                  ))}
                  {meals.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No meals added yet. Click the `Add Meal` button to get
                        started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "exercise" && (
          <div>
            <h3 className="font-medium mb-3 text-sm sm:text-base">
              Workout Schedule
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <th className="text-left p-2 border-b border-gray-200 dark:border-gray-700 font-medium">
                      Exercise
                    </th>
                    <th className="text-left p-2 border-b border-gray-200 dark:border-gray-700 font-medium">
                      Duration
                    </th>
                    <th className="text-left p-2 border-b border-gray-200 dark:border-gray-700 font-medium">
                      Video Link
                    </th>
                    <th className="text-left p-2 border-b border-gray-200 dark:border-gray-700 font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exercises.map((exercise) => (
                    <tr
                      key={exercise.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <td className="p-2 font-medium">
                        {exercise.exercise_name}
                      </td>
                      <td className="p-2">{exercise.duration}</td>
                      <td className="p-2">
                        {exercise.video_link ? (
                          <a
                            href={exercise.video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 underline"
                          >
                            Watch Video
                          </a>
                        ) : (
                          <span className="text-gray-400">No video</span>
                        )}
                      </td>
                      <td className="p-2 text-gray-500 dark:text-gray-400">
                        {new Date(exercise.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {exercises.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No exercises added yet. Click the `Add Exercise` button
                        to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "client" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 text-sm sm:text-base">
                Upcoming Appointments
              </h3>
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{appointment.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {appointment.date}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-500 dark:bg-orange-400 dark:text-violet-200">
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg">
                    No upcoming appointments scheduled.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-sm sm:text-base">
                Progress Metrics
              </h3>
              <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Diet Adherence</span>
                    <span className="font-medium">{user.dietAdherence}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${user.dietAdherence}%`,
                        backgroundColor: colors.primary[400],
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exercise Completion</span>
                    <span className="font-medium">
                      {user.exerciseCompletion}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${user.exerciseCompletion}%`,
                        backgroundColor: colors.primary[400],
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Goal Progress</span>
                    <span className="font-medium">{user.goalProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${user.goalProgress}%`,
                        backgroundColor: colors.primary[400],
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
