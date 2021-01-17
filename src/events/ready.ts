import consola from "consola";
import { client } from "..";

export const action = () => {
    consola.info(`Server(s): ${client.guilds.cache.size}`);
    consola.info(`User(s): ${client.users.cache.size}`);
    consola.info('Ready!');
};
