import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { HasherGenerator } from '@/domain/forum/application/cryptography/hasher-generator'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'

import { BcrypterHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'
@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcrypterHasher },
    { provide: HasherGenerator, useClass: BcrypterHasher },
  ],
  exports: [Encrypter, HashComparer, HasherGenerator],
})
export class CryptographyModule {}
