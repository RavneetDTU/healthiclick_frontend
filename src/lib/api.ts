// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token found");
  return token;
};

const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {},
  baseUrl: string = BASE_URL!,
  parseAsJson: boolean = true
) => {
  const token = getAuthToken();

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return parseAsJson ? res.json() : res;
};

// -------------------
// API Wrappers
// -------------------

export const fetchExercisePlan = (userId: string, weekday: string) =>
  fetchWithAuth(`/exercise-plan/${userId}?weekday=${weekday}`);

export const fetchExercisePdfAvailability = (userId: string) =>
  fetchWithAuth(`/exercise-plan-pdf/${userId}`, {}, BASE_URL!, false);

export const fetchExerciseLastUpdate = (userId: string) =>
  fetchWithAuth(`/exercise-plans/${userId}`);



// Fetch diet plan for a specific user and weekday
export const fetchDietPlan = (userId: string, weekday: string) =>
    fetchWithAuth(`/diet-plan/${userId}?weekday=${weekday}`);
  
  export const fetchDietPdfAvailability = (userId: string) =>
    fetchWithAuth(`/diet-plan-pdf/${userId}`, {}, BASE_URL!, false);
  
  export const fetchDietLastUpdated = (userId: string) =>
    fetchWithAuth(`/diet-plans/${userId}`);

export const trackExercise = (
  userId: string,
  exerciseId: number,
  followed: boolean,
  reason: string,
  notes: string,
  weekday: string
) =>
  fetchWithAuth(`/track-exercise`, {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      exercise_id: exerciseId,
      followed,
      reason,
      notes,
      weekday,
    }),
  });
