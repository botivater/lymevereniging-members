import { CacheType, ModalSubmitInteraction } from "discord.js";
import { CodeVerificationModalCodeInputID } from "../modal/codeVerificationModal";
import * as yup from "yup";
import { redis } from "../redis";

export const codeVerificationModalSubmitHandler = async (
    interaction: ModalSubmitInteraction<CacheType>
) => {
    await interaction.deferReply();

    try {
        const codeInput = interaction.fields
            .getTextInputValue(CodeVerificationModalCodeInputID)
            .trim()
            .replaceAll(" ", "");

        const validationSchema = yup.string().max(8).min(8).required();
        const isValid = await validationSchema.isValid(codeInput);

        if (!isValid) {
            await interaction.editReply({
                content: "Oeps, dat is geen geldige code. Probeer het opnieuw.",
            });

            return;
        }

        const verificationCode = await redis.get(
            `verificationCode-${interaction.user.id}`
        );

        if (!verificationCode) {
            await interaction.editReply({
                content: "Oeps, er is geen code gelinkt aan dit account. Probeer het opnieuw.",
            });

            return;
        }

        if (verificationCode !== codeInput) {
            await interaction.editReply({
                content: "Oeps, dat is geen geldige code. Probeer het opnieuw.",
            });

            return;
        }

        await interaction.client.guilds.fetch();
        const guild = interaction.client.guilds.cache.get(process.env.GUILD_ID);

        if (!guild) {
            await interaction.editReply({
                content:
                    "Oeps, er is intern iets fout gegaan. Probeer het opnieuw.",
            });

            return;
        }

        await guild.members.fetch();
        const guildMember = guild.members.cache.get(interaction.user.id);

        if (!guildMember) {
            await interaction.editReply({
                content:
                    "Oeps, er is intern iets fout gegaan. Probeer het opnieuw.",
            });

            return;
        }

        await guild.roles.fetch();
        const guildRole = guild.roles.cache.get(process.env.GUILD_ROLE_ID);

        if (!guildRole) {
            await interaction.editReply({
                content:
                    "Oeps, er is intern iets fout gegaan. Probeer het opnieuw.",
            });

            return;
        }

        await guildMember.roles.add(guildRole);

        await redis.expire(`verificationCode-${interaction.user.id}`, 0);
        await redis.set(`emailVerified-${interaction.user.id}`, 1);

        await interaction.editReply({
            content: `Het aanmelden is gelukt! Je krijgt binnen enkele seconden toegang tot de Lymevereniging Online Community.`,
        });
    } catch (err) {
        console.error(err);
        await interaction.editReply({
            content:
                "Er is een probleem opgetreden. Neem contact met ons op via online-community@lymevereniging.nl.",
        });
    }
};
