import { ButtonBuilder, ButtonStyle } from "discord.js";

export const VerificationButtonID = "2714936d-e5ed-404c-9862-d88b48edbb70";

export const verificationButton = new ButtonBuilder()
    .setCustomId(VerificationButtonID)
    .setLabel("Klik hier")
    .setEmoji("✅")
    .setStyle(ButtonStyle.Primary);
