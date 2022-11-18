import { SlashCommandBuilder } from "discord.js";

export const checkNowCommand = new SlashCommandBuilder()
    .setName("check-now")
    .setDescription("Check all the members now")
    .setDefaultMemberPermissions(0);
