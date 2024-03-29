import dotenv from "dotenv";
dotenv.config();

import {
    Client,
    Events,
    GatewayIntentBits,
    OAuth2Scopes,
    PermissionFlagsBits,
} from "discord.js";
import { guildMemberAddHandler } from "./eventHandler/guildMemberAddHandler";
import { interactionCreateHandler } from "./eventHandler/interactionCreateHandler";
import { cronMembershipHandler } from "./handler/cronMembershipHandler";
import { CronJob } from "cron";

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.on("guildMemberAdd", guildMemberAddHandler);
client.on("interactionCreate", interactionCreateHandler);

client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as "${c.user.tag}"`);
    console.log();
    console.log(
        `You can add me to a server using this URL: ${c.generateInvite({
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            permissions: [
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.ManageRoles,
            ],
        })}`,
    );
});

(async () => {
    await client.login(process.env.DISCORD_BOT_TOKEN);

    CronJob.from({
        cronTime: "0 0 12 * * 1",
        onTick: async () => {
            await cronMembershipHandler(client, {
                sendUnverifiedMessages: false,
            });
            console.info(
                `Membership cron job completed at ${new Date().toISOString()}`,
            );
        },
        start: true,
        timeZone: process.env.TZ,
    });
})();
