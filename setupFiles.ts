import { afterAll } from 'vitest'
import { execSync } from 'child_process'

afterAll(() => {
  console.log('Todos os testes terminaram! Rodando comando final...')

  // Exemplo: rodar script do Prisma
  execSync('npx prisma migrate reset --force', { stdio: 'inherit' })
})
