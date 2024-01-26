import { ModalBuilder, TextInputBuilder } from "@discordjs/builders";
import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    TextInputStyle,
} from "discord.js";

export const CodeVerificationModalID = "311196bb-0043-459b-8b1b-3d71c295b99d";
export const CodeVerificationModalCodeInputID =
    "62bdc86e-b7a2-4d4e-8c99-9488993d27ed";

const codeInput = new TextInputBuilder()
    .setCustomId(CodeVerificationModalCodeInputID)
    .setLabel("Vul de code die je gekregen hebt hieronder in")
    .setPlaceholder("1234 5678 (2 groepjes van 4)")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    .setMinLength(8)
    .setMaxLength(9);

const firstActionRow =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        codeInput,
    );

export const codeVerificationModal = new ModalBuilder()
    .setCustomId(CodeVerificationModalID)
    .setTitle("Aanmeld code (deze vind je in je email inbox)")
    .addComponents(firstActionRow);
