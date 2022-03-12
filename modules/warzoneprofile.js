const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const axios = require('axios');
const moment = require('moment');
const Strings = require("../lib/db");
const WARZONEPROFILE = Strings.warzoneprofile;

module.exports = {
    name: "wp",
    description: 'Warzone Profile informatie, gebruik je activision naam + #nummer',
    extendedDescription: 'Warzone Profile informatie, gebruik je activision naam + #nummer',
    demo: {
        isEnabled: true,
        text: ".wp gurd#3199278"
    },
    async handle(client, chat, BotsApp, args) {
        try {
            // const resultLimit = 3;
            async function result(content, downloading) {
                await client.sendMessage(
                    BotsApp.chatId,
                    `*░░░░░░░░░░ WARZONE STATS ░░░░░░░░░░*\n*username:* ${content.username}\n*level:* ${content.level}\n*levelXpRemainder:* ${content.levelXpRemainder}\n*levelXpGained:* ${content.levelXpGained}\n*totalXp:* ${content.totalXp}\n*wins:* ${content.wins}\n*kills:* ${content.kills}\n*revives:* ${content.revives}\n*kd:* ${content.kd}\n*gamesplayed:* ${content.gamesplayed}\n*timePlayed:* ${content.timePlayed}`,
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
                    '🧐 Voeg een usernaam + hashtag toe bv. gurdt#3199278',
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            } else {
                var downloading = await client.sendMessage(
                    BotsApp.chatId,
                    'Moment geduld...',
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                var username = encodeURIComponent(args);

                const url =
                    "https://my.callofduty.com/api/papi-client/stats/cod/v1/title/mw/platform/uno/gamer/"+
                    username + 
                    "/profile/type/wz";

                const config = {
                    method: 'get',
                    url: url,
                    headers: { 
                        'Cookie': 'ACT_SSO_COOKIE=MTc4NjE3OTA6MTY0NDc0Mjk3MzA5ODpjYTc0M2RmMGExNTVlYzQ2YmZlMjdjODQ5M2FkODdiMw;ACT_SSO_COOKIE_EXPIRY=1591153892430; atkn=eyJhbGciOiAiQTEyOEtXIiwgImVuYyI6ICJBMTI4R0NNIiwgImtpZCI6ICJ1bm9fcHJvZF9sYXNfMSJ9.hA93Q_lzCTMRg_7oeYBWJTKVCQdTQOlpf2X7TnmfaXPcE6XFgnn-DA.eqwnrncxP7PUqsYk.lojSi7YWASbh9FbpsafszBsLg7uezO07xwg0abbJcqUpza4OhaZowJhXMM7LvvBE7qGU9t0nPkCoc_qFfAdCTdAg0BGR-G0r_jpgXnzYgmAZr_nw-nfOEbanbm3X3BIyVHkwkYlzlslwfUtKzrES-dGtsvzNNWadFJjNq8tquyWbEsF7AdlhB64j7o2_Byfg9ymEWfcBvgthLukbiJ2obNzw2T6cFcSvcM91o3_Z2PPK1LkygvJWPwE5g90LGhJiMuLiFDfrCQodC_hjYijD6XY-6QH6eShnqUHKVbLD4ZwW5ywvjSbmWW_pZJRkaZj9XrAoYesU7mmeL2WQ8PjuBROSDfkRPFreORpc7VMxm_4qrj_xmJIR991Yw1QGAOhii_LPwTBX_GBFKD_qo0GS0SMqhvC8SF8NWtWulFhJGXOm8Ty3ZO9nbgH_rP55wA.pOUEUKXb4H0MF2w3mK7hng;; _abck=4629CDBE9765BF283C9F1837DF83E7A4~-1~YAAQrP1IF5S39Xt+AQAA+yHcpQeeNULM3seuItO5q3mdITQ4lXcxV5eQ7kPZSjt7vttsTYxDZc0eP7yHszUmOCUePCk7TEHMsZAJLGPzd00jeT/c5cH79IiCG6FkNntkeR2ad53YWDqH0srIxoECaH+OU3T3nQRVVySYYQuwVMYc0GWaXmr1oLSRxj+QO8rSNzw2k0ZDXVyV2zRb2DkvU9y+mspzwovcS1dV0DwRKBweaXobZV1OuLRQDR58HzpUCiXswxmsj5uOvMXMrB4SgsGo5iKanPDE8RmnJu2/6dlDqC2m0bs++jQLBNXnfaYxXs3Qtv28pDsBSQqe1Q8n6gZbesvX7TD4A9nIfM0lgpvc+8EkUDCqU1tDnON3ZQRAjKCLUiShUZgJrPw=~-1~-1~-1; ak_bmsc=A10B48844FB91BA9FFEF2DD92EF7BB81~000000000000000000000000000000~YAAQHTYWAgxDLWZ/AQAAbJvVfQ8MyZqfBkUrGlu/U9elGFhhxNXcckpI/EsFQh2omHk8yVlnEMFWtxFPyJpKVPMESDGunc+ScvPW2/giGPiJAIBZ68ib57vs7qAsm8CrcFp6gCGq23qToWJmbFtz8b8wMT2dXvJCBdNs2Mrm/OqoCx9UGU+02LqmN2EzzPCZZZe1e2Oa29wmgmtdy8WxMpfB466YNoqEqjRD0dxltSWoxTcBkIVmuR3YynK4PGvSHHtpIAFoYa+3sbYGuDxyvLAcQtvATgjB8JPhHvHCo1iWKCMzEeR/DlcnQgyg6BbmyGEJOk1TEizCqMEa1YKTz7JRGgr/6vGMAK46s49IZHwOMMk++YKbvWorJrClv9tU; bm_sv=15533769CA469DECA1672C6AE070AF04~wS0jTQ4zyAST7fJBylMvYpkBl+PwOaGwnXtAw/DaBOIyNY2QoJaK24acbT4EQzq5ovkYOXE9kNAl6NrXJ9AK5YtRibPKl/eQVV8oxgGS/xtjjy+sBUS1MriRLpZwbgds1xp81/lhkfzZKFxScDh1xesOVJ7qd4Xn4Dk3u4gfzq8=; ssoDevId=48299bf2074f46c39a4c683c9e6f5110'
                    }
                    };
                
                axios(config)
                .then(function (response) {
                    const userData = JSON.parse(JSON.stringify(response.data.data));

                    console.log(userData.username);

                    const content = {
                        username: userData.username,
                        level: userData.level,
                        levelXpRemainder: userData.levelXpRemainder,
                        levelXpGained: userData.levelXpGained,
                        totalXp: userData.totalXp,
                        wins: userData.lifetime.mode.br.properties.wins,
                        kills: userData.lifetime.mode.br.properties.kills,
                        revives: userData.lifetime.mode.br.properties.revives,
                        kd: userData.lifetime.mode.br.properties.kdRatio.toFixed(2),
                        gamesplayed: userData.lifetime.mode.br.properties.gamesPlayed,
                        timePlayed: moment.duration(userData.lifetime.mode.br.properties.timePlayed, 'seconds').humanize(),
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
