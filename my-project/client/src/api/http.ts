export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`);
  if (!res.ok) {
    throw new Error(`โหลดข้อมูลไม่สำเร็จ (${res.status})`);
  }
  return (await res.json()) as T;
}