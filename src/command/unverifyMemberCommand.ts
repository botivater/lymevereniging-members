import { SlashCommandBuilder, SlashCommandUserOption } from "discord.js";

export const unverifyMemberCommand = new SlashCommandBuilder()
    .setName("unverify-member")
    .setDescription("Unverify a member")
    .setDefaultMemberPermissions(0)
    .addUserOption(
        new SlashCommandUserOption()
            .setName("user")
            .setDescription("User to unveriy")
            .setRequired(true)
    );
