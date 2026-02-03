import { EventEmitter } from 'events'

export class MockVoiceConnection extends EventEmitter {
  state: any
  joinConfig: any

  constructor(channelId: string, guildId: string) {
    super()
    this.joinConfig = {
      channelId,
      guildId,
    }
    this.state = {
      status: 'ready',
    }
  }

  destroy(): void {
    this.state.status = 'destroyed'
    this.emit('stateChange', { status: 'destroyed' })
  }

  setMaxListeners(n: number): this {
    return super.setMaxListeners(n)
  }
}

const connections = new Map<string, MockVoiceConnection>()

export const mockVoiceModule = {
  joinVoiceChannel: jest.fn((config: any) => {
    const connection = new MockVoiceConnection(config.channelId, config.guildId)
    connections.set(config.guildId, connection)
    return connection
  }),

  getVoiceConnection: jest.fn((guildId: string) => {
    return connections.get(guildId)
  }),

  getVoiceConnections: jest.fn(() => {
    return connections
  }),

  clearConnections: () => {
    connections.clear()
  },
}
