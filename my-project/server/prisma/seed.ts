import "dotenv/config";
import { PrismaClient, type ReportStatus, type Severity, type User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categoryNames = ["ไฟฟ้า", "ถนน", "น้ำท่วม", "ขยะ", "ไฟส่องสว่าง"];

const people = [
  { name: "สมชาย", email: "somchai@example.com" },
  { name: "สมหญิง", email: "somying@example.com" },
  { name: "มานะ", email: "mana@example.com" },
  { name: "มานี", email: "manee@example.com" },
  { name: "ปิติ", email: "piti@example.com" },
];

const problems = [
  { title: "ไฟฟ้าดับทั้งซอย", category: "ไฟฟ้า" },
  { title: "สายไฟห้อยต่ำ", category: "ไฟฟ้า" },
  { title: "ถนนเป็นหลุมลึก", category: "ถนน" },
  { title: "ฝาท่อระบายน้ำหาย", category: "ถนน" },
  { title: "น้ำท่วมขังหลังฝนตก", category: "น้ำท่วม" },
  { title: "ท่อระบายน้ำอุดตัน", category: "น้ำท่วม" },
  { title: "ขยะล้นถังไม่มีคนเก็บ", category: "ขยะ" },
  { title: "มีคนแอบทิ้งขยะริมทาง", category: "ขยะ" },
  { title: "ไฟถนนไม่ติด", category: "ไฟส่องสว่าง" },
  { title: "ไฟถนนกะพริบทั้งคืน", category: "ไฟส่องสว่าง" },
];

const places = ["ซอยรามคำแหง 24", "หน้าตลาดหัวหมาก", "ถนนลาดพร้าว 101"];

const statuses: ReportStatus[] = ["PENDING", "IN_PROGRESS", "RESOLVED"];
const severities: Severity[] = ["LOW", "MEDIUM", "HIGH"];

async function main() {
  // ลบข้อมูลเก่า เรียงจากตารางลูกไปตารางแม่
  await prisma.vote.deleteMany();
  await prisma.report.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("admin1234", 10);
  const userHash = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: { name: "ผู้ดูแลระบบ", email: "admin@example.com", passwordHash: adminHash, role: "ADMIN" },
  });

  const users: User[] = [];
  for (const p of people) {
    const user = await prisma.user.create({
      data: { name: p.name, email: p.email, passwordHash: userHash },
    });
    users.push(user);
  }

  const categoryIds = new Map<string, number>();
  for (const name of categoryNames) {
    const category = await prisma.category.create({ data: { name } });
    categoryIds.set(name, category.id);
  }

  let i = 0;
  for (const place of places) {
    for (const problem of problems) {
      const categoryId = categoryIds.get(problem.category);
      if (categoryId === undefined) {
        throw new Error(`ไม่พบหมวดหมู่ ${problem.category}`);
      }
      const author = users[i % users.length];

      const report = await prisma.report.create({
        data: {
          title: problem.title,
          description: `${problem.title} บริเวณ${place} รบกวนหน่วยงานที่เกี่ยวข้องเข้ามาตรวจสอบด้วยครับ`,
          location: place,
          status: statuses[i % statuses.length],
          severity: severities[(i + 1) % severities.length],
          authorId: author.id,
          categoryId,
        },
      });

      // ให้แต่ละรายงานมีจำนวนโหวตต่างกัน 0 ถึง 5
      const voters = users.slice(0, i % (users.length + 1));
      for (const voter of voters) {
        await prisma.vote.create({ data: { userId: voter.id, reportId: report.id } });
      }
      i++;
    }
  }

  const counts = {
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    reports: await prisma.report.count(),
    votes: await prisma.vote.count(),
  };
  console.log("Seed เสร็จแล้ว", counts);
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });