const { MessageType } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const format = require("python-format-js");
const inputSanitization = require("../sidekick/input-sanitization");
const config = require("../config");
const HELP = Strings.help;

const CommandsEnabled = [
    {
        command: 'carbon',
        description: 'Eenvoudig code voorbeeld als jpg.',
        example: '.carbon <?php echo "Hello World"; ?>'
    },
    {
        command: 'hetweer',
        description: 'Het weer bericht, voor vandaag of morgen.',
        example: '.hetweer Nijkerk tomorrow'
    },
    {
        command: 'imdb',
        description: 'Krijg informatie over een film of serie van IMDB.',
        example: '.imdb flodder'
    },
    {
        command: 'kenteken',
        description: 'Meer willen weten over een kenteken, dat kan hier.',
        example: '.kenteken 80-sr-rl'
    },
    {
        command: 'pornhub',
        description: 'Wanneer je het nodig hebt een random filmpje van een bepaalde genre.',
        example: '.pornhub ass'
    },
    {
        command: 'teammaker',
        description: 'Random groepen indelen, .teammaker <deelnemer 1> <deelnemer 2> | <aantal teams>',
        example: '.teammaker Jan Jaap Joost Geurt | 2'
    },
    {
        command: 'wp',
        description: 'Warzone statistieken van een gebruiker',
        example: '.wp gurdt#3199278'
    },
    {
        command: 'wistjedat',
        description: 'Leuke of niet zo leuke weetjes.',
        example: '.wistjedat'
    },
];

module.exports = {
    name: "help",
    description: HELP.DESCRIPTION,
    extendedDescription: HELP.EXTENDED_DESCRIPTION,
    demo: {isEnabled: false},
    async handle(client, chat, BotsApp, args) {
        try {
            var prefixRegex = new RegExp(config.PREFIX, "g");
            var prefixes = /\/\^\[(.*)+\]\/\g/g.exec(prefixRegex)[1];
            if(!args[0]){
                var helpMessage = HELP.HEAD;
                CommandsEnabled.forEach(element => {
                    helpMessage += HELP.TEMPLATE.format(prefixes[0] + element.command, element.description, element.example);
                });
                client.sendMessage(BotsApp.chatId, helpMessage, MessageType.text).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            var helpMessage = HELP.COMMAND_INTERFACE;
            var command = CommandsEnabled.get(args[0]);
            if(command){
                var triggers = " | "
                prefixes.split("").forEach(prefix => {
                    triggers += prefix + command.name + " | "
                });

                helpMessage += HELP.COMMAND_INTERFACE_TEMPLATE.format(triggers, command.extendedDescription);
                client.sendMessage(BotsApp.chatId, helpMessage, MessageType.text).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            client.sendMessage(BotsApp.chatId, HELP.COMMAND_INTERFACE + "```Invalid Command. Check the correct name from```  *.help*  ```command list.```", MessageType.text).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};
