import consola from 'consola'
import { client } from '..'

export const action = (): void => {
    consola.success(`Logged in as ${client.user?.tag}`)
    consola.info(`Server(s): ${client.guilds.cache.size}`)
    consola.info(`User(s): ${client.users.cache.size}`)
    consola.success('Ready!')
}
