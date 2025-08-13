import { create } from "zustand";
import type { Report, ReportDetail } from "../types/reports";
import { getMedicalRecords, getAllMedicalRecords } from "@/lib/api";
import { useProfileStore } from "@/Components/UserProfile/store/userProfileStore";

export type RecordType =
  | "lab_reports"
  | "prescriptions"
  | "diagnostic_reports"
  | "vaccination_records"
  | "medical_certificates";

// Raw API shapes
interface RawDetail {
  name?: string;
  value?: string | number;
  status?: Report["status"]; // may be absent
}

interface RawMedicalRecord {
  id?: string | number;
  title?: string;
  name?: string;
  date?: string;
  created_at?: string;
  uploaded_at?: string;
  status?: Report["status"];
  details?: RawDetail[];
  record_type?: string;
  recordType?: string;
  type?: string;
}

const RECORDTYPE_TO_CATEGORY: Record<
  RecordType,
  "lab" | "imaging" | "examination" | "vaccination"
> = {
  lab_reports: "lab",
  diagnostic_reports: "imaging",
  medical_certificates: "examination",
  vaccination_records: "vaccination",
  prescriptions: "examination", 
};

// Ensure ReportDetail[] shape (fills missing status)
function coerceDetails(raw?: RawDetail[]): ReportDetail[] {
  const fallbackStatus: ReportDetail["status"] = "normal";
  if (!Array.isArray(raw)) return [];
  return raw.map<ReportDetail>((d) => ({
    name: String(d?.name ?? ""),
    value: String(d?.value ?? ""), 
    status: (d?.status as ReportDetail["status"]) ?? fallbackStatus,
  }));
}

// Single-type normalizer: include userId + type
function normalizeToReports(
  raw: RawMedicalRecord[],
  recordType: RecordType,
  userId: string
): Report[] {
  const category: Report["category"] = RECORDTYPE_TO_CATEGORY[recordType];
  return (raw || []).map<Report>((item, idx) => {
    const id = item.id ?? `${recordType}-${idx}`;
    const name = item.title ?? item.name ?? "Untitled Report";
    const dateSource =
      item.date ?? item.created_at ?? item.uploaded_at ?? new Date().toISOString();
    const date = new Date(dateSource).toISOString().slice(0, 10);
    const status = (item.status as Report["status"]) ?? "normal";
    const details = coerceDetails(item.details);

    return {
      id: String(id),
      userId,
      type: recordType,
      name,
      category,
      date,
      status,
      details,
    };
  });
}

// Mixed-list normalizer: detect recordType, set userId + type
function normalizeListToReports(raw: RawMedicalRecord[], userId: string): Report[] {
  return (raw || []).map<Report>((item, idx) => {
    const rtRaw = item.record_type || item.recordType || item.type || "lab_reports";

    const recordType: RecordType = ([
      "lab_reports",
      "prescriptions",
      "diagnostic_reports",
      "vaccination_records",
      "medical_certificates",
    ] as const).includes(rtRaw as RecordType)
      ? (rtRaw as RecordType)
      : "lab_reports";

    const category: Report["category"] = RECORDTYPE_TO_CATEGORY[recordType];

    const id = item.id ?? `${recordType}-${idx}`;
    const name = item.title ?? item.name ?? "Untitled Report";
    const dateSource =
      item.date ?? item.created_at ?? item.uploaded_at ?? new Date().toISOString();
    const date = new Date(dateSource).toISOString().slice(0, 10);
    const status = (item.status as Report["status"]) ?? "normal";
    const details = coerceDetails(item.details);

    return {
      id: String(id),
      userId,
      type: recordType,
      name,
      category,
      date,
      status,
      details,
    };
  });
}

interface ReportsState {
  reports: Report[];
  filteredReports: Report[];
  isLoading: boolean;
  error: string | null;

  selectedRecordType: RecordType | "";

  fetchReports: (recordType: RecordType) => Promise<void>;
  fetchAllReports: () => Promise<void>;

  filterReports: (filters: {
    searchTerm?: string;
    dateRange?: "all" | "last30" | "last90" | "last365";
    categories?: string[];
  }) => void;
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  reports: [],
  filteredReports: [],
  isLoading: false,
  error: null,
  selectedRecordType: "",

  fetchReports: async (recordType) => {
    const { user } = useProfileStore.getState();
    if (!user?.userid) return;

    set({ isLoading: true, error: null });

    try {
      const data = await getMedicalRecords(user.userid, recordType);
      const arrayData: RawMedicalRecord[] = Array.isArray(data) ? data : [];
      const normalized = normalizeToReports(arrayData, recordType, user.userid);

      set({
        reports: normalized,
        filteredReports: normalized,
        isLoading: false,
        selectedRecordType: recordType,
      });
    } catch (error) {
      set({
        error:
          "Failed to fetch reports" +
          (error instanceof Error ? `: ${error.message}` : ""),
        isLoading: false,
        reports: [],
        filteredReports: [],
      });
    }
  },

  fetchAllReports: async () => {
    const { user } = useProfileStore.getState();
    if (!user?.userid) return;

    set({ isLoading: true, error: null, selectedRecordType: "" });

    try {
      const data = await getAllMedicalRecords(user.userid);
      const arrayData: RawMedicalRecord[] = Array.isArray(data) ? data : [];
      const normalized = normalizeListToReports(arrayData, user.userid);

      set({
        reports: normalized,
        filteredReports: normalized,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          "Failed to fetch all reports" +
          (error instanceof Error ? `: ${error.message}` : ""),
        isLoading: false,
        reports: [],
        filteredReports: [],
      });
    }
  },

  filterReports: ({ searchTerm = "", dateRange = "all", categories = [] }) => {
    const { reports } = get();
    let filtered = [...reports];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.name.toLowerCase().includes(term) ||
          report.details?.some(
            (detail) =>
              detail.name.toLowerCase().includes(term) ||
              String(detail.value).toLowerCase().includes(term)
          )
      );
    }

    if (dateRange !== "all") {
      const now = new Date();
      const cutoffDate = new Date();
      if (dateRange === "last30") cutoffDate.setDate(now.getDate() - 30);
      if (dateRange === "last90") cutoffDate.setDate(now.getDate() - 90);
      if (dateRange === "last365") cutoffDate.setDate(now.getDate() - 365);

      filtered = filtered.filter((r) => new Date(r.date) >= cutoffDate);
    }

    if (categories.length > 0) {
      filtered = filtered.filter((r) => categories.includes(r.category));
    }

    set({ filteredReports: filtered });
  },
}));
