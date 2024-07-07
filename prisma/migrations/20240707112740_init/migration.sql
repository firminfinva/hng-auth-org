/*
  Warnings:

  - You are about to drop the `_UserOrganisation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserOrganisation" DROP CONSTRAINT "_UserOrganisation_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserOrganisation" DROP CONSTRAINT "_UserOrganisation_B_fkey";

-- DropTable
DROP TABLE "_UserOrganisation";

-- CreateTable
CREATE TABLE "_UserOrganisations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserOrganisations_AB_unique" ON "_UserOrganisations"("A", "B");

-- CreateIndex
CREATE INDEX "_UserOrganisations_B_index" ON "_UserOrganisations"("B");

-- AddForeignKey
ALTER TABLE "_UserOrganisations" ADD CONSTRAINT "_UserOrganisations_A_fkey" FOREIGN KEY ("A") REFERENCES "organisation"("orgId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOrganisations" ADD CONSTRAINT "_UserOrganisations_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
