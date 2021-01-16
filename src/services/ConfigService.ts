export class ConfigService {
    async getAllConfigs(user: string): Promise<any> {
        return this.getConfig(user, "list");
    }

    async getConfig(user: string, configName: string): Promise<any> {
        const response = await fetch('https://athena.wynntils.com/api/getUserConfig/' + process.env.ATHENA_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                user, configName
            })
        });
        return response.json();
    }
}