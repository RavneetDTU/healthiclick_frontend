"use client";

import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useProfileStore } from "@/Components/UserProfile/store/userProfileStore";
import { useDevice } from "@/hooks/useDevice";
import { BsCalendarDate } from "react-icons/bs";
import { GrYoga } from "react-icons/gr";
import { GiMeal } from "react-icons/gi";
import avtarImage from "@/images/assets/profile_avtar.png";
import axios from "axios";
import { DietSection } from "@/Components/DietPlan/store/DietStore";
import { ExerciseSection } from "./ProfileExercise";

export default function ProfileHeader() {
  const { user, setUser, setDialogOpen } = useProfileStore();
  const { isMobile } = useDevice();
  const [hasMeals, setHasMeals] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [mealCount, setMealCount] = useState(0);
  const [weekDay] = useState<string>("Monday");
  const [, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Fetch user profile data
  useEffect(() => {
    if (!user?.userid) return;

    const token = localStorage.getItem("token");

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${user.userid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;

        setUser({
          userid: String(data.id),
          name: data.full_name,
          email: data.email,
          phone: data.phone,
          avatar: data.avatar || null,
          profileImage: data.avatar || "/images/assets/profile_avtar.png",
          memberSince: new Date(data.created_at).toLocaleDateString(),
        });
      })
      .catch((err) => {
        console.error("Failed to fetch additional user info", err);
      });
  }, [user?.userid]);

  // Fetch exercise plan data
  useEffect(() => {
    const fetchExercises = async () => {
      const token = localStorage.getItem("token");
      const weekdayLower = weekDay?.toLowerCase();

      if (!user?.userid || !weekdayLower) return;
      if (!token) {
        setToast({ message: "User not authenticated", type: "error" });
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/exercise-plan/${user.userid}?weekday=${weekdayLower}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data: ExerciseSection[] = await response.json();

        const exercisesExist = data.some(
          (section) => section.elements && section.elements.length > 0
        );

        setExerciseCount(Number(exercisesExist)); // Convert boolean to number
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setToast({ message, type: "error" });
      }
    };

    fetchExercises();
  }, [user?.userid, weekDay]);

  // Fetch diet plan data
  useEffect(() => {
    const fetchDietPlan = async () => {
      const token = localStorage.getItem("token");
      const weekdayLower = weekDay?.toLowerCase();

      if (!user?.userid || !weekDay || !token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/diet-plan/${user.userid}?weekday=${weekdayLower}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch diet plan");
        }

        const data: DietSection[] = await res.json();

        // Check if data exists to decide if meals are available
        const mealsExist = data.some(
          (section) => section.elements && section.elements.length > 0
        );

        setHasMeals(mealsExist); // Set hasMeals to true if meals exist
        setMealCount(mealsExist ? 1 : 0); // Track meal count (1 if meals exist, 0 otherwise)
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Diet plan fetch failed:", error);
          setToast({
            message: error.message || "Failed to load meals",
            type: "error",
          });
        } else {
          setToast({ message: "Unknown error occurred", type: "error" });
        }
      }
    };

    fetchDietPlan();
  }, [weekDay, user?.userid]);

  if (!user) return null;

  const isValidAvatar = user.avatar?.startsWith("http");
  const avatarSrc: string | StaticImageData =
    isValidAvatar && user.avatar ? user.avatar : avtarImage;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
      <div className="h-32 sm:h-40 bg-gray-200 relative"></div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
          <div className="relative -mt-16 sm:-mt-20">
            <div className="rounded-full border-4 border-gray-100 dark:border-gray-800 overflow-hidden h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 bg-white">
              <Image
                src={avatarSrc}
                alt={user.name}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
              <span className="text-gray-500 dark:text-gray-400 text-sm pr-2">
                {user.email}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {user.phone}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <BsCalendarDate />
                <span>Member since {user.memberSince}</span>
              </div>
              <div className="flex items-center gap-1">
                <GrYoga />
                <span>{exerciseCount} exercises</span>
              </div>
              <div className="flex items-center gap-1">
                <GiMeal />
                <span>{mealCount} meals</span>
              </div>
            </div>
          </div>

          <div
            className={`flex gap-2 mt-2 sm:mt-0 ${
              isMobile ? "w-full flex flex-col" : ""
            }`}
          >
            {!hasMeals && (
              <button
                onClick={() => setDialogOpen("mealSeprate", true)}
                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm bg-teal-100 text-black rounded-md hover:bg-teal-200 transition-colors ${
                  isMobile ? "flex-1" : ""
                }`}
              >
                <GiMeal />
                Add Meal(Separetly)
              </button>
            )}

            <button
              onClick={() => setDialogOpen("mealDoc", true)}
              className={`flex items-center justify-center gap-2 px-3 py-2 text-sm bg-teal-100 text-black rounded-md hover:bg-teal-200 transition-colors ${
                isMobile ? "flex-1" : ""
              }`}
            >
              <GiMeal />
              Add Meal(Doc)
            </button>

            {!exerciseCount && (
              <button
                onClick={() => setDialogOpen("exercise", true)}
                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm bg-teal-100 text-black rounded-md hover:bg-teal-200 transition-colors ${
                  isMobile ? "flex-1" : ""
                }`}
              >
                <GrYoga />
                Add Exercise
              </button>
            )}

            <button
              onClick={() => setDialogOpen("exerciseDoc", true)}
              className={`flex items-center justify-center gap-2 px-3 py-2 text-sm bg-teal-100 text-black rounded-md hover:bg-teal-200 transition-colors ${
                isMobile ? "flex-1" : ""
              }`}
            >
              <GrYoga />
              Add Exercise (Doc)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
