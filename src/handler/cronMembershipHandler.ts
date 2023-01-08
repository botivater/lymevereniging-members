import { Client, roleMention, userMention } from "discord.js";
import {
    checkMembershipStatus,
    MembershipStatus,
} from "../api/checkMembershipStatus";
import { redis } from "../redis";

export interface CronMembershipHandlerOptions {
    sendUnverifiedMessages: boolean;
}

export const cronMembershipHandler = async (
    client: Client,
    options: CronMembershipHandlerOptions = {
        sendUnverifiedMessages: false,
    }
) => {
    const userIdKeys = await redis.keys("emailVerified-*");
    const userIds = userIdKeys.map((userIdKey) =>
        userIdKey.replace("emailVerified-", "")
    );

    await client.guilds.fetch(process.env.GUILD_ID);
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    if (!guild) {
        console.warn(`Guild not found with id ${process.env.GUILD_ID}`);
        return;
    }

    await guild.channels.fetch(process.env.GUILD_CHANNEL_ID);
    const channel = guild.channels.cache.get(process.env.GUILD_CHANNEL_ID);

    if (!channel) {
        console.warn(
            "Oeps, er is intern iets fout gegaan. Probeer het opnieuw."
        );

        return;
    }

    if (!channel.isTextBased()) {
        console.warn(
            "Oeps, er is intern iets fout gegaan. Probeer het opnieuw."
        );

        return;
    }

    await guild.roles.fetch(process.env.GUILD_ROLE_ID);
    const guildRole = guild.roles.cache.get(process.env.GUILD_ROLE_ID);

    if (!guildRole) {
        console.warn(
            `Guild role not found with id ${process.env.GUILD_ROLE_ID}`
        );
        return;
    }

    await guild.members.fetch();

    for (const userId of userIds) {
        const emailVerified = parseInt(
            (await redis.get(`emailVerified-${userId}`)) || "0"
        );

        if (emailVerified === 0) {
            console.warn(`Email not verified for user ${userId}`);

            if (options.sendUnverifiedMessages) {
                await channel.send(
                    `${userMention(
                        userId
                    )} heeft het email adres waarmee ze bij de Lymevereniging bekend staan nog niet geverifieerd.\nProbeer actie te ondernemen via <#1037685006023278653>`
                );
            }

            continue;
        }

        const email = await redis.get(`email-${userId}`);

        if (!email) {
            console.warn(`Email address missing for user id ${userId}`);
            continue;
        }

        const guildMember = guild.members.cache.get(userId);

        if (!guildMember) {
            console.warn(`Guild member not found for user id ${userId}`);
            continue;
        }

        if (!guildMember.roles.cache.has(guildRole.id)) {
            console.warn(
                `Guild member does not have role for user id ${userId}`
            );
            continue;
        }

        const membershipStatus = await checkMembershipStatus(email);

        if (membershipStatus === MembershipStatus.INACTIVE) {
            console.info(`User id ${userId} has become inactive`);

            await channel.send(
                `Hey ${roleMention("912362493555400734")}, ${userMention(
                    userId
                )} heeft het lidmaatschap niet verlengd volgens de Lymevereniging ledenlijst.\n\nKlopt dit? Gebruik dan /unverify-member om deze persoon definitief te verwijderen.\nKlopt dit niet? (bijvoorbeeld 100 mensen zouden tegelijk niet meer actief zijn) Meld dit dan zo snel mogelijk!`
            );
        }
    }
};
