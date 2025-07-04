// src/app/feature/userProfile/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useProfileStore } from "@/Components/UserProfile/store/userProfileStore";
import ProfilePage from "@/Components/UserProfile/ProfilePage";

export default function UserProfilePage() {
  const { id } = useParams();
  const { setUser } = useProfileStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`, {
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
          exerciseCount: data.exercise_count || 0,
          mealCount: data.meal_count || 0,
          dietAdherence: data.diet_adherence || 0,
          exerciseCompletion: data.exercise_completion || 0,
          goalProgress: data.goal_progress || 0,
        });

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
        setIsLoading(false);
      });
  }, [id, setUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] p-10 text-center text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <ProfilePage />
    </div>
  );
}
