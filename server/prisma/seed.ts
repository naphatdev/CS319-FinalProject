import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import type { ReportStatus, Severity } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedReport {
  title: string;
  location: string;
  detail: string;
  severity: Severity;
}

const categories = [
  { name: 'ไฟฟ้า', icon: '💡' },
  { name: 'ถนนและทางเท้า', icon: '🛣️' },
  { name: 'น้ำท่วมและน้ำประปา', icon: '💧' },
  { name: 'ขยะและสิ่งแวดล้อม', icon: '🗑️' },
  { name: 'ความปลอดภัย', icon: '🚨' },
  { name: 'สาธารณสุข', icon: '🏥' },
] as const;

const users = [
  { name: 'สมชาย ใจดี', email: 'somchai@example.com' },
  { name: 'สมหญิง รักชุมชน', email: 'somying@example.com' },
  { name: 'วิชัย พัฒนา', email: 'wichai@example.com' },
  { name: 'มานี มีสุข', email: 'manee@example.com' },
  { name: 'ประเสริฐ สุขใจ', email: 'prasert@example.com' },
];

// index = category order above
const reportsByCategory: SeedReport[][] = [
  [
    { title: 'ไฟถนนดับหลายดวง', location: 'ซอยลาดพร้าว 71', detail: 'ไฟถนนดับต่อเนื่องกว่า 1 สัปดาห์ ทางมืดมาก', severity: 'HIGH' },
    { title: 'สายไฟห้อยต่ำเกือบถึงพื้น', location: 'ถนนสุขุมวิท 101', detail: 'สายไฟหย่อนลงมาเสี่ยงอันตรายต่อคนเดินเท้า', severity: 'HIGH' },
    { title: 'หม้อแปลงมีเสียงดังผิดปกติ', location: 'หมู่บ้านสุขสันต์', detail: 'มีเสียงดังและมีกลิ่นไหม้เป็นระยะ', severity: 'HIGH' },
    { title: 'ไฟฟ้าดับบ่อยช่วงเย็น', location: 'ตลาดนัดบางกะปิ', detail: 'ไฟตกและดับเกือบทุกวันช่วง 17.00-19.00 น.', severity: 'MEDIUM' },
    { title: 'เสาไฟเอียงเสี่ยงล้ม', location: 'ถนนรามคำแหง 24', detail: 'เสาไฟเอียงหลังฝนตกหนัก ใกล้โรงเรียน', severity: 'HIGH' },
    { title: 'ไฟทางเดินในสวนสาธารณะเสีย', location: 'สวนสาธารณะหนองบอน', detail: 'ไฟทางเดินดับ ผู้ออกกำลังกายตอนเย็นไม่ปลอดภัย', severity: 'LOW' },
    { title: 'ตู้ไฟฟ้าสาธารณะเปิดค้าง', location: 'ซอยพัฒนาการ 20', detail: 'ฝาตู้ไฟเปิดค้าง เด็กเล่นแถวนั้นเสี่ยงไฟดูด', severity: 'MEDIUM' },
  ],
  [
    { title: 'ถนนเป็นหลุมขนาดใหญ่', location: 'ถนนบางนา-ตราด กม.5', detail: 'หลุมลึกประมาณ 30 ซม. มอเตอร์ไซค์ล้มบ่อย', severity: 'HIGH' },
    { title: 'ทางเท้าแตกชำรุด', location: 'หน้าตลาดสดมีนบุรี', detail: 'กระเบื้องทางเท้าแตก ผู้สูงอายุสะดุดล้ม', severity: 'MEDIUM' },
    { title: 'ฝาท่อระบายน้ำหาย', location: 'ซอยอ่อนนุช 17', detail: 'ฝาท่อหายไปหลายจุด เสี่ยงตกท่อ', severity: 'HIGH' },
    { title: 'ไม่มีทางม้าลายหน้าโรงเรียน', location: 'โรงเรียนวัดบางนา', detail: 'เด็กข้ามถนนลำบาก รถวิ่งเร็ว', severity: 'HIGH' },
    { title: 'ถนนทรุดตัวหลังฝนตก', location: 'ถนนเลียบคลองสอง', detail: 'พื้นถนนทรุดเป็นแอ่ง รถเล็กผ่านลำบาก', severity: 'MEDIUM' },
    { title: 'ป้ายจราจรล้มทับทางเท้า', location: 'สี่แยกบางกะปิ', detail: 'ป้ายล้มขวางทางเท้ามาหลายวัน', severity: 'LOW' },
    { title: 'สะพานลอยบันไดชำรุด', location: 'สะพานลอยหน้าห้างเดอะมอลล์', detail: 'ขั้นบันไดแตก ราวจับหลวม', severity: 'MEDIUM' },
  ],
  [
    { title: 'น้ำท่วมขังหลังฝนตกนาน', location: 'ซอยเพชรเกษม 48', detail: 'น้ำท่วมสูง 40 ซม. ไม่ระบายภายในหลายชั่วโมง', severity: 'HIGH' },
    { title: 'ท่อประปาแตกน้ำพุ่ง', location: 'ถนนศรีนครินทร์ 12', detail: 'ท่อประปาแตก น้ำไหลนองถนนตั้งแต่เช้า', severity: 'HIGH' },
    { title: 'น้ำประปาขุ่นและมีกลิ่น', location: 'หมู่บ้านพฤกษา 3', detail: 'น้ำมีสีขุ่นเหลือง ไม่สามารถใช้ดื่มได้', severity: 'MEDIUM' },
    { title: 'คลองตื้นเขินน้ำไม่ไหล', location: 'คลองแสนแสบ ช่วงมีนบุรี', detail: 'มีตะกอนและผักตบชวาเต็มคลอง น้ำระบายช้า', severity: 'MEDIUM' },
    { title: 'น้ำประปาไม่ไหลทั้งซอย', location: 'ซอยรัชดา 36', detail: 'ไม่มีน้ำประปามา 2 วันแล้ว', severity: 'HIGH' },
    { title: 'ท่อระบายน้ำอุดตัน', location: 'ตลาดบางแค', detail: 'ท่อตันจากขยะและคราบมัน น้ำเน่าเหม็น', severity: 'MEDIUM' },
    { title: 'น้ำรั่วจากมิเตอร์น้ำ', location: 'ซอยสุทธิสาร 5', detail: 'มิเตอร์น้ำรั่วซึมตลอดเวลา สิ้นเปลืองน้ำ', severity: 'LOW' },
  ],
  [
    { title: 'กองขยะสะสมริมถนน', location: 'ซอยสวนผัก 2', detail: 'ขยะไม่ได้เก็บมา 1 สัปดาห์ กลิ่นเหม็นมาก', severity: 'MEDIUM' },
    { title: 'ถังขยะสาธารณะเต็มล้น', location: 'ตลาดนัดจตุจักร', detail: 'ถังขยะล้น มีแมลงวันและหนู', severity: 'MEDIUM' },
    { title: 'เผาขยะในที่โล่ง', location: 'ที่ดินว่างข้างวัดบางเขน', detail: 'มีการเผาขยะทุกเย็น ควันรบกวนชุมชน', severity: 'MEDIUM' },
    { title: 'ทิ้งขยะลงคลอง', location: 'คลองลาดพร้าว', detail: 'มีคนทิ้งขยะและถุงพลาสติกลงคลองเป็นประจำ', severity: 'HIGH' },
    { title: 'ต้นไม้ใหญ่กิ่งหักขวางทาง', location: 'ถนนพหลโยธิน 52', detail: 'กิ่งไม้หักหลังพายุ ขวางช่องจราจร', severity: 'MEDIUM' },
    { title: 'เสียงดังจากโรงงานรบกวนชุมชน', location: 'ซอยนิคมอุตสาหกรรมบางชัน', detail: 'โรงงานเปิดเครื่องจักรดังตลอดคืน', severity: 'LOW' },
    { title: 'ที่ทิ้งขยะอันตรายไม่มี', location: 'หมู่บ้านเมืองเอก', detail: 'ไม่มีจุดทิ้งแบตเตอรี่และหลอดไฟเก่าในชุมชน', severity: 'LOW' },
  ],
  [
    { title: 'สุนัขจรจัดจำนวนมาก', location: 'ซอยแจ้งวัฒนะ 14', detail: 'สุนัขจรจัดรวมฝูง เคยมีเด็กถูกกัด', severity: 'HIGH' },
    { title: 'กล้องวงจรปิดชำรุด', location: 'ป้อมยามหน้าหมู่บ้านสุขใจ', detail: 'กล้องใช้งานไม่ได้ เกิดเหตุขโมยหลายครั้ง', severity: 'MEDIUM' },
    { title: 'ซอยเปลี่ยวไม่มีไฟส่องสว่าง', location: 'ซอยบางบอน 5', detail: 'ซอยมืด เสี่ยงต่อการถูกทำร้ายตอนกลางคืน', severity: 'HIGH' },
    { title: 'รถจอดขวางทางเข้าออกบ้าน', location: 'ซอยงามวงศ์วาน 25', detail: 'มีรถจอดกีดขวางทางเข้าออกเป็นประจำ', severity: 'LOW' },
    { title: 'แก๊งวัยรุ่นแข่งรถยามดึก', location: 'ถนนวงแหวนรอบนอก', detail: 'เสียงดังและอันตรายต่อผู้ใช้ถนน', severity: 'HIGH' },
    { title: 'ทางข้ามรถไฟไม่มีเครื่องกั้น', location: 'ทางข้ามรถไฟบางซื่อ', detail: 'ไม่มีไม้กั้นและสัญญาณเตือนรถไฟ', severity: 'HIGH' },
  ],
  [
    { title: 'น้ำขังเป็นแหล่งเพาะลูกน้ำยุงลาย', location: 'ซอยประชาอุทิศ 45', detail: 'พบลูกน้ำจำนวนมาก มีผู้ป่วยไข้เลือดออกในซอย', severity: 'HIGH' },
    { title: 'ศูนย์สาธารณสุขชุมชนขาดแคลนยา', location: 'ศูนย์สุขภาพชุมชนบางพลัด', detail: 'ยาพื้นฐานหมดบ่อย ผู้สูงอายุต้องเดินทางไกล', severity: 'MEDIUM' },
    { title: 'ตลาดสดสุขอนามัยไม่ดี', location: 'ตลาดสดคลองเตย', detail: 'พื้นเปียกแฉะ เศษอาหารตกค้างและมีกลิ่นเหม็น', severity: 'MEDIUM' },
    { title: 'ขาดรถพยาบาลฉุกเฉินในพื้นที่', location: 'ตำบลบางเสาธง', detail: 'รถพยาบาลมาถึงช้า ต้องรอเกิน 30 นาที', severity: 'HIGH' },
    { title: 'ร้านอาหารไม่มีที่กำจัดน้ำมันใช้แล้ว', location: 'ถนนข้าวสาร', detail: 'เทน้ำมันลงท่อระบายน้ำ ทำให้ท่ออุดตัน', severity: 'LOW' },
    { title: 'ห้องน้ำสาธารณะสกปรกและชำรุด', location: 'สวนสาธารณะลุมพินี', detail: 'ห้องน้ำไม่มีน้ำ ประตูเสีย ไม่ปลอดภัย', severity: 'MEDIUM' },
  ],
];

