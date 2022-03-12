const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const axios = require('axios');
const https = require("https");
const config = require("../config");
const Strings = require("../lib/db");
const IMDB = Strings.imdb;

module.exports = {
    name: "imdb",
    description: 'Zoek informatie over film of serie.',
    extendedDescription: 'Ben je op zoek naar meer informatie over een film of serie probeer deze command eens.',
    demo: {
        isEnabled: true,
        text: ".imdb The Godfather"
    },
    async handle(client, chat, BotsApp, args) {
        try {
            // const resultLimit = 3;
            async function result(imageUrl, caption, downloading) {
                await client.sendMessage(
                    BotsApp.chatId,
                    { url: imageUrl },
                    MessageType.image,
                    {
                        mimetype: Mimetype.jpg,
                        caption: `
*Title:* ${caption.title}
*runtimeStr:* ${caption.runtimeStr}
*genres:* ${caption.genres}
*imDbRating:* ${caption.imDbRating}
*imDbRatingVotes:* ${caption.imDbRatingVotes}
*plot:* ${caption.plot}
*stars:* ${caption.plot}
                        `,
                        thumbnail: null,
                    }
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
                    '🧐 Voeg even een zoekterm toe',
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            } else {
                var downloading = await client.sendMessage(
                    BotsApp.chatId,
                    'Moment geduld...',
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                var query = encodeURIComponent(args);

                const url =
                    "https://imdb-api.com/API/AdvancedSearch/k_dl09nvvw?title=" +
                    query + 
                    "&languages=nl";

                var config = {
                    method: 'get',
                    url: url,
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                };
                
                axios(config)
                .then(function (response) {
                    const itemsData = JSON.parse(JSON.stringify(response.data));
                    const bestResult = itemsData.results[0];

                    const caption = {
                        title: bestResult.title,
                        runtimeStr: bestResult.runtimeStr,
                        genres: bestResult.genres,
                        imDbRating: bestResult.imDbRating,
                        imDbRatingVotes: bestResult.imDbRatingVotes,
                        plot: bestResult.plot,
                        stars: bestResult.stars
                    };

                    result(bestResult.image, caption, downloading);
                })
                .catch(function (error) {
                    client.deleteMessage(BotsApp.chatId, {
                        id: downloading.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    });
                    inputSanitization.handleError(
                        error,
                        client,
                        BotsApp,
                        IMDB.ERROR_OCCURED
                    );
                    return;
                });

                // https.get(url, function (response) {
                //     response.on("error", (err) => {
                //         throw err;
                //     });
                //     response.on("data", function (data) {
                //         try {
                //             const itemsData = JSON.parse(data);
                //             const bestResult = itemsData.results[0];

                //             const caption = {
                //                 title: bestResult.title,
                //                 runtimeStr: bestResult.views,
                //                 genres: bestResult.rate,
                //                 imDbRating: bestResult.length_min,
                //                 imDbRatingVotes: bestResult.embed,
                //                 plot: bestResult.embed,
                //                 stars: bestResult.embed
                //             };

                //             result(bestResult.image, caption, downloading);
                //         } catch (err) {
                //             client.deleteMessage(BotsApp.chatId, {
                //                 id: downloading.key.id,
                //                 remoteJid: BotsApp.chatId,
                //                 fromMe: true,
                //             });
                //             inputSanitization.handleError(
                //                 err,
                //                 client,
                //                 BotsApp,
                //                 IMDB.ERROR_OCCURED
                //             );
                //             console.log('Log 4');
                //             return;
                //         }
                //     });
                // });
                return;
            }
        } catch (err) {
            inputSanitization.handleError(
                err,
                client,
                BotsApp,
                IMDB.ERROR_OCCURED
            );
        }
    },
};
