"use client";

import ProfileHeader from "./Components/ProfileHeader";
import ProfileTabs from "./Components/ProfileTabs";
import AddMealDialog from "./Components/AddMealDialog";
import AddExerciseDialog from "./Components/AddExerciseDialog";
import { Header } from "@/shared/atoms/Header";
import { Sidebar } from "@/shared/atoms/Sidebar";
import DocUploadMeal from "./Components/DocMealUpload";
import { useProfileStore } from "@/Components/UserProfile/store/userProfileStore";
import DocUploadExercise from "./Components/DocExerciseUpload";

export default function ProfilePage() {
  const { dialogOpen} = useProfileStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="w-full bg-gray-50">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            <div className="space-y-6">
              <ProfileHeader/>
              <ProfileTabs />
            </div>

            {dialogOpen.mealSeprate && <AddMealDialog />}
            {dialogOpen.mealDoc && <DocUploadMeal />}
            {dialogOpen.exercise && <AddExerciseDialog />}
            {dialogOpen.exerciseDoc && <DocUploadExercise />}
          </main>
        </div>
      </div>
    </div>
  );
}
