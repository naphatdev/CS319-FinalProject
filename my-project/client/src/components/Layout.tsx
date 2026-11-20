import { Link, Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="min-h-screen bg-base-200">
      <nav className="navbar bg-base-100 shadow-sm">
        <Link to="/" className="btn btn-ghost text-xl">แจ้งปัญหาชุมชน</Link>
        <div className="ml-auto flex gap-2">
          <Link to="/bookmarks" className="btn btn-ghost btn-sm">Bookmarks</Link>
          <Link to="/reports/new" className="btn btn-primary btn-sm">แจ้งปัญหา</Link>
          <Link to="/login" className="btn btn-ghost btn-sm">เข้าสู่ระบบ</Link>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}