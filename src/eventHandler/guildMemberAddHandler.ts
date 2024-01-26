import { ActionRowBuilder, ButtonBuilder, GuildMember } from "discord.js";
import { verificationButton } from "../button/verificationButton";

export const guildMemberAddHandler = async (member: GuildMember) => {
    await member.createDM();

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        verificationButton,
    );

    await member.dmChannel?.send({
        content: `Hallo! Lymevereniging Online Community is alleen beschikbaar voor leden van de Lymevereniging en hun huishouden.\nKlik op onderstaande knop en vul het email adres in dat gebruikt is bij het registreren van jouw Lymevereniging lidmaatschap. Na het verificatieproces krijg je toegang tot de gehele server.`,
        components: [actionRow],
    });
};
