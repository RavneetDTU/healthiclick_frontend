"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "./store/auth-store";
import { post } from "@/utils/api";

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await post<{ token: string; user: { id: string; name: string; email: string } }>(
        "/login",
        { email, password }
      )

      localStorage.setItem("token", response.token)
      setUser(response.user)
      router.push("/feature/dashboard")
      router.refresh()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    }

  }

  return (
    <div className="w-full max-w-md mx-auto p-6 shadow-md bg-white rounded-md">
      <h2 className="text-2xl font-bold mb-2">Login</h2>
      <p className="text-sm mb-4 text-gray-600">Return and reconnect with HealthiClick.</p>
      <p className="text-sm mb-4 text-gray-600">Use dummy credentials: admin@example.com / admin123</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label>Email</label>
          <input
            className="w-full border border-orange-200 px-3 py-2 rounded-md"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" className="w-full bg-orange-300 text-black py-2 rounded hover:bg-orange-200">
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
  )
}
