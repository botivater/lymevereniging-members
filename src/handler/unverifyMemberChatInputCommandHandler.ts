import {
    CacheType,
    ChatInputCommandInteraction,
    italic,
    userMention,
} from "discord.js";
import { redis } from "../redis";

export const unverifyMemberChatInputCommandHandler = async (
    interaction: ChatInputCommandInteraction<CacheType>,
) => {
    await interaction.deferReply({ ephemeral: true });

    try {
        const user = interaction.options.getUser("user");

        if (!user) {
            throw new Error("Missing user in options");
        }

        await interaction.client.guilds.fetch(process.env.GUILD_ID);
        const guild = interaction.client.guilds.cache.get(process.env.GUILD_ID);

        if (!guild) {
            console.warn(`Guild not found with id ${process.env.GUILD_ID}`);
            return;
        }

        await guild.members.fetch(user.id);
        const guildMember = guild.members.cache.get(user.id);

        if (!guildMember) {
            throw new Error("Guild member could not be found");
        }

        await guildMember.roles.remove(guildMember.roles.cache);

        await guildMember.send({
            content: `Hey ${userMention(
                user.id,
            )}.\nWe hebben je meerdere keren proberen te contacteren dat je lidmaatschap verlopen is. Omdat je je lidmaatschap niet vernieuwd hebt, hebben we helaas je toegang tot de Lymevereniging Online Community moeten intrekken. Opnieuw lid worden van de Lymevereniging kan via https://lymevereniging.nl/lidmaatschap/, daarna kan je je opnieuw aanmelden voor de Lymevereniging Online Community.\nMisschien tot ziens!\n\nDenk je dat dit bericht een foutje is? Neem dan contact op met ons via deze link en dan helpen we je zo snel mogelijk verder: https://discord.com/channels/912355077333868574/991736663875268708/1040989251409547285\n\n${italic(
                "Dit is een automatisch bericht waarop niet gereageerd kan worden.",
            )}`,
        });

        await redis.del([
            `email-${user.id}`,
            `emailVerified-${user.id}`,
            `verificationCode-${user.id}`,
        ]);

        await interaction.editReply(
            "User has been unverified and got the message.",
        );
    } catch (err) {
        if (err instanceof Error) {
            await interaction.editReply(`An error occurred: ${err.message}`);
        } else {
            await interaction.editReply(`An unknown error occurred.`);
        }
    }
};
