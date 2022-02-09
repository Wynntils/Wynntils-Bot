import consola from 'consola'
import { client } from '..'
import { createConnection } from 'typeorm'

export const action = async (): Promise<void> => {

    consola.success(`Logged in as ${client.user?.tag}`)
    consola.info(`Server(s): ${client.guilds.cache.size}`)
    consola.info(`User(s): ${client.users.cache.size}`)

    try {
        await createConnection()
        consola.success('Connected to database')
    } catch (e) {
        consola.error(e.message)
        consola.fatal('Unable to create database connection')
        process.exit(1)
    }

    consola.success('Ready!')
}
