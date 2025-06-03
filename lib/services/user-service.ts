import { prisma } from '../db'

export type CreateUserData = {
  email: string
  name?: string
}

export type UpdateUserData = {
  name?: string
  vocabularyProgress?: any
  quizResults?: any
  settings?: any
}

export const userService = {
  async createUser(data: CreateUserData) {
    return prisma.user.create({
      data
    })
  },

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  async updateUser(id: string, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data
    })
  },

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id }
    })
  }
} 