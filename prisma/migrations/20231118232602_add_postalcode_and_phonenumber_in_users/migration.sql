/*
  Warnings:

  - Added the required column `cep` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "telefone" TEXT NOT NULL;
