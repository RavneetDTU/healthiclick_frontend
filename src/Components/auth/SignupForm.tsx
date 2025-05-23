"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "./store/auth-store"
import { post } from "@/utils/api"

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      const response = await post<{ user: { id: string; name: string; email: string } }>(
        "/register",
        { name, email, password }
      )

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
      <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
      <p className="text-sm mb-4 text-gray-600">Join HealthiClick`s vibrant community today</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label>Name</label>
          <input
            className="w-full border px-3 py-2 rounded-md border-orange-200"
            type="text"
            placeholder="Enter your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            className="w-full border px-3 py-2 rounded-md border-orange-200"
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
            className="w-full border px-3 py-2 rounded-md border-orange-200"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            className="w-full border px-3 py-2 rounded-md border-orange-200"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-orange-300 text-black py-2 rounded hover:bg-orange-200">
          Sign Up
        </button>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/feature/login" className="text-amber-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
