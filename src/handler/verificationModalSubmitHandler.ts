import {
    ActionRowBuilder,
    ButtonBuilder,
    CacheType,
    ModalSubmitInteraction,
} from "discord.js";
import { VerificationModalEmailInputID } from "../modal/verificationModal";
import * as yup from "yup";
import { redis } from "../redis";
import {
    checkMembershipStatus,
    MembershipStatus,
} from "../api/checkMembershipStatus";
import { codeVerificationButton } from "../button/codeVerificationButton";
import { randomInt } from "crypto";
import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";

export const verificationModalSubmitHandler = async (
    interaction: ModalSubmitInteraction<CacheType>,
) => {
    await interaction.deferReply();

    try {
        const emailInput = interaction.fields
            .getTextInputValue(VerificationModalEmailInputID)
            .trim();

        const validationSchema = yup.string().email().required();
        const isValid = await validationSchema.isValid(emailInput);

        if (!isValid) {
            await interaction.editReply({
                content:
                    "Dit is geen geldig email adres. Heb je misschien een typfout gemaakt?",
            });

            return;
        }

        await redis.set(`email-${interaction.user.id}`, emailInput);
        await redis.set(`emailVerified-${interaction.user.id}`, 0);

        const membershipStatus = await checkMembershipStatus(emailInput);

        if (membershipStatus === MembershipStatus.INACTIVE) {
            await interaction.editReply({
                content:
                    "Dit email adres is niet geregistreerd bij de Lymeverenging. Stuur een mail naar ledenadministratie@lymevereniging.nl om na te vragen met welk email adres jouw huishouden geregistreerd staat.",
            });

            return;
        }

        const messageActionRow =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                codeVerificationButton,
            );

        const randomNumber = randomInt(0, 100000000);
        const verificationCode = randomNumber.toString().padStart(8, "0");

        await redis.set(
            `verificationCode-${interaction.user.id}`,
            verificationCode,
        );
        await redis.expire(
            `verificationCode-${interaction.user.id}`,
            60 * 60 * 24,
        );

        const renderObject = {
            fullName: interaction.user.username,
            verificationCode: `${verificationCode.slice(
                0,
                4,
            )} ${verificationCode.slice(4, 8)}`,
        };

        const renderedHtml = await ejs.renderFile(
            path.join(process.env.PWD, "templates/verificationEmail.html"),
            renderObject,
        );
        const renderedText = await ejs.renderFile(
            path.join(process.env.PWD, "templates/verificationEmail.txt"),
            renderObject,
        );

        const mailTransporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT),
            secure: parseInt(process.env.MAIL_SECURE) === 1 ? true : false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        await mailTransporter.sendMail({
            from: process.env.MAIL_FROM,
            to: emailInput,
            subject: "Lymevereniging aanmeld code",
            text: renderedText,
            html: renderedHtml,
        });

        await interaction.editReply({
            content: `We hebben een code gestuurd naar het email adres wat je opgegeven hebt. Klik hieronder om die code in te vullen.`,
            components: [messageActionRow],
        });
    } catch (err) {
        console.error(err);
        await interaction.editReply({
            content:
                "Er is een probleem opgetreden. Neem contact met ons op via online-community@lymevereniging.nl.",
        });
    }
};
