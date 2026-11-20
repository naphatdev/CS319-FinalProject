import type { Report } from "../types";

export const mockReports: Report[] = [
    {
        id: 1,
        title: "ไฟฟ้าดับทั้งซอย",
        description: "ไฟดับตั้งแต่ 2 ทุ่ม ยังไม่กลับมา",
        location: "ซอยรามคำแหง 24",
        status: "PENDING",
        severity: "HIGH",
        createdAt: "2026-11-20T13:00:00.000Z",
        category: { id: 1, name: "ไฟฟ้า" },
        author: { id: 2, name: "สมชาย" },
        voteCount: 12,
    },
    // เพิ่มเองอีก 2 รายการ: ถนนเป็นหลุม (IN_PROGRESS), ขยะไม่มีคนเก็บ (RESOLVED)
];