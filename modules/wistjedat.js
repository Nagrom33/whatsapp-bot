const { MessageType } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const format = require("python-format-js");
const inputSanitization = require("../sidekick/input-sanitization");
const alive = Strings.alive;

const wistjedat = [
    'twee oenen lopen over straat, vraagt de een aan de ander:"mag ik nu in het midden lopen?"',
    'een oen zit met zijn zoontje in het vliegtuig, vraagt het zoontje aan zijn vader: "papa, kijk is een boot!" oen: "nee, dat is een hovercraft!" zoontje: " hoe spel je dat?" oen: "ah, nee, het is toch een boot!"',
    'waarom neemt een oen een mes mee in de auto? (om de weg af te snijden!)',
    'waarom neemt een oen een ladder mee naar de winkel? (voor de hoge prijzen!)',
    'wat is het toppunt van geduld? (vissen op een muur tekenen en wachten tot ze wegzwemmen!)',
    'wat is het toppunt van luiheid? (vroeg opstaan om langer te kunnen rusten!)',
    'wat is het toppunt van domheid? (een baksteen door de ruit van een politiebureau gooien!)',
    'het is groen en vliegt door de lucht? (een spruitje achter een vliegtuig!)',
    'het is geel en vliegt door de lucht? (datzelfde spruitje, 2 weken later!)',
    'wat is geel en géén banaan? (stiekem toch een banaan!)',
    'wat is rood en huilt heel hard? (een baby met een kaasschaaf!)',
    'wat vier je als je vier jaar wordt? (je VIERjaardag!)',
    'komt een man bij de dokter, man: "ik heb overal pijn! als ik hier druk heb ik pijn, als ik hier druk heb ik pijn, zelfs als ik..." dokter: "stop maar, ik weet het al, je hebt je vinger gebroken!',
    'klop klop; wie is daar?; Klop Klop; wie?; Klop Klop!; wie?!; Klop Klop!!!; oooooooh, kom gezellig binnen binnen, meneer Klop!',
    'een worstmaker koopt een strijkijzer.',
    'waarom krijgen we over 20 jaar oorlog met de Belgen? (omdat ze dan onze moppen snappen!)',
    'waarom krijgen de Fransen over 20 jaar oorlog met de Belgen? (omdat ze de verkeerde kant op gingen!)',
    'komen een Brit, Belg en Nederlander in een kroeg, houden ze een wedstrijdje drinken. de Brit plast in zijn broek, de Belg gaat naar de wc en de Nederlander heeft een luier om!',
    'wat doen twee vampiers nadat ze getrouwd zijn? (ze gaan op gruwelijksreis!)',
    'ober! er zit een vlieg in mijn soep!; dat geeft niet, deze soort drinkt niet zoveel!',
    'het is zwart, en als het uit de boom valt, is de kachel kapot? (de kachel!)',
    'moeder: "jolien, heb het al vers water in het aquarium gedaan?" jolien: "natuurlijk niet! de vissen hebben het nog lang niet op!"',
    'waarom zijn vissen slim? (omdat ze in een SCHOOL zwemmen!)',
    'wat heeft ogen, maar kan niet zien? (dobbelsteen!)',
    'wat heeft oren, maar kan niet horen? (kopje thee!)',
    'wat heeft 100 poten, maar kan niet lopen? (25 stoelen!)',
    'wat is het toppunt van domheid? (een blonde Belg!)',
    'komt een skelet een café binnen: "mag ik twee cola en een dweil graag!"',
    'zit een man op een terras. man: "een biertje" ober: "nee dank u!"',
    'komt een man bij de dokter. man: "mijn neus zit verstopt." docter: "dan moet u hem zoeken!"',
    'ik ken een goeie mop, twee billen in een envelop!',
    'hoe noem je 2 vechtende bejaarden? (tachtigjarige oorlog!)',
    'het is oranje en heeft een slurf? (olifant!)',
    'wat zegt een smurf als hij tegen een boom loopt? (auw! weer een blauwe plek!)',
    'wat is het snelste dier op aarde? (sprinthaan!)',
    'hoe krijg je een Belg gek? (zet hem in een ronde kamer en zeg dat er een patateke in de hoek ligt!)',
    'hoe peutert een Belg in zijn neus? (hij doet zijn vingers om zijn neus en zegt: kom eruit! ge zijt omsingeld!)',
    'wat staat er aan het begin van een Belgisch kookboek? (men gaat naar de keuken!)',
    'waarom neemt een oen een zaag me naar het bos? (omdat hij door de bomen het bos niet ziet!)',
    'Gek, Niks en Niemand zitten in een boom, Niemand valt eruit. Niks zegt tegen Gek: "bel de politie!" Gek belt, hij zegt: "hallo, politie? Ik ben Gek, ik bel voor Niks, want Niemand is uit de boom gevallen!"',
    'Jantje en nog een keer zitten in een bootje, Jantje valt eruit, wie blijft er dan nog over?',
    'meester: "wie kan mij 5 dieren uit Afrika zeggen?" Jantje: "2 leeuwen en 3 giraffen!"',
    'Leendert, kun je even uit het raam kijken wat voor weer het is? Leendert: "ik kan het niet zien, het is te mistig."',
    '"mijn vader is een gierigaard" "hoezo?" "hij giert altijd van het lachen!"',
    'oom Kees heeft geprobeert het alfabet op te drinken, het is hem alleen gelukt met de twintigste letter!',
    'waarom heeft de Koningin een witte telefoon? (om te bellen!)',
    'waarom heet een ei een ei? (omdat je niet weet of het een hij of zij is!)',
    'waarom zit een oen steeds in zijn koelkast? (om te checken of het licht uit is!)',
    'wat is een papier dat in de zee drijft? (een zwemdimploma!)',
    'met hoeveel poten loopt een duizendpoot over een mesthoop? (999, de andeere gebruikt hij om z"n neus dicht te knijpen!)',
]

module.exports = {
    name: "wistjedat",
    description: 'Volkomen kansloos, maar het zit er in',
    extendedDescription: 'Meeste onzin komt hiervandaan.',
    demo: { isEnabled: true, text: ".wistjedat" },
    async handle(client, chat, BotsApp, args) {
        try {
            const result = wistjedat[  
                Math.floor(Math.random() * wistjedat.length)
            ]
            client.sendMessage(
                BotsApp.chatId,
                result,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};
