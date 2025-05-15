"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "./store/auth-store"

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUser({ id: "2", name, email })
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 shadow-md bg-white rounded-md">
      <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
      <p className="text-sm mb-4 text-gray-600">Join HealthiClick`s vibrant community today</p>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500">
          Sign Up
        </button>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
