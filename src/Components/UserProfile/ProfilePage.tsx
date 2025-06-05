"use client";

import ProfileHeader from "./Components/ProfileHeader";
import ProfileTabs from "./Components/ProfileTabs";
import ActivityCharts from "./Components/ActivityChart";
import AddMealDialog from "./Components/AddMealDialog";
import AddExerciseDialog from "./Components/AddExerciseDialog";
import { Header } from "@/shared/atoms/Header";
import { Sidebar } from "@/shared/atoms/Sidebar";
import DocUploadMeal from "./Components/DocMealUpload";
import { useProfileStore } from "@/Components/UserProfile/store/userProfileStore";

export default function ProfilePage() {
  const { dialogOpen } = useProfileStore();

  return (
    <div className="min-h-screen bg-[#fef7f2]">
      <Header />

      <div className="flex ">
      <div className="hidden md:block">
       <Sidebar />
       </div>
       
        <div className="w-full bg-gray-50 dark:bg-gray-900">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-6">
              <ProfileHeader />
              <ProfileTabs />
              <ActivityCharts />
            </div>
            {dialogOpen.mealSeprate && <AddMealDialog />} 
            {dialogOpen.mealDoc && <DocUploadMeal />} 
            {dialogOpen.exercise && <AddExerciseDialog />} 
          </main>
        </div>
      </div>
    </div>
  );
}
