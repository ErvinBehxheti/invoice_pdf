-- AlterTable
ALTER TABLE "User" ADD COLUMN "defaultPaymentLinkUrl" TEXT;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN "paymentLinkUrl" TEXT;
