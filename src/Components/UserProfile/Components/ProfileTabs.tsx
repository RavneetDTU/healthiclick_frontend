"use client";

import { useState } from "react";
// import { useProfileStore } from "../store/userProfileStore";
import { ProfileDietPlan } from "./ProfileDietPlan";
import ProfileExercise from "./ProfileExercise";
import ProfileReports from "./ProfileReports";
import ProfileSession from "./ProfileSession";

export default function ProfileTabs() {
  // const { user, appointments } = useProfileStore();
  const [activeTab, setActiveTab] = useState("diet");

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
      <div className="border-b border-gray-100 px-4 sm:px-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab("diet")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "diet"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-500 hover:text-teal-500"
            }`}
          >
            Diet Plan
          </button>
          <button
            onClick={() => setActiveTab("exercise")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "exercise"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-500 hover:text-teal-500"
            }`}
          >
            Exercise Plan
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "reports"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-500 hover:text-teal-500"
            }`}
          >
            Reports
          </button>

          <button
            onClick={() => setActiveTab("session")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "session"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-500 hover:text-teal-500"
            }`}
          >
            Session
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-5">
        {activeTab === "diet" && <ProfileDietPlan />}

        {activeTab === "exercise" && (
          <div>
            <ProfileExercise />
          </div>
        )}

        {activeTab === "reports" && (
          <div>
            <ProfileReports />
          </div>
        )}

        {activeTab === "session" && (
          <div>
            <ProfileSession />
          </div>
        )}

      </div>
    </div>
  );
}
