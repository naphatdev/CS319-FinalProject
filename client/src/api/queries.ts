import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { http } from './http'
import { useAuthStore } from '../stores/authStore'
import type {
  AuthResponse,
  Category,
  PaginatedResponse,
  Report,
  ReportFilters,
  ReportStatus,
  Severity,
  Stats,
  User,
  VoteResponse,
} from '../types'

export const PAGE_SIZE = 9

export const queryKeys = {
  reports: (filters: ReportFilters) => ['reports', filters] as const,
  report: (id: number) => ['reports', 'detail', id] as const,
  categories: ['categories'] as const,
  stats: ['stats'] as const,
  me: ['me'] as const,
  myVotes: ['myVotes'] as const,
}

function buildQuery(filters: ReportFilters, pageSize: number): string {
  const params = new URLSearchParams({ page: String(filters.page), pageSize: String(pageSize) })
  if (filters.search) params.set('search', filters.search)
  if (filters.status) params.set('status', filters.status)
  if (filters.categoryId) params.set('categoryId', String(filters.categoryId))
  return params.toString()
}

export function useReports(
  filters: ReportFilters,
  pageSize: number = PAGE_SIZE,
): UseQueryResult<PaginatedResponse<Report>> {
  return useQuery({
    queryKey: [...queryKeys.reports(filters), pageSize],
    queryFn: () => http<PaginatedResponse<Report>>(`/reports?${buildQuery(filters, pageSize)}`),
    placeholderData: keepPreviousData,
  })
}

export function useReport(id: number): UseQueryResult<Report> {
  return useQuery({
    queryKey: queryKeys.report(id),
    queryFn: () => http<Report>(`/reports/${id}`),
    enabled: Number.isFinite(id),
  })
}

export function useCategories(): UseQueryResult<Category[]> {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => http<Category[]>('/categories'),
    staleTime: 1000 * 60 * 30,
  })
}

export function useStats(): UseQueryResult<Stats> {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => http<Stats>('/stats'),
  })
}

// ---- auth ----

export function useMe(): UseQueryResult<User> {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: [...queryKeys.me, token],
    queryFn: () => http<User>('/auth/me'),
    enabled: token !== null,
    retry: false,
  })
}

interface Credentials {
  email: string
  password: string
  name?: string
}

export function useAuth(mode: 'login' | 'register'): UseMutationResult<AuthResponse, Error, Credentials> {
  const setToken = useAuthStore((s) => s.setToken)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Credentials) => http<AuthResponse>(`/auth/${mode}`, { method: 'POST', body }),
    onSuccess: (res) => {
      setToken(res.token)
      qc.setQueryData([...queryKeys.me, res.token], res.user)
      void qc.invalidateQueries({ queryKey: queryKeys.myVotes })
    },
  })
}

// ---- votes ----

export function useMyVotes(): UseQueryResult<number[]> {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: [...queryKeys.myVotes, token],
    queryFn: () => http<number[]>('/me/votes'),
    enabled: token !== null,
  })
}

export function useToggleVote(): UseMutationResult<VoteResponse, Error, number> {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (reportId: number) => http<VoteResponse>(`/reports/${reportId}/vote`, { method: 'POST' }),
    onSuccess: () => {
      // zero-refresh: refetch every list/detail that shows vote counts
      void qc.invalidateQueries({ queryKey: ['reports'] })
      void qc.invalidateQueries({ queryKey: queryKeys.myVotes })
    },
  })
}

export interface NewReportInput {
  title: string
  description: string
  location: string
  severity: Severity
  categoryId: number
}

export function useCreateReport(): UseMutationResult<Report, Error, NewReportInput> {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: NewReportInput) => http<Report>('/reports', { method: 'POST', body }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['reports'] })
      void qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

// ---- admin ----

export function useUpdateReportStatus(): UseMutationResult<Report, Error, { id: number; status: ReportStatus }> {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => http<Report>(`/reports/${id}`, { method: 'PUT', body: { status } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['reports'] })
      void qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export function useDeleteReport(): UseMutationResult<void, Error, number> {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => http<void>(`/reports/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['reports'] })
      void qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}
