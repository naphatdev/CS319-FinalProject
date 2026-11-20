export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Category {
  id: number
  name: string
  icon: string
}

export interface Report {
  id: number
  title: string
  description: string
  location: string
  status: ReportStatus
  severity: Severity
  imageUrl: string | null
  createdAt: string
  updatedAt: string
  categoryId: number
  authorId: number
  category: Category
  author: { id: number; name: string }
  _count: { votes: number }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: { total: number; page: number; pageSize: number; totalPages: number }
}

export interface Stats {
  total: number
  pending: number
  inProgress: number
  resolved: number
}

export type Role = 'USER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  role: Role
}

export interface AuthResponse {
  token: string
  user: User
}

export interface VoteResponse {
  voted: boolean
  votes: number
}

export interface ReportFilters {
  search: string
  status: ReportStatus | ''
  categoryId: number | null
  page: number
}
