import { CacheType, Interaction } from "discord.js";
import { VerificationButtonID } from "../button/verificationButton";
import { VerificationModalID } from "../modal/verificationModal";
import { CodeVerificationButtonID } from "../button/codeVerificationButton";
import { CodeVerificationModalID } from "../modal/codeVerificationModal";
import { codeVerificationButtonHandler } from "../handler/codeVerificationButtonHandler";
import { codeVerificationModalSubmitHandler } from "../handler/codeVerificationModalSubmitHandler";
import { verificationModalSubmitHandler } from "../handler/verificationModalSubmitHandler";
import { verificationButtonHandler } from "../handler/verificationButtonHandler";
import { unverifyMemberCommand } from "../command/unverifyMemberCommand";
import { unverifyMemberChatInputCommandHandler } from "../handler/unverifyMemberChatInputCommandHandler";
import { checkNowCommand } from "../command/checkNowCommand";
import { checkNowChatInputCommandHandler } from "../handler/checkNowChatInputCommandHandler";
import { resendInitialMessageCommand } from "../command/resendInitialMessageCommand";
import { resendInitialMessageCommandHandler } from "../handler/resendInitialMessageCommandHandler";

export const interactionCreateHandler = async (
    interaction: Interaction<CacheType>
) => {
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case unverifyMemberCommand.name:
                await unverifyMemberChatInputCommandHandler(interaction);
                break;

            case checkNowCommand.name:
                await checkNowChatInputCommandHandler(interaction);
                break;

            case resendInitialMessageCommand.name:
                await resendInitialMessageCommandHandler(interaction);
                break;

            default:
                console.warn(
                    `Got unknown command name: ${interaction.commandName}`
                );
                break;
        }
    }

    if (interaction.isButton()) {
        switch (interaction.customId) {
            case VerificationButtonID:
                await verificationButtonHandler(interaction);
                break;

            case CodeVerificationButtonID:
                await codeVerificationButtonHandler(interaction);
                break;

            default:
                console.warn(
                    `Got unknown button custom id: ${interaction.customId}`
                );
                break;
        }
    }

    if (interaction.isModalSubmit()) {
        switch (interaction.customId) {
            case VerificationModalID:
                await verificationModalSubmitHandler(interaction);
                break;

            case CodeVerificationModalID:
                await codeVerificationModalSubmitHandler(interaction);
                break;

            default:
                console.warn(
                    `Got unknown modal custom id: ${interaction.customId}`
                );
                break;
        }
    }
};
