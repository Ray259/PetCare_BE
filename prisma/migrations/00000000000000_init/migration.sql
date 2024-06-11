-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');
CREATE TYPE "Gender" AS ENUM ('male', 'female');
CREATE TYPE "Status" AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',
    "avatar" TEXT,
    "gender" "Gender" NOT NULL,
    "refreshToken" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "breed" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "disease" TEXT,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Pet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ServiceDetails" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ServiceDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthcareService" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "serviceTypeId" TEXT NOT NULL,
    "description" TEXT,
    "temperature" FLOAT,
    "heartRate" INTEGER,
    "respiratoryRate" INTEGER,
    "weight" FLOAT,
    "bodyCondition" TEXT,
    "symptoms" TEXT,
    "bloodTest" TEXT,
    "urineTest" TEXT,
    "xRay" TEXT,
    "diagnosis" TEXT,
    "diet" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "medicine" TEXT[],
    "additionalInfo" JSONB,
    "isApproved" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" DEFAULT 'pending',
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "HealthcareService_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "HealthcareService_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HealthcareService_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "ServiceDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GroomingService" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "serviceTypeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "additionalInfo" JSONB,
    "isApproved" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" DEFAULT 'pending',
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "GroomingService_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "GroomingService_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GroomingService_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "ServiceDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BoardingService" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "serviceTypeId" TEXT NOT NULL,
    "cage" INTEGER,
    "address" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "additionalInfo" JSONB,
    "isApproved" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" DEFAULT 'pending',
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "BoardingService_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BoardingService_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BoardingService_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "ServiceDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Appointments" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "serviceTypeId" TEXT NOT NULL,
    "doctor" TEXT,
    "description" TEXT,
    "followUp" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL,
    "additionalInfo" JSONB,
    "isApproved" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" DEFAULT 'pending',
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Appointments_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Appointments_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "ServiceDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "additionalInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
