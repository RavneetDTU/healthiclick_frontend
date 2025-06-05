const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function post<T, D = Record<string, unknown>>(
  endpoint: string,
  data: D,
  asForm: boolean = false
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": asForm
      ? "application/x-www-form-urlencoded"
      : "application/json",
  };

  const body = asForm
    ? new URLSearchParams(data as Record<string, string>).toString()
    : JSON.stringify(data);

  const res = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  const raw = await res.text();

  if (!res.ok) {
    console.error("Raw response:", raw);
    let message = "Something went wrong";

    try {
      const parsed = JSON.parse(raw);
      message = parsed.detail?.[0]?.msg || parsed.message || message;
    } catch {
      message = raw;
    }

    throw new Error(message);
  }

  return JSON.parse(raw);
}
