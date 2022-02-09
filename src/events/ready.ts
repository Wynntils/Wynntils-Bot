import consola from 'consola'
import { client } from '..'
import Database from '../utils/managers/Database'

export const action = async (): Promise<void> => {

    // if(await Database.getInstance().connect()) {
    //     consola.success("Succesfully connected to the database")
    // } else {
    //     consola.error("Failed to connect to the database")
    //     process.exit(1)
    // }

    consola.success(`Logged in as ${client.user?.tag}`)
    consola.info(`Server(s): ${client.guilds.cache.size}`)
    consola.info(`User(s): ${client.users.cache.size}`)
    consola.success('Ready!')
}