const statuses: ReportStatus[] = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];

async function main(): Promise<void> {
  await prisma.vote.deleteMany();
  await prisma.report.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const userHash = await bcrypt.hash('password123', 10);
  const adminHash = await bcrypt.hash('admin1234', 10);
  await prisma.user.create({
    data: { name: 'ผู้ดูแลระบบ', email: 'admin@example.com', passwordHash: adminHash, role: 'ADMIN' },
  });
  const createdUsers = await Promise.all(
    users.map((u) => prisma.user.create({ data: { ...u, passwordHash: userHash } })),
  );
  const createdCategories = await Promise.all(
    categories.map((data) => prisma.category.create({ data })),
  );

  let n = 0;
  for (const [catIndex, list] of reportsByCategory.entries()) {
    const category = createdCategories[catIndex];
    if (!category) continue;
    for (const item of list) {
      const author = createdUsers[n % createdUsers.length];
      if (!author) continue;
      const report = await prisma.report.create({
        data: {
          title: item.title,
          description: item.detail,
          location: item.location,
          severity: item.severity,
          status: statuses[n % statuses.length] ?? 'PENDING',
          categoryId: category.id,
          authorId: author.id,
          createdAt: new Date(Date.now() - n * 36 * 60 * 60 * 1000),
        },
      });
      // each report gets 0-4 distinct votes (respects @@unique([userId, reportId]))
      const voters = createdUsers.slice(0, n % 5);
      if (voters.length > 0) {
        await prisma.vote.createMany({
          data: voters.map((u) => ({ userId: u.id, reportId: report.id })),
        });
      }
      n++;
    }
  }
  console.log(`Seeded ${createdUsers.length} users, ${createdCategories.length} categories, ${n} reports`);
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
