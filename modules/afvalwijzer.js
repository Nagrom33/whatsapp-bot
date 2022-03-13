const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const axios = require('axios');
const moment = require('moment');
const Strings = require("../lib/db");
const data = require("../lib/db");
const AFVALWIJZER = Strings.afvalwijzer;

module.exports = {
    name: "aw",
    description: 'Mijn afvalwijzer, eenvoudig zien welke kliko je aan de weg moet zetten.',
    extendedDescription: 'Mijn afvalwijzer, eenvoudig zien welke kliko je aan de weg moet zetten.',
    demo: {
        isEnabled: true,
        text: ".aw 3862LS 44"
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
            if (args.length < 1) {
                client.sendMessage(
                    BotsApp.chatId,
                    '🧐 Voeg een postcode + huisnummer toe bv. 3862ls 44',
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            } else {
                var downloading = await client.sendMessage(
                    BotsApp.chatId,
                    'Moment geduld...',
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                var moment = require('moment'); // require
                const postcode = args[0];
                const huisnummer = args[1];
                const vandaag = moment().format('YYYY-MM-DD').toString();
                console.log(args);

                const url =
                    "https://api.mijnafvalwijzer.nl/webservices/appsinput/?apikey=5ef443e778f41c4f75c69459eea6e6ae0c2d92de729aa0fc61653815fbd6a8ca&method=postcodecheck&postcode=" +
                    postcode +
                    "&street=&huisnummer=" +
                    huisnummer +
                    "&toevoeging=&app_name=afvalwijzer&platform=phone&afvaldata=" +
                    vandaag +
                    "&langs=nl&";

                const config = {
                    method: 'get',
                    url: url,
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                    };
                
                axios(config)
                .then(function (response) {
                    const afvalwijzerData = JSON.parse(JSON.stringify(response.data.ophaaldagen.data));
                    var upcomming = afvalwijzerData.filter((item) => {
                        return item.date >= vandaag;
                    });
                    
                    const cleanArray = [];
                    upcomming.map((data, i) => {
                        if(i<3){
                        var type = data.type;
                        let niceData = [];
                        switch (type) {
                           case 'gft':
                               niceData = {
                                   type: 'Groente, Fruit en Tuinafval',
                                   date: moment(data.date).format('DD-MM-YYYY'),
                                   emote: '🍏',
                               };
                            break;
                           case 'pmd':
                                niceData = {
                                   type: 'Plastic, Metalen en Drankkartons',
                                   date: moment(data.date).format('DD-MM-YYYY'),
                                   emote: '🧋',
                               }
                               break;
                               case 'kca':
                                niceData = {
                                   type: 'Klein chemisch afval',
                                   date: moment(data.date).format('DD-MM-YYYY'),
                                   emote: '☠️',
                               }
                               break;
                               case 'restafval':
                                niceData = {
                                   type: 'Restafval',
                                   date: moment(data.date).format('DD-MM-YYYY'),
                                   emote: '🗑️',
                               }
                               break;
                         }

                        cleanArray.push(niceData);
                        }
                    })

                    const content = 
`*░░░░░░░░░░░░ AFVAL WIJZER ░░░░░░░░░░░░*

- ${cleanArray[0].emote} - *${cleanArray[0].type}* - ${cleanArray[0].date}
- ${cleanArray[1].emote} - *${cleanArray[1].type}* - ${cleanArray[1].date}
- ${cleanArray[2].emote} - *${cleanArray[2].type}* - ${cleanArray[2].date}

Vertrouw je me niet kan je altijd even kijken naar:
https://www.mijnafvalwijzer.nl/nl/${postcode}/${huisnummer}/

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
