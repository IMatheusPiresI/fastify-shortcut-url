import { prisma } from '../../../lib/prisma'

export const resetDatabase = async () => {
  // Busca todas as tabelas do schema public
  const tables: Array<{ tablename: string }> = await prisma.$queryRaw`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname='public'
  `

  const tableNames = tables.map((t) => `"${t.tablename}"`).join(', ')

  if (tableNames.length > 0) {
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;
    `)
  }
}
