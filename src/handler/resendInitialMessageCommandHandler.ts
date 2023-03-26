import {
    ActionRowBuilder,
    ButtonBuilder,
    CacheType,
    ChatInputCommandInteraction,
} from "discord.js";
import { verificationButton } from "../button/verificationButton";

export const resendInitialMessageCommandHandler = async (
    interaction: ChatInputCommandInteraction<CacheType>
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

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            verificationButton
        );

        await guildMember.send({
            content: `Hallo! Lymevereniging Online Community is alleen beschikbaar voor leden van de Lymevereniging en hun huishouden.\nKlik op onderstaande knop en vul het email adres in dat gebruikt is bij het registreren van jouw Lymevereniging lidmaatschap. Na het verificatieproces krijg je toegang tot de gehele server.`,
            components: [actionRow],
        });

        await interaction.editReply("User has gotten the message.");
    } catch (err) {
        if (err instanceof Error) {
            await interaction.editReply(`An error occurred: ${err.message}`);
        } else {
            await interaction.editReply(`An unknown error occurred.`);
        }
    }
};
