import consola from 'consola'
import { client } from '..'
import { createConnection } from 'typeorm'
import { logReady } from '../utils/functions'

export const action = async (): Promise<void> => {

    consola.success(`Logged in as ${client.user?.tag}`)
    consola.info(`Server(s): ${client.guilds.cache.size}`)
    consola.info(`User(s): ${client.users.cache.size}`)
    logReady()
    try {
        await createConnection()
        consola.success('Connected to database')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        consola.error(e.message)
        consola.fatal('Unable to create database connection')
        process.exit(1)
    }

    consola.success('Ready!')
}
