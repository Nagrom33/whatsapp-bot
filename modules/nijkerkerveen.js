const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const axios = require('axios');
const striptags = require('striptags');

module.exports = {
    name: "nijkerkerveen",
    description: 'Krijg de laatste nieuws items van Nijkerkerveen.org',
    extendedDescription: 'Laatste nieuws van Nijkerk en omgeving.',
    demo: {
        isEnabled: true,
        text: ".nijkerkerveen"
    },
    async handle(client, chat, BotsApp, args) {
        try {
            // const resultLimit = 3;
            async function result(content, downloading) {
                await client.sendMessage(
                    BotsApp.chatId,
                    content,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                await client.deleteMessage(BotsApp.chatId, {
                    id: downloading.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }
            var downloading = await client.sendMessage(
                BotsApp.chatId,
                'Nieuws wordt opgehaald, moment geduld...',
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));

            const url = "https://www.nijkerkerveen.org/wp-json/wp/v2/posts";

            const config = {
                method: 'get',
                url: url,
                headers: { 
                    'Content-Type': 'application/json'
                }
            };
                
                axios(config)
                .then(function (response) {
                    const nieuwsItems = JSON.parse(JSON.stringify(response.data));
                    

                    const content = 
`*░░░░░░░░░░░░ NIJKERKERVEEN.ORG ░░░░░░░░░░░░*

*${nieuwsItems[0].title.rendered}*
${striptags(nieuwsItems[0].excerpt.rendered)}

_Link: ${nieuwsItems[0].link}
-------
*${nieuwsItems[1].title.rendered}*
${striptags(nieuwsItems[1].excerpt.rendered)}

_Link: ${nieuwsItems[1].link}
-------
*${nieuwsItems[2].title.rendered}*
${striptags(nieuwsItems[2].excerpt.rendered)}

_Link: ${nieuwsItems[2].link}
-------

*░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░*
`;

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
