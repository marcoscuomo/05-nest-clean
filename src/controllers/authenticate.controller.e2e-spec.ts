import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    // Forma de subir a aplicação apenas para teste
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST] /sessions', async () => {
    const userEmail = 'johndoe@example.com'
    const userPassword = '123456'

    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: userEmail,
        password: await hash(userPassword, 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: userEmail,
      password: userPassword,
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
