import { ButtonBuilder, ButtonStyle } from "discord.js";

export const CodeVerificationButtonID = "cd6ef968-9da5-4986-a463-b28dd2dc79ba";

export const codeVerificationButton = new ButtonBuilder()
    .setCustomId(CodeVerificationButtonID)
    .setLabel("Aanmeld code")
    .setStyle(ButtonStyle.Primary);
