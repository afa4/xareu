import { EventEmitter } from 'events'

export class MockVoiceChannel extends EventEmitter {
  id: string
  name: string
  guild: any
  members: Map<string, any> & {
    filter: (predicate: (member: any) => boolean) => Map<string, any>
  }

  constructor(id: string, name: string, guild: any) {
    super()
    this.id = id
    this.name = name
    this.guild = guild
    const membersMap = new Map() as any
    membersMap.filter = function(predicate: (member: any) => boolean) {
      const filtered = new Map()
      for (const [key, value] of membersMap.entries()) {
        if (predicate(value)) {
          filtered.set(key, value)
        }
      }
      return filtered
    }
    this.members = membersMap
  }

  isVoiceBased(): boolean {
    return true
  }
}

export class MockGuildMember {
  user: any
  voice: {
    channel: MockVoiceChannel | null
  }

  constructor(userId: string, userName: string, isBot = false) {
    this.user = {
      id: userId,
      tag: userName,
      bot: isBot,
    }
    this.voice = {
      channel: null,
    }
  }
}

export class MockGuild {
  id: string
  name: string
  channels: {
    cache: Map<string, MockVoiceChannel> & {
      find: (predicate: (channel: MockVoiceChannel) => boolean) => MockVoiceChannel | undefined
    }
  }
  members: {
    cache: Map<string, MockGuildMember>
  }
  voiceAdapterCreator: any

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
    const channelCache = new Map() as any
    channelCache.find = function(predicate: (channel: MockVoiceChannel) => boolean) {
      for (const channel of channelCache.values()) {
        if (predicate(channel)) {
          return channel
        }
      }
      return undefined
    }
    this.channels = {
      cache: channelCache,
    }
    this.members = {
      cache: new Map(),
    }
    this.voiceAdapterCreator = jest.fn()
  }

  addChannel(channel: MockVoiceChannel): void {
    this.channels.cache.set(channel.id, channel)
  }

  addMember(member: MockGuildMember): void {
    this.members.cache.set(member.user.id, member)
  }
}

export class MockClient extends EventEmitter {
  user: {
    id: string
    tag: string
  }
  guilds: {
    cache: Map<string, MockGuild>
  }

  constructor() {
    super()
    this.user = {
      id: 'bot-id',
      tag: 'Xaréu#6607',
    }
    this.guilds = {
      cache: new Map(),
    }
  }

  addGuild(guild: MockGuild): void {
    this.guilds.cache.set(guild.id, guild)
  }
}

export class MockVoiceState {
  member: MockGuildMember
  guild: MockGuild
  channel: MockVoiceChannel | null
  channelId: string | null

  constructor(member: MockGuildMember, guild: MockGuild, channel: MockVoiceChannel | null) {
    this.member = member
    this.guild = guild
    this.channel = channel
    this.channelId = channel?.id || null
  }
}

export function createTestSetup() {
  const client = new MockClient()
  const guild = new MockGuild('guild-1', 'Test Server')

  const casinhaChannel = new MockVoiceChannel('casinha-id', 'Casinha do Xeréu', guild)
  const channel1 = new MockVoiceChannel('channel-1', 'Jerf', guild)
  const channel2 = new MockVoiceChannel('channel-2', 'Murilo', guild)

  guild.addChannel(casinhaChannel)
  guild.addChannel(channel1)
  guild.addChannel(channel2)

  const botMember = new MockGuildMember('bot-id', 'Xaréu#6607', true)
  const user1 = new MockGuildMember('user-1', 'jerfersongriza', false)
  const user2 = new MockGuildMember('user-2', 'josuealessandro', false)
  const user3 = new MockGuildMember('user-3', 'murilosantos', false)

  guild.addMember(botMember)
  guild.addMember(user1)
  guild.addMember(user2)
  guild.addMember(user3)

  client.addGuild(guild)

  return {
    client,
    guild,
    channels: { casinhaChannel, channel1, channel2 },
    members: { botMember, user1, user2, user3 },
  }
}
