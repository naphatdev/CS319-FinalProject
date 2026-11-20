import { Link } from "react-router";

export default function ReportListPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        รายการปัญหาชุมชน
      </h1>

      <p>หน้านี้จะแสดงรายงานจาก API ในขั้น P6</p>

      <Link to="/reports/1" className="btn btn-primary">
        ทดสอบเปิดรายละเอียดหมายเลข 1
      </Link>
    </div>
  );
}