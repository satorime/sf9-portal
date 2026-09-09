-- CreateEnum
CREATE TYPE "GradeLevel" AS ENUM ('GRADE_7', 'GRADE_8', 'GRADE_9', 'GRADE_10');

-- CreateEnum
CREATE TYPE "QuarterNumber" AS ENUM ('Q1', 'Q2', 'Q3', 'Q4');

-- CreateEnum
CREATE TYPE "ValuesRating" AS ENUM ('AO', 'SO', 'RO', 'NO');

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "logoUrl" TEXT,
    "principalName" TEXT,
    "schoolYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "lrn" VARCHAR(12) NOT NULL,
    "fullName" TEXT NOT NULL,
    "gradeLevel" "GradeLevel" NOT NULL,
    "section" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "passwordSetAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gradeLevel" "GradeLevel" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "quarter" "QuarterNumber" NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "quarter" "QuarterNumber" NOT NULL,
    "schoolDaysTotal" INTEGER NOT NULL,
    "daysPresent" INTEGER NOT NULL,
    "daysAbsent" INTEGER NOT NULL,
    "daysTardy" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValuesRatingEntry" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "coreValue" TEXT NOT NULL,
    "behaviorStatement" TEXT NOT NULL,
    "quarter" "QuarterNumber" NOT NULL,
    "rating" "ValuesRating" NOT NULL,

    CONSTRAINT "ValuesRatingEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Remark" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "quarter" "QuarterNumber",
    "text" TEXT NOT NULL,

    CONSTRAINT "Remark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Student_lrn_key" ON "Student"("lrn");

-- CreateIndex
CREATE INDEX "Student_section_gradeLevel_idx" ON "Student"("section", "gradeLevel");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_gradeLevel_key" ON "Subject"("name", "gradeLevel");

-- CreateIndex
CREATE INDEX "Grade_studentId_idx" ON "Grade"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_studentId_subjectId_quarter_key" ON "Grade"("studentId", "subjectId", "quarter");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_quarter_key" ON "Attendance"("studentId", "quarter");

-- CreateIndex
CREATE INDEX "ValuesRatingEntry_studentId_idx" ON "ValuesRatingEntry"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "ValuesRatingEntry_studentId_coreValue_behaviorStatement_qua_key" ON "ValuesRatingEntry"("studentId", "coreValue", "behaviorStatement", "quarter");

-- CreateIndex
CREATE INDEX "Remark_studentId_idx" ON "Remark"("studentId");

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValuesRatingEntry" ADD CONSTRAINT "ValuesRatingEntry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remark" ADD CONSTRAINT "Remark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
