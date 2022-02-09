import consola from 'consola'
import { Connection, createConnection, EntityManager } from 'typeorm'

export default class Database {
    private static instance = new Database()
    public static getInstance: () => Database = () => Database.instance

    private connection: Connection

    private constructor() {}

    private async getConnection(): Promise<Connection> {
        if (!this.connection)
            this.connection = await createConnection()

        return this.connection
    }

    async connect(): Promise<boolean> {
        try {
            await this.getConnection()
            return true
        } catch (e) {
            await consola.error(e)
            return false
        }
    }

    async getManager(): Promise<EntityManager> {
        return (await this.getConnection()).manager
    }
}
