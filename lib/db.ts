import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
  })
}

const prisma = global.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export { prisma } 