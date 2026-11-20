import { useQuery } from "@tanstack/react-query";
import { getJson } from "./http";
import type { Report, ReportStatus } from "../types";

export interface ReportFilters {
  categoryId: number | null;
  status: ReportStatus | null;
}

export function useReports(filters: ReportFilters) {
  const params = new URLSearchParams();
  if (filters.categoryId !== null) params.set("categoryId", String(filters.categoryId));
  if (filters.status !== null) params.set("status", filters.status);
  const query = params.toString();

  return useQuery({
    queryKey: ["reports", filters],
    queryFn: () => getJson<Report[]>(query ? `/reports?${query}` : "/reports"),
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => getJson<Report>(`/reports/${id}`),
    enabled: id !== "",
  });
}