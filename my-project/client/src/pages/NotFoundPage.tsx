import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>

      <p>ไม่พบหน้าที่คุณต้องการ</p>

      <Link to="/" className="btn btn-primary">
        กลับหน้าแรก
      </Link>
    </div>
  );
}