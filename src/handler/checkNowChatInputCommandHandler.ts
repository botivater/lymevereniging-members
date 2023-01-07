import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { cronMembershipHandler } from "./cronMembershipHandler";

export const checkNowChatInputCommandHandler = async (
    interaction: ChatInputCommandInteraction<CacheType>
) => {
    await interaction.deferReply({ ephemeral: true });

    try {
        await cronMembershipHandler(interaction.client, {
            sendUnverifiedMessages: true,
        });

        await interaction.editReply("Check has been completed without errors.");
    } catch (err) {
        if (err instanceof Error) {
            await interaction.editReply(`An error occurred: ${err.message}`);
        } else {
            await interaction.editReply(`An unknown error occurred.`);
        }
    }
};
