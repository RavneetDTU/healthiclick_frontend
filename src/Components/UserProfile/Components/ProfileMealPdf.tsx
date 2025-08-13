"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/Components/ui/Card";
import { Toast } from "@/Components/ui/Toast";
import { useProfileStore } from "../store/userProfileStore";
import { weekDays } from "@/Components/DietPlan/store/DietStore";
import { DeleteDietPlan, fetchDietPdfAvailability } from "@/lib/api";

type DayKey = (typeof weekDays)[number];

export default function ProfileMealPdf() {
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
      const res = await fetchDietPdfAvailability(userId, day.toLowerCase());
      const ok = (res as Response)?.ok ?? (res && (res).ok);
      setAvailable((p) => ({ ...p, [day.toLowerCase()]: !!ok }));
    } catch {
      setAvailable((p) => ({ ...p, [day.toLowerCase()]: false }));
    } finally {
      markLoading(day, false);
    }
  };

  const loadAll = () => {
    weekDays.forEach((d) => checkOne(d));
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleView = async (day: DayKey) => {
    if (!userId || !BASE_URL) return;
    try {
      markLoading(day, true);
      // GET uses the -pdf path provided by fetchDietPdfAvailability
      const res = await fetchDietPdfAvailability(userId, day.toLowerCase());
      if (!(res as Response).ok) throw new Error("PDF not found");

      const blob = await (res as Response).blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      showToast("Unable to open PDF.", "error");
        console.error("Failed to open PDF:", e);
    } finally {
      markLoading(day, false);
    }
  };

  const handleDelete = async (day: DayKey) => {
    if (!userId || !BASE_URL) return;
    try {
      markLoading(day, true);
      // DELETE /diet-plan-pdf/{userId}/{weekday}
      const res = await DeleteDietPlan(userId, day.toLowerCase());
      if (!(res as Response).ok) throw new Error("Delete failed");

      showToast(`Deleted Meal PDF for ${day}.`, "success");
      setAvailable((p) => ({ ...p, [day.toLowerCase()]: false }));
    } catch (e) {
      showToast("Failed to delete.", "error");
        console.error("Delete failed:", e);
    } finally {
      markLoading(day, false);
    }
  };

  const handleUpdate = (day: DayKey) => {
    setDialogOpen("mealDoc", true);
    console.log("Update clicked for", day);
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekDays.map((day) => {
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
