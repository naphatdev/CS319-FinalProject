import type { ReportStatus } from "../types";

const LABEL: Record<ReportStatus, string> = {
    PENDING: "รอดำเนินการ",
    IN_PROGRESS: "กำลังแก้ไข",
    RESOLVED: "แก้ไขแล้ว",
};

const COLOR: Record<ReportStatus, string> = {
    PENDING: "badge-warning",
    IN_PROGRESS: "badge-info",
    RESOLVED: "badge-success",
};

export default function StatusBadge({ status }: { status: ReportStatus }) {
    return <span className={`badge ${COLOR[status]}`}>{LABEL[status]}</span>;
}