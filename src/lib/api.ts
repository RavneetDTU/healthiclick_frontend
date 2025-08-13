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
      ...(options.method === "POST" || options.method === "PUT"
        ? {}
        : { "Content-Type": "application/json" }),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return parseAsJson ? res.json() : res;
};

// -------------------
// Exercise Plan API
// -------------------

export const fetchExercisePlan = (userId: string, weekday: string) =>
  fetchWithAuth(`/exercise-plan/${userId}?weekday=${weekday}`);

export const fetchExercisePdfAvailability = (userId: string, weekday: string) =>
  fetchWithAuth(
    `/daily-exercise-plan-pdf/${userId}/${weekday}`,
    {},
    BASE_URL!,
    false
  );

export const DeleteExercise = (userId: string, weekday:string) =>
  fetchWithAuth(`/daily-exercise-plan/${userId}/${weekday}`, {
    method: "DELETE",
  });


// -------------------
// Diet Plan API
// -------------------

export const fetchDietPlan = (userId: string, weekday: string) =>
  fetchWithAuth(`/diet-plan/${userId}?weekday=${weekday}`);

export const fetchDietPdfAvailability = (userId: string, weekday: string) =>
  fetchWithAuth(
    `/diet-plan-pdf/${userId}/${weekday}`,
    {},
    BASE_URL!,
    false
  );

export const DeleteDietPlan = (userId: string, weekday:string) =>
  fetchWithAuth(`/diet-plans/${userId}/${weekday}`, {
    method: "DELETE",
  });

// -------------------
// Medical Records API
// -------------------

// lib/api.ts (or wherever uploadMedicalRecord is defined)
export const uploadMedicalRecord = (
  userId: string,
  recordType: string,
  file: File,
  title: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title); // ✅ include title like the curl

  return fetchWithAuth(
    `/medical-records/${userId}/${recordType}`,
    {
      method: "POST",
      body: formData,
    },
    BASE_URL!,
    false
  );
};

export const updateMedicalRecord = (
  userId: string,
  recordType: string,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  return fetchWithAuth(
    `/medical-records/${userId}/${recordType}`,
    {
      method: "PUT",
      body: formData,
    },
    BASE_URL!,
    false
  );
};

export const getMedicalRecords = (userId: string, recordType: string) => {
  return fetchWithAuth(`/medical-records/${userId}/${recordType}`);
};
export const getAllMedicalRecords = (userId: string) => {
  return fetchWithAuth(`/medical-records/${userId}/list`);
};

export const getMedicalRecordMetadata = (
  userId: string,
  recordType: string
) => {
  return fetchWithAuth(`/medical-records/${userId}/${recordType}`);
};

export const getMedicalRecordPdf = (userId: string, recordType: string) => {
  return fetchWithAuth(
    `/medical-records-pdf/${userId}/${recordType}`,
    {},
    BASE_URL!,
    false
  );
};

export const deleteMedicalRecord = (userId: string, recordType: string) => {
  return fetchWithAuth(`/medical-records/${userId}/${recordType}`, {
    method: "DELETE",
  });
};

// -------------------
// Exercise Tracking
// -------------------

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
