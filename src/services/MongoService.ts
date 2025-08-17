import { MongoClient, Db, Collection } from 'mongodb'

/**
 * Persist the client across hot-reloads in dev.
 */
declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: MongoClient | undefined
}

type MongoServiceOptions = {
  uri?: string
  defaultDb?: string
}

export class MongoService {
  private static _instance: MongoService | null = null
  private client: MongoClient
  private defaultDb: string
  private connecting: Promise<MongoClient> | null = null
  private connected = false

  private constructor({ uri, defaultDb }: MongoServiceOptions) {
    const finalUri = uri ?? process.env.TYPEORM_URL
    if (!finalUri) throw new Error('TYPEORM_URL is not set')

    if (!global.__mongoClient) {
      global.__mongoClient = new MongoClient(finalUri)
    }
    this.client = global.__mongoClient
    this.defaultDb = defaultDb ?? process.env.MONGODB_DB ?? 'Athena'
  }

  public static instance(opts: MongoServiceOptions = {}): MongoService {
    if (!this._instance) this._instance = new MongoService(opts)
    return this._instance
  }

  private async ensureConnected(): Promise<MongoClient> {
    if (this.connected) return this.client

    if (!this.connecting) {
      this.connecting = this.client.connect()
        .then((c) => {
          this.connected = true
          this.connecting = null
          return c
        })
        .catch((e) => {
          this.connecting = null
          this.connected = false
          throw e
        })
    }

    await this.connecting
    return this.client
  }

  /** Optional: quick health check */
  public async ping(): Promise<void> {
    const c = await this.ensureConnected()
    await c.db(this.defaultDb).command({ ping: 1 })
  }

  public async getDb(dbName?: string): Promise<Db> {
    await this.ensureConnected()
    return this.client.db(dbName ?? this.defaultDb)
  }

  public async getCollection<T = any>(name: string, dbName?: string): Promise<Collection<T>> {
    const db = await this.getDb(dbName)
    return db.collection<T>(name)
  }

  public async close(): Promise<void> {
    if (this.connecting) {
      try { await this.connecting } catch { /* ignore */ }
      this.connecting = null
    }
    try { await this.client.close() } catch { /* ignore */ }
    this.connected = false
    global.__mongoClient = undefined
    MongoService._instance = null
  }
}

export function registerMongoShutdown() {
  const shutdown = async () => {
    try { await MongoService.instance().close() }
    finally { process.exit(0) }
  }
  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)
}
