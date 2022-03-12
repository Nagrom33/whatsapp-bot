const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const https = require("https");
const config = require("../config");
const Strings = require("../lib/db");
const PORNHUB = Strings.pornhub;

module.exports = {
    name: "pornhub",
    description: 'Kom je niet aan je trekken, probeer het dan hier.',
    extendedDescription: 'Random voor in de koude tijden, probeer het eens.',
    demo: {
        isEnabled: true,
        text: ".pornhub ass"
    },
    async handle(client, chat, BotsApp, args) {
        try {
            const randomPage = Math.floor(Math.random() * 100);

            async function result(imageUrl, caption, downloading) {
                await client.sendMessage(
                    BotsApp.chatId,
                    { url: imageUrl },
                    MessageType.image,
                    {
                        mimetype: Mimetype.jpg,
                        caption: `*Title:* ${caption.titel}\n*Views:* ${caption.views}\n*Rate:* ${caption.rate}\n*Lengte min:* ${caption.length_min}\n*Video:* ${caption.video}`,
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
                var query = args.join(" ");
                const unit = "metric";

                const url =
                    "https://www.eporner.com/api/v2/video/search/?query=" +
                    query +
                    "&per_page=1&page=" +
                    randomPage +
                    "&thumbsize=big&format=json";

                https.get(url, function (response) {
                    response.on("error", (err) => {
                        throw err;
                    });
                    response.on("data", function (data) {
                        try {
                            const itemData = JSON.parse(data);
                            const video = itemData.videos[0];

                            const caption = {
                                titel: video.title,
                                views: video.views,
                                rate: video.rate,
                                length_min: video.length_min,
                                video: video.embed
                            };

                            result(video.default_thumb.src, caption, downloading);
                        } catch (err) {
                            client.deleteMessage(BotsApp.chatId, {
                                id: downloading.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            });
                            inputSanitization.handleError(
                                err,
                                client,
                                BotsApp,
                                PORNHUB.ERROR_OCCURED
                            );
                            return;
                        }
                    });
                });
                return;
            }
        } catch (err) {
            inputSanitization.handleError(
                err,
                client,
                BotsApp,
                WEATHER.ERROR_OCCURED
            );
        }
    },
};
