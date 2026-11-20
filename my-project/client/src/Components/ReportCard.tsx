import { Link } from "react-router";
import type { Report } from "../types";
import StatusBadge from "./StatusBadge";
import SeverityBadge from "./SeverityBadge";

export default function ReportCard({ report }: { report: Report }) {
    return (
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
                <div className="flex flex-wrap gap-2">
                    <span className="badge badge-outline">{report.category.name}</span>
                    <StatusBadge status={report.status} />
                    <SeverityBadge severity={report.severity} />
                </div>
                <h2 className="card-title">
                    <Link to={`/reports/${report.id}`} className="link-hover">{report.title}</Link>
                </h2>
                <p className="text-sm opacity-70">{report.location}</p>
                <div className="card-actions items-center justify-between">
                    <span className="text-sm">👍 {report.voteCount}</span>
                    {/* ขั้น M6 จะเพิ่มปุ่ม bookmark ตรงนี้ */}
                </div>
            </div>
        </div>
    );
}