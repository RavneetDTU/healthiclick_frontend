"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { post } from "@/utils/api";
import { useProfileStore } from "@/Components/UserProfile/store/userProfileStore";

type LoginResponse = {
  access_token: string;
  token_type: string;
  is_admin: boolean;
};

export function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const setUser = useProfileStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userName || !password) {
      setError("Username and password are required");
      return;
    }

    if (!userName.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // Step 1: Login
      const response = await post<LoginResponse>("/token", {
        username: userName,
        password,
      }, true);

      const token = response.access_token;
      localStorage.setItem("token", token);
      localStorage.setItem("is_admin", response.is_admin.toString());

      // Step 2: Fetch user info
      const userInfo = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userInfo.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userData = await userInfo.json();
      
      if (!userData || !userData.id) {
        throw new Error("Invalid user data received");
      }
      // Step 3: Set user in Zustand store
      setUser({
        userid: userData.id,
        name: userData.full_name,
        email: userData.email,
        phone: userData.phone || "Not provided",
        avatar: userData.avatar || null,
        memberSince: new Date(userData.created_at).toLocaleDateString(),
        profileImage: userData.avatar || "/images/assets/profile_avtar.png",

        // fallback values in case backend doesn't return them
        exerciseCount: userData.exerciseCount ?? 0,
        mealCount: userData.mealCount ?? 0,
        dietAdherence: userData.dietAdherence ?? 0,
        exerciseCompletion: userData.exerciseCompletion ?? 0,
        goalProgress: userData.goalProgress ?? 0,
      });

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userid", userData.id);

      router.push("/feature/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 shadow-md bg-white rounded-md">
      <h2 className="text-2xl font-bold mb-2">Login</h2>
      <p className="text-sm mb-4 text-gray-700 dark:text-gray-700">Return and reconnect with HealthiClick.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label>Username</label>
          <input
            className="w-full border border-orange-200 px-3 py-2 rounded-md"
            type="email"
            placeholder="Enter your Email"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            className="w-full border border-orange-200 px-3 py-2 rounded-md"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-300 text-black py-2 rounded hover:bg-orange-200"
        >
          Login
        </button>
        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/feature/signup" className="text-amber-600 underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
