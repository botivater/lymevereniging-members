import { ButtonInteraction, CacheType } from "discord.js";
import { codeVerificationModal } from "../modal/codeVerificationModal";

export const codeVerificationButtonHandler = async (
    interaction: ButtonInteraction<CacheType>
) => {
    await interaction.showModal(codeVerificationModal);
};
