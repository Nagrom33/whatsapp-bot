const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const axios = require('axios');
const moment = require('moment');
const Strings = require("../lib/db");
const KENTEKEN = Strings.kenteken;

module.exports = {
    name: "kenteken",
    description: 'Krijg meer info over een kenteken',
    extendedDescription: 'Krijg meer info over kenteken',
    demo: {
        isEnabled: true,
        text: ".kenteken 80-SR-RL"
    },
    async handle(client, chat, BotsApp, args) {
        try {
            // const resultLimit = 3;
            async function result(content, downloading) {
                await client.sendMessage(
                    BotsApp.chatId,
`*░░░░░░░░░░ KENTEKEN INFO ░░░░░░░░░░*\n
*Aantal cilinders:* ${content.aantal_cilinders}
*Zuinigheids Classificatie:* ${content.zuinigheidsclassificatie}
*Eerste toelating:* ${content.datum_eerste_toelating}
*Kleur:* ${content.eerste_kleur}
*Verval datum APK:* ${content.vervaldatum_apk}
*Merk:* ${content.merk}
*Type:* ${content.handelsbenaming}
*Inrichting:* ${content.inrichting}`,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                await client.deleteMessage(BotsApp.chatId, {
                    id: downloading.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }
            if (args.length < 1) {
                client.sendMessage(
                    BotsApp.chatId,
                    '🧐 Voeg een kenteken toe bijvoorbeeld 80-SR-RL',
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            } else {
                var downloading = await client.sendMessage(
                    BotsApp.chatId,
                    'Moment geduld...',
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                var kenteken = encodeURIComponent(args);

                const url =
                    "https://api.overheid.io/voertuiggegevens/"+
                    kenteken + 
                    "?ovio-api-key=b2ddde3d773cc38b92870b02f5240981d81abb5f78ee18b6a26021200e15d3e3";

                const config = {
                    method: 'get',
                    url: url,
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                    };
                
                axios(config)
                .then(function (response) {
                    const kentekenData = response.data;
                    const content = {
                        aantal_cilinders: kentekenData.aantal_cilinders,
                        zuinigheidsclassificatie: kentekenData.zuinigheidsclassificatie,
                        datum_eerste_toelating: kentekenData.datum_eerste_toelating,
                        eerste_kleur: kentekenData.eerste_kleur,
                        vervaldatum_apk: kentekenData.vervaldatum_apk,
                        merk: kentekenData.merk,
                        handelsbenaming: kentekenData.handelsbenaming,
                        inrichting: kentekenData.inrichting,
                    };
                    result(content, downloading);
                })
                .catch(function (error) {
                    console.log(error);
                    client.deleteMessage(BotsApp.chatId, {
                        id: downloading.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    });
                    console.log(error);
                    client.sendMessage(
                        BotsApp.chatId,
                        '❌ Er is iets mis gegaan, probeer het opnieuw',
                        MessageType.text
                    );
                    return;
                });
                return;
            }
        } catch (err) {
            inputSanitization.handleError(
                err,
                client,
                BotsApp,
                'Error?!'
            );
        }
    },
};
