import fetch from "node-fetch";
import { UserInfo } from "../interfaces/api/athena/UserInfo";

export class UserInfoService {
    async getUser(user: string) : Promise<UserInfo> {
        const response = await fetch('https://athena.wynntils.com/api/getUser/' + process.env.ATHENA_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                user
            })
        });
        const userInfo = (await response.json()) as UserInfo;
        return userInfo;
    }
}
