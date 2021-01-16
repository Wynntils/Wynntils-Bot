import { CosmeticInfo } from "./CosmeticInfo";
import { DiscordInfo } from "./DiscordInfo";
import { VersionInfo } from "./VersionInfo";

export interface UserInfo {
    uuid: string;
    username: string;
    accountType: string;
    
    versions: VersionInfo;
    discord: DiscordInfo;
    cosmetics: CosmeticInfo;
}