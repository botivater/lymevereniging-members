import { SlashCommandBuilder, SlashCommandUserOption } from "discord.js";

export const resendInitialMessageCommand = new SlashCommandBuilder()
    .setName("resend-initial-message")
    .setDescription("Resend the initial message")
    .setDefaultMemberPermissions(0)
    .addUserOption(
        new SlashCommandUserOption()
            .setName("user")
            .setDescription("User to resend the message to")
            .setRequired(true),
    );
