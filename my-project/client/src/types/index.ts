export type ReportStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";
export type Severity = "LOW" | "MEDIUM" | "HIGH";

export interface Category {
    id: number;
    name: string;
}

export interface Report {
    id: number;
    title: string;
    description: string;
    location: string;
    status: ReportStatus;
    severity: Severity;
    createdAt: string;
    category: Category;
    author: { id: number; name: string };
    voteCount: number;
}