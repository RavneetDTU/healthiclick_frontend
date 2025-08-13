"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/Components/ui/Card";
import { Toast } from "@/Components/ui/Toast";
import { useProfileStore } from "../store/userProfileStore";
import { ExerciseWeekDays } from "@/Components/Exercise/store/ExerciseStore";
import { DeleteExercise, fetchExercisePdfAvailability } from "@/lib/api";

type DayKey = (typeof ExerciseWeekDays)[number];

export default function ProfileExercisePdf() {
  const { user, setDialogOpen } = useProfileStore();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [available, setAvailable] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const userId = user?.userid;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  const markLoading = (day: DayKey, v: boolean) =>
    setLoading((p) => ({ ...p, [day.toLowerCase()]: v }));

  const checkOne = async (day: DayKey) => {
    if (!userId) return;
    try {
      markLoading(day, true);
      const res = await fetchExercisePdfAvailability(userId, day.toLowerCase());
      const ok = (res as Response)?.ok ?? (res && (res).ok);
      setAvailable((p) => ({ ...p, [day.toLowerCase()]: !!ok }));
    } catch {
      setAvailable((p) => ({ ...p, [day.toLowerCase()]: false }));
    } finally {
      markLoading(day, false);
    }
  };

  const loadAll = () => {
    ExerciseWeekDays.forEach((d) => checkOne(d));
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleView = async (day: DayKey) => {
    if (!userId || !BASE_URL) return;
    try {
      markLoading(day, true);
      // GET uses the -pdf path
      const res = await fetchExercisePdfAvailability(userId, day.toLowerCase());
      
      if (!res.ok) throw new Error("PDF not found");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      showToast("Unable to open PDF.", "error");
      console.error("Failed to open PDF:", err);
    } finally {
      markLoading(day, false);
    }
  };

  const handleDelete = async (day: DayKey) => {
    if (!userId || !BASE_URL) return;
    try {
      markLoading(day, true);
      // DELETE uses /daily-exercise-plan/{userId}/{weekday} (per your spec)
      const res = await DeleteExercise(userId, day.toLowerCase());
      if (!res.ok) throw new Error("Delete failed");
      showToast(`Deleted Exercise PDF for ${day}.`, "success");
      setAvailable((p) => ({ ...p, [day.toLowerCase()]: false }));
    } catch (e) {
      showToast("Failed to delete.", "error");
        console.error("Delete failed:", e);
    } finally {
      markLoading(day, false);
    }
  };

  const handleUpdate = (day: DayKey) => {
    console.log("Update clicked for", day);
    // Opens your existing dialog; modal will PUT to the correct endpoint (see component below)
    setDialogOpen("exerciseDoc", true);
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ExerciseWeekDays.map((day) => {
          const key = day.toLowerCase();
          const isLoading = !!loading[key];
          const isAvailable = !!available[key];

          return (
            <Card key={day} className="border-gray-200">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{day}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {isLoading ? "Checking..." : isAvailable ? "PDF Available" : "Not Uploaded"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handleUpdate(day)}
                    className="px-3 py-1.5 text-sm rounded-md bg-teal-600 text-white hover:bg-teal-700"
                  >
                    Update
                  </button>

                  {isAvailable && (
                    <button
                      onClick={() => handleView(day)}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      View
                    </button>
                  )}

                  {isAvailable && (
                    <button
                      onClick={() => handleDelete(day)}
                      className="px-3 py-1.5 text-sm rounded-md text-red-600 border border-red-200 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
