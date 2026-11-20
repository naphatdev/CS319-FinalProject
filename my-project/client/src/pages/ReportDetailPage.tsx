import { Link, useParams } from "react-router";

export default function ReportDetailPage() {
  const { id } = useParams();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        รายละเอียดปัญหา
      </h1>

      <p>หมายเลขรายงาน: {id}</p>

      <Link to="/" className="btn btn-ghost">
        กลับหน้ารายการ
      </Link>
    </div>
  );
}