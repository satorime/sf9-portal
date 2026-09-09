import "dotenv/config";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";

async function main() {
  // School and admin seeding are both optional once the corresponding record
  // already exists — env vars only need to be set for a true first-time bootstrap.
  const existingSchool = await prisma.school.findFirst({ orderBy: { createdAt: "asc" } });
  if (existingSchool) {
    console.log(`School already seeded: ${existingSchool.name}`);
  } else {
    const schoolName = process.env.SCHOOL_SEED_NAME;
    const schoolAddress = process.env.SCHOOL_SEED_ADDRESS;
    const schoolYear = process.env.SCHOOL_SEED_YEAR;

    if (!schoolName || !schoolAddress || !schoolYear) {
      console.log(
        "No school exists and SCHOOL_SEED_NAME/ADDRESS/YEAR are not set — skipping school seeding."
      );
    } else {
      const school = await prisma.school.create({
        data: { name: schoolName, address: schoolAddress, schoolYear },
      });
      console.log(`Created school: ${school.name}`);
    }
  }

  const anyAdminExists = (await prisma.admin.count()) > 0;
  if (anyAdminExists) {
    console.log("Admin account already exists, skipping admin seeding.");
  } else {
    const adminUsername = process.env.ADMIN_SEED_USERNAME;
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.log(
        "No admin account exists and ADMIN_SEED_USERNAME/ADMIN_SEED_PASSWORD are not set — skipping admin seeding."
      );
    } else {
      const passwordHash = await hashPassword(adminPassword);
      const admin = await prisma.admin.create({
        data: { username: adminUsername, passwordHash },
      });
      console.log(`Created admin: ${admin.username}`);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
