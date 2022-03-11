const { MessageType } = require("@adiwajshing/baileys");
// const Strings = require("../lib/db");
// const format = require("python-format-js");
const inputSanitization = require("../sidekick/input-sanitization");
// const alive = Strings.alive;

module.exports = {
    name: ".test",
    description: 'Testen of botje nog zijn werk doet.',
    extendedDescription: 'Testen of de bot nog aan staat.',
    demo: { isEnabled: true, text: ".test" },
    async handle(client, chat, BotsApp, args) {
        try {
            client.sendMessage(
                BotsApp.chatId,
                'Jaja, de bot staat aan.. Geen paniek!',
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};
