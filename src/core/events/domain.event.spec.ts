import { vi } from 'vitest'
import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  // eslint-disable-next-line no-use-before-define
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain events ', () => {
  it('should be able to dispatch and listen to events ', () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado (ouvindo o evento de "resposta criado")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Estou criando uma resposta porém sem salvar no banco
    const aggregate = CustomAggregate.create()

    // Estou assegurando que o evento fpi criado porém Não foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Estou salvado a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
