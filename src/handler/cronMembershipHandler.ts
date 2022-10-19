import { Client, userMention } from "discord.js";
import {
    checkMembershipStatus,
    MembershipStatus,
} from "../api/checkMembershipStatus";
import { redis } from "../redis";

export const cronMembershipHandler = async (client: Client) => {
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

        const membershipStatus = await checkMembershipStatus(email);

        if (membershipStatus === MembershipStatus.INACTIVE) {
            await guildMember.roles.remove(guildRole);

            await client.users.send(userId, {
                content: `Hey ${userMention(
                    userId
                )}.\nWe hebben je meerdere keren proberen te contacteren dat je lidmaatschap verlopen is. Omdat je je lidmaatschap niet vernieuwd hebt, hebben we helaas je toegang tot de Lymevereniging Online Community moeten intrekken. Opnieuw lid worden van de Lymevereniging kan via https://lymevereniging.nl/lidmaatschap/, daarna kan je je opnieuw aanmelden voor de Lymevereniging Online Community.\nMisschien tot ziens!`,
            });

            await redis.del([
                `email-${userId}`,
                `emailVerified-${userId}`,
                `verificationCode-${userId}`,
            ]);
        }
    }
};
