"use client";
import Image from "next/image";
import { useProfileStore } from "../store/userProfileStore";
import { useDevice } from "@/hooks/useDevice";
import { BsCalendarDate } from "react-icons/bs";
import { GrYoga } from "react-icons/gr";
import { GiMeal } from "react-icons/gi";
import avtarImage from "@/images/assets/profile_avtar.png"

export default function ProfileHeader() {
  const { user, setDialogOpen } = useProfileStore();
  const { isMobile } = useDevice();

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="h-32 sm:h-40 bg-gradient-to-r from-orange-200 to-orange-100 relative">
        {user.coverImage && (
          <Image
            src={user.coverImage || "/placeholder.svg"}
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
                src={avtarImage}
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
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {user.email}
              </p>
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
              onClick={() => setDialogOpen("meal", true)}
              className={`flex items-center justify-center gap-2 px-3 py-2 text-sm bg-orange-300 text-black rounded-md hover:bg-orange-200 transition-colors ${
                isMobile ? "flex-1" : ""
              }`}
            >
              <GiMeal />
              Add Meal
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
