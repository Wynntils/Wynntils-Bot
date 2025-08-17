import consola from 'consola'
import { client } from '..'
import { logReady } from '../utils/functions'

export const action = async (): Promise<void> => {

    consola.success(`Logged in as ${client.user?.tag}`)
    consola.info(`Server(s): ${client.guilds.cache.size}`)
    consola.info(`User(s): ${client.users.cache.size}`)
    logReady()

    consola.success('Ready!')
}
