import { Pool, PoolClient, PoolConfig, QueryResult } from 'pg'

/**
 * Persist the pool across hot-reloads in dev.
 */
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined
}

type PostgresServiceOptions = {
  connectionString?: string
  poolOptions?: PoolConfig
}

export class PostgresService {
  private static _instance: PostgresService | null = null
  private pool: Pool

  private constructor({ connectionString, poolOptions }: PostgresServiceOptions = {}) {
    const finalConnectionString = connectionString ?? process.env.TYPEORM_URL
    if (!finalConnectionString) throw new Error('TYPEORM_URL is not set')

    if (!global.__pgPool) {
      global.__pgPool = new Pool({
        connectionString: finalConnectionString,
        ...(poolOptions ?? {}),
      })
    }

    this.pool = global.__pgPool
  }

  public static instance(opts: PostgresServiceOptions = {}): PostgresService {
    if (!this._instance) this._instance = new PostgresService(opts)
    return this._instance
  }

  public async query<T = any>(text: string, params: any[] = []): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params)
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect()
  }

  public async withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient()
    try {
      return await fn(client)
    } finally {
      client.release()
    }
  }

  public async close(): Promise<void> {
    try { await this.pool.end() } catch { /* ignore */ }
    global.__pgPool = undefined
    PostgresService._instance = null
  }
}

export function registerPostgresShutdown() {
  const shutdown = async () => {
    try { await PostgresService.instance().close() }
    finally { process.exit(0) }
  }
  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)
}
