import { useReports } from "../api/reports";
import { useFilterStore } from "../stores/filterStore";
import ReportCard from "../components/ReportCard";

export default function ReportListPage() {
  const categoryId = useFilterStore((s) => s.categoryId);
  const status = useFilterStore((s) => s.status);
  const { data, isPending, isError, error } = useReports({ categoryId, status });

  if (isPending) return <span className="loading loading-spinner loading-lg" />;
  if (isError) return <div role="alert" className="alert alert-error">{error.message}</div>;
  if (data.length === 0) return <p>ยังไม่มีรายงาน</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}