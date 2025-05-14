"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "./store/auth-store"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Dummy hardcoded credentials
    if (email === "admin@example.com" && password === "admin123") {
      setUser({ id: "1", name: "Admin", email })
      router.push("/feature/dashboard")
      router.refresh()
    } else {
      setError("Invalid email or password")
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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500">
          Login
        </button>
        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/feature/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
