export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
            PWD: string;

            DISCORD_APPLICATION_ID: string;
            DISCORD_BOT_TOKEN: string;

            MEMBERSHIP_API_SECRET: string;

            GUILD_ID: string;
            GUILD_ROLE_ID: string;
            GUILD_CHANNEL_ID: string;

            MAIL_HOST: string;
            MAIL_PORT: string;
            MAIL_SECURE: string;
            MAIL_USERNAME: string;
            MAIL_PASSWORD: string;
            MAIL_FROM: string;

            API_OVERRIDE?: string;

            REDIS_HOST?: string;
            REDIS_PORT?: string;
            REDIS_DB?: string;
        }
    }
}
