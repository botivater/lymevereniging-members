import { ButtonInteraction, CacheType } from "discord.js";
import { verificationModal } from "../modal/verificationModal";

export const verificationButtonHandler = async (
    interaction: ButtonInteraction<CacheType>,
) => {
    await interaction.showModal(verificationModal);
};
