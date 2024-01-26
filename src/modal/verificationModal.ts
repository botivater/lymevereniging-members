import { ModalBuilder, TextInputBuilder } from "@discordjs/builders";
import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    TextInputStyle,
} from "discord.js";

export const VerificationModalID = "c09201c1-499f-4968-b0d2-c5843c2dc98d";
export const VerificationModalEmailInputID =
    "e183e79f-bce9-4da9-8a2e-6f5034b24ed6";

const emailInput = new TextInputBuilder()
    .setCustomId(VerificationModalEmailInputID)
    .setLabel("Email adres")
    .setPlaceholder("Email adres waarmee je geregistreerd staat.")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    .setMaxLength(255);

const firstActionRow =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        emailInput,
    );

export const verificationModal = new ModalBuilder()
    .setCustomId(VerificationModalID)
    .setTitle("Lidmaatschap verifiëren")
    .addComponents(firstActionRow);
