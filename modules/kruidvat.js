const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    name: "kruidvat",
    description: 'Zoek een product + prijzen',
    extendedDescription: 'Zoek een product en bijbehorende prijzen, makkelijk toch?',
    demo: {
        isEnabled: true,
        text: ".kruidvat tandpasta"
    },
    async handle(client, chat, BotsApp, args) {
        try {
            // const resultLimit = 3;
            async function result(content, downloading) {
                await client.sendMessage(
                    BotsApp.chatId,
                    content.map((product, i) => {
`Name: ${product.title}
Prijs: ${product.price}
Link: ${product.link}
---------------------`
                    }),
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
                    '🧐 Voeg wel even een product toe lamzak',
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            } else {
                var downloading = await client.sendMessage(
                    BotsApp.chatId,
                    'Producten worden opgehaald moment geduld...',
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                var zoekProduct = encodeURIComponent(args);

                const url = `https://www.kruidvat.nl/search?q=${zoekProduct}`;
                let products = [];

                fetchData(url).then( (res) => {
                    const html = res.data;
                    const $ = cheerio.load(html);
                    const productTarget = $('div.product__list-col');
                
                    productTarget.each(function() {
                        products.push({
                            title: $(this).find('.tile__product-slide-product-name').text().split("  ").join("").replace(/[\n\t\r]/g,""),
                            link: 'https://www.kruidvat.nl/' + $(this).find('a.tile__product-slide-link').attr('href'),
                            price: $(this).find('.pricebadge__new-price').text().split(" ").join("").replace(/[\n\t\r]/g,""),
                        })
                    });
                    //console.log(products);
                    result(products, downloading);
                })
                
                async function fetchData(url){
                    console.log("Crawling data...")
                    // make http call to url
                    let response = await axios(url).catch((err) => {
                        console.log(err);
                        client.sendMessage(
                            BotsApp.chatId,
                            '❌ Er is iets mis gegaan, probeer het opnieuw',
                            MessageType.text
                        );
                    });
                
                    if(response.status !== 200){
                        console.log("Error occurred while fetching data");
                        client.sendMessage(
                            BotsApp.chatId,
                            '❌ Er is iets mis gegaan, probeer het opnieuw',
                            MessageType.text
                        );
                        return;
                    }
                    return response;
                }
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
