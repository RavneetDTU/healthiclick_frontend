const BASE_URL = process.env.NEXT_PUBLIC_AUTH_API;

export async function post<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Something went wrong");
    }
  
    return res.json();
  }
