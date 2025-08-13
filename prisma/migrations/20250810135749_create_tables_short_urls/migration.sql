-- CreateTable
CREATE TABLE "public"."Url" (
    "id" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."short_urls" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlId" TEXT NOT NULL,

    CONSTRAINT "short_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_original_key" ON "public"."Url"("original");

-- CreateIndex
CREATE UNIQUE INDEX "short_urls_shortCode_key" ON "public"."short_urls"("shortCode");

-- AddForeignKey
ALTER TABLE "public"."short_urls" ADD CONSTRAINT "short_urls_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "public"."Url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
