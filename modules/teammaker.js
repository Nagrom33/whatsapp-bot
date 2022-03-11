const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const chalk = require("chalk");
const inputSanitization = require("../sidekick/input-sanitization");
const strings = require("../lib/db")
const TEAMMAKER = strings.teammaker;

module.exports = {
    name: "teammaker",
    description: TEAMMAKER.DESCRIPTION,
    extendedDescription: TEAMMAKER.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client, chat, BotsApp, args) {
        try{
            if(args.length === 0) {
                client.sendMessage(BotsApp.chatId, TEAMMAKER.NO_TEXT, MessageType.text);
                return;
            }
            if(args.length > 0) {
                const bodySplitter = BotsApp.body.split("|");

                let deelnemers = bodySplitter[0].slice(0, bodySplitter[0].length - 1).split(" ");
                deelnemers.shift();
                const aantalTeams = bodySplitter[1];

                function shuffleArray(arr) {
                    arr.sort(() => Math.random() - 0.5);
                }
                
                shuffleArray(deelnemers);

                const spelersPerTeam = deelnemers.length / aantalTeams;
                let teamNumber = 1;

                function splitIntoChunk(arr, chunk) {
                    for (i=0; i < arr.length; i += chunk) {
                        let tempArray;
                        tempArray = arr.slice(i, i + chunk);
                        client.sendMessage(
                            BotsApp.chatId,
                            `*░░░░░░░░░░ Team ${teamNumber} ░░░░░░░░░░*\n\n${tempArray.join(',\n')}\n\n *░░░░░░░░░░░░░░░░░░░░░░░░░*`,
                            MessageType.text
                        );
                        teamNumber++;
                    }
                }
                splitIntoChunk(deelnemers, spelersPerTeam);
            }
        }

        catch(err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    }
}