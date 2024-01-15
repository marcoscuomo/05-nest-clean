import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/student-repository'
import { HasherGenerator } from '../cryptography/hasher-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-errors'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>
@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private hashGenerator: HasherGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentResponse> {
    const studentWithSameEmail = await this.studentRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.studentRepository.create(student)

    return right({
      student,
    })
  }
}
