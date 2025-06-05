"use client";

import React, { useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { useProfileStore } from "@/Components/UserProfile/store/userProfileStore";
import { useDevice } from "@/hooks/useDevice";
import { BsCalendarDate } from "react-icons/bs";
import { GrYoga } from "react-icons/gr";
import { GiMeal } from "react-icons/gi";
import avtarImage from "@/images/assets/profile_avtar.png";
import axios from "axios";

export default function ProfileHeader() {
  const { user, setUser, setDialogOpen } = useProfileStore();
  const { isMobile } = useDevice();

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

        // Update the user store with full details
        setUser({
          userid: String(data.id),
          name: data.full_name,
          email: data.email,
          phone: data.phone,
          avatar: data.avatar || null,
          profileImage: data.avatar || "/images/assets/profile_avtar.png",
          memberSince: new Date(data.created_at).toLocaleDateString(),
          // Optional: If additional fields are returned later
          exerciseCount: user.exerciseCount,
          mealCount: user.mealCount,
          dietAdherence: user.dietAdherence,
          exerciseCompletion: user.exerciseCompletion,
          goalProgress: user.goalProgress,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch additional user info", err);
      });
  }, [user?.userid]);

  if (!user) return null;

  const isValidAvatar = user.avatar?.startsWith("http");
  const avatarSrc: string | StaticImageData =
    isValidAvatar && user.avatar ? user.avatar : avtarImage;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="h-32 sm:h-40 bg-gradient-to-r from-orange-200 to-orange-100 relative">
        {user.coverImage && (
          <Image
            src={user.coverImage}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
          <div className="relative -mt-16 sm:-mt-20">
            <div className="rounded-full border-4 border-gray-200 dark:border-gray-800 overflow-hidden h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 bg-white">
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
                <span>{user.exerciseCount} exercises</span>
              </div>
              <div className="flex items-center gap-1">
                <GiMeal />
                <span>{user.mealCount} meals</span>
              </div>
            </div>
          </div>

          <div
            className={`flex gap-2 mt-2 sm:mt-0 ${isMobile ? "w-full" : ""}`}
          >
            <button
              onClick={() => setDialogOpen("mealSeprate", true)}
              className={`flex items-center justify-center gap-2 px-3 py-2 text-sm bg-orange-300 text-black rounded-md hover:bg-orange-200 transition-colors ${
                isMobile ? "flex-1" : ""
              }`}
            >
              <GiMeal />
              Add Meal(Separetly)
            </button>
            <button
              onClick={() => setDialogOpen("mealDoc", true)}
              className={`flex items-center justify-center gap-2 px-3 py-2 text-sm bg-orange-300 text-black rounded-md hover:bg-orange-200 transition-colors ${
                isMobile ? "flex-1" : ""
              }`}
            >
              <GiMeal />
              Add Meal(Doc)
            </button>
            <button
              onClick={() => setDialogOpen("exercise", true)}
              className={`flex items-center justify-center gap-2 px-3 py-2 text-sm bg-orange-300 text-black rounded-md hover:bg-orange-200 transition-colors ${
                isMobile ? "flex-1" : ""
              }`}
            >
              <GrYoga />
              Add Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
