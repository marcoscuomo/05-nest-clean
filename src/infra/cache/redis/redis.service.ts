import { EnvService } from '@/infra/env/env.service'
import { OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

export class RefisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    super({
      host: envService.get('REDIS_HOST'),
      port: parseInt(envService.get('REDIS_PORT')),
      db: parseInt(envService.get('REDIS_DB')),
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}
