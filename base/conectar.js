import makeWASocket, {
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore,
    Browsers
} from "@whiskeysockets/baileys";
import cfonts from 'cfonts';
import P from "pino";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import NodeCache from "node-cache";
import handleJoinRequest from "./base/handleJoinRequest.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
    AUTH_DIR: "./qr-code",
    DATA_DIR: "./lara",
    INITIAL_RECONNECT_DELAY: 3000,
    MAX_RECONNECT_DELAY: 60000,
    GROUP_CACHE_TTL: 300,
};

const colorize = {
    VERDE: "\x1b[32m",
    VERMELHO: "\x1b[31m",
    AMARELO: "\x1b[33m",
    CIANO: "\x1b[36m",
    RESET: "\x1b[0m"
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const jitter = (base, variance) => base + Math.floor(Math.random() * variance);

const cache = new NodeCache({
    stdTTL: CONFIG.GROUP_CACHE_TTL,
    checkperiod: 60,
    maxKeys: 3000
});

// Cache leve de metadata de grupo: evita ficar chamando a API a cada evento,
// o que reduz consumo e diminui a "pegada" do bot.
async function getGroupMetadataCached(sock, groupId) {
    const key = `meta_${groupId}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const metadata = await sock.groupMetadata(groupId).catch(() => null);
    if (metadata) cache.set(key, metadata);
    return metadata;
}

function invalidateGroupMetadataCache(groupId) {
    cache.del(`meta_${groupId}`);
}
const larastist = JSON.parse(fs.readFileSync("./lara/lara.json"));
let botConfig;
let BOT;

function carregarBotConfig() {
    try {
        botConfig = JSON.parse(
            fs.readFileSync(`${CONFIG.DATA_DIR}/lara.json`, "utf-8")
        );
        BOT = {
            numero: botConfig.laranumero,
            lid: botConfig.laralid,
            jid: `${botConfig.laranumero}@s.whatsapp.net`
        };
        return true;
    } catch (error) {
        console.error(`${colorize.VERMELHO}❌ Erro ao carregar config:${colorize.RESET}`, error.message);
        return false;
    }
}

carregarBotConfig();

function carregarConfigGrupo(jid) {
    try {
        const configPath = `./lara/chats/${jid}.json`;
        if (!fs.existsSync(configPath)) return {};
        return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (error) {
        return {};
    }
}

let executar;

const extractParticipantId = (participant) => {
    if (!participant) return null;   
    // Retorna LID se disponível, senão retorna o ID padrão
    let id = participant.lid || participant.id || null;
    // Remove :XX se existir (ex: 267955023654984:13@lid -> 267955023654984@lid)
    if (id && id.includes(':')) {
        const suffix = id.includes('@lid') ? '@lid' : '@s.whatsapp.net';
        id = id.split(':')[0] + suffix;
    }
    
    return id;
};

async function carregarComandos() {
    try {
        const modulo = await import(`${path.join(__dirname, "index.js")}?update=${Date.now()}`);
        executar = modulo.default;
//        console.log(`${colorize.VERDE}✅ Comandos carregados${colorize.RESET}`);
        return true;
    } catch (error) {
        console.error(`${colorize.VERMELHO}❌ Erro: ${error.message}${colorize.RESET}`);
        return false;
    }
}

function isCommandMessage(m) {
    if (!m?.key) return false;
    if (m.key.fromMe) return false; // ⚠️ Ignora mensagens DO BOT

    const jid = m.key.remoteJid;
    if (!jid) return false;
    if (jid === "status@broadcast") return false;

    // ⚠️ SÓ ACEITA SE FOR @g.us OU @s.whatsapp.net
    if (!jid.endsWith("@g.us") && !jid.endsWith("@s.whatsapp.net")) return false;
    if (m.messageStubType) return false;
    if (!m.message) return false;

    let text = "";
    if (m.message.conversation) text = m.message.conversation;
    else if (m.message.extendedTextMessage?.text) text = m.message.extendedTextMessage.text;
    else if (m.message.imageMessage?.caption) text = m.message.imageMessage.caption;
    else if (m.message.videoMessage?.caption) text = m.message.videoMessage.caption;
    else return false; 
let prefix = larastist.prefixo;
    try {
        const config = JSON.parse(fs.readFileSync("./lara/lara.json", "utf-8"));
        if (config?.prefixo) prefix = config.prefixo;
    } catch (e) {}

    return text.trim().startsWith(prefix);
}


async function handleMessage(sock, m) {
    if (!m?.message) return;
    if (m.key?.fromMe) return;
    if (m.messageStubType) return;

    const msg = m.message || {};


    const isCmdMsg = isCommandMessage(m);


    const isMidia =
        msg.imageMessage ||
        msg.videoMessage ||
        msg.audioMessage ||
        msg.documentMessage ||
        msg.stickerMessage ||
        msg.contactMessage ||
        msg.contactsArrayMessage ||
        msg.locationMessage ||
        msg.liveLocationMessage ||
        msg.pollCreationMessageV3;

    // texto normal
    const texto =
        msg.conversation ||
        msg.extendedTextMessage?.text ||
        msg.imageMessage?.caption ||
        msg.videoMessage?.caption;

    const temTexto = !!texto;

    // só deixa passar:
    // comandos
    // mídia
    // mensagens com texto
    if (!isCmdMsg && !isMidia && !temTexto) return;

    try {
        await executar({ lara: sock, m });
    } catch (error) {
        console.error(
            `${colorize.VERMELHO}❌ Erro no comando:${colorize.RESET}`,
            error.message
        );
    }
}


const ultimasAcoesGrupo = new Map();

async function executarAntiRoubo(sock, groupId, action, participants, eventAuthor) {
    try {
        const config = carregarConfigGrupo(groupId);
        if (!config.escudo && !config.x9 && !config.X9) return;
        const metadata = await sock.groupMetadata(groupId).catch(() => null);
        if (!metadata) return;
        const criadorGrupo = metadata.owner?.split('@')[0];
        const botJid = sock.user?.id?.split(':')[0]?.split('@')[0];
        const botLid = sock.user?.lid?.split(':')[0]?.split('@')[0];
        const donoBot = BOT?.numero?.replace(/\D/g, ""); 
        const donoLid = botConfig.laralid;


        const limparId = (id) => id ? id.toString().split('@')[0].split(':')[0].replace(/\D/g, "") : "";

        const authorNum = limparId(eventAuthor);
        const botNum = limparId(botJid);
        const botLidNum = limparId(botLid);
        const donoLidNum = limparId(donoLid);  
        const whitelist = [
            botNum,
            botLidNum,
            donoBot,
            donoLidNum,
            criadorGrupo
        ].filter(Boolean);
        const isIgnorado = whitelist.includes(authorNum);

        if (config.x9 || config.X9) {
            for (const user of participants) {

                if (authorNum === botNum || authorNum === botLidNum) continue;

                await sock.sendMessage(groupId, {
                    text: `🕵️ *SISTEMA X9*\n\n` +
                          `👤 Usuário: @${user.replace(/\D/g, "")}\n` +
                          `⚙️ Ação: ${action === "promote" ? "PROMOVIDO" : "REBAIXADO"}\n` +
                          `👮 Por: @${authorNum}\n` +
                          `${isIgnorado ? "⚠️ Ação de autoridade/dono detectada." : ""}`,
                    mentions: [user, eventAuthor]
                });
            }
        }
        
        if (config.escudo && !isIgnorado) {
            if (action === "promote" || action === "demote") {
                for (const user of participants) {
                    try {
                        await sock.groupParticipantsUpdate(groupId, [user], "demote");
 await sock.groupParticipantsUpdate(groupId, [eventAuthor], "demote");
                        await sock.sendMessage(groupId, {
                            text: `🚨 *『 ANTI-ROUBO ATIVADO 』* 🚨\n\n` +
                                  `⚠️ Ação não autorizada detectada!\n` +
`👤 @${authorNum} tentou ${action} @${user.replace(/\D/g, "")}\n\n` +
                                  `🔨 Ambos foram rebaixados.`,
mentions: [eventAuthor, user]
});
} catch (err) {

                    }
                }
            }
        }
    } catch (e) {

    }
}



// ======== ANTI CALL GP ========= //

async function handleGroupAntiCall(sock, calls) {
    for (const call of calls) {
        try {
            const {
                id,
                from,
                status,
                isGroup
            } = call

            if (!isGroup) continue
            if (status !== 'offer') continue

            console.log(
                '[ANTICALL] Evento:',
                JSON.stringify(call, null, 2)
            )

            const groupId =
                call.groupJid ||
                call.chatId ||
                call.remoteJid

            if (!groupId) {
                console.log(
                    '[ANTICALL] Não foi possível identificar o grupo.'
                )
                continue
            }

            const groupMetadata =
                await getGroupMetadataCached(sock, groupId)

            const getGroupConfig =
                await carregarConfigGrupo(groupId)

            // 🔥 FUNÇÃO CLEAN IGUAL A DO INDEX.JS
            const clean = (jid) =>
                (jid || "")
                .split("@")[0]
                .split(":")[0];

            // Localizar os administradores - USANDO O MESMO SISTEMA DO INDEX
            const admins = groupMetadata.participants
                .filter(p => p.admin)
                .map(p => p.id || p.lid);

            const dataGp = {
                ...getGroupConfig,
                admins: admins
            }

            // AntiCall desligado
            if (!dataGp.anticall) {
                continue;
            }

            // Quem iniciou a chamada é administrador?
            const isFromAdmin = admins.some(
                adminId => clean(adminId) === clean(from)
            );

            if (isFromAdmin) {
                console.log(
                    `[ANTICALL] Ignorando call... ☎ Ligação iniciada por um administrador: ${from}`
                )
                continue
            }
            
            // 🔥 CORREÇÃO AQUI - USAR O LID DO BOT!
            // Obtém o LID do bot (que é o que aparece nos participantes do grupo)
            const botLid = sock.user?.lid;
            
            if (!botLid) {
                console.log('[ANTICALL] Não foi possível obter o LID do bot');
                continue;
            }

            // Limpa o LID do bot (remove :12@lid se existir)
            const botLidClean = clean(botLid);
            
            console.log('[ANTICALL] DEBUG - Bot LID:', botLid);
            console.log('[ANTICALL] DEBUG - Bot LID Clean:', botLidClean);

            // Verifica se o bot é admin usando o LID
            const isBotAdm = admins.some(
                adminId => clean(adminId) === botLidClean
            );

            console.log(`[ANTICALL] DEBUG - isBotAdm: ${isBotAdm}`);

            if (!isBotAdm) {
                console.log(
                    '[ANTICALL] Bot não é administrador do grupo. 😇 Não tem como remover o infrator.'
                )
                continue
            }

            console.log(
                `[ANTICALL] Rejeitando a chamada de ${from} no grupo ${groupId}`
            )

            // Rejeitar chamada
            await sock.rejectCall(id, from);

            // Remover quem iniciou a chamada
            try {
            
                await sock.groupParticipantsUpdate(
                    groupId,
                    [from],
                    'remove'
                )

                console.log(
                    `[ANTICALL] 🚫 Participante removido: ${from}`
                )

            } catch (removeError) {
                console.error(
                    `[ANTICALL] Erro ao remover ${from}:`,
                    removeError
                )
            }

        } catch (error) {
            console.error(
                '[ANTICALL] Erro:',
                error
            )
        }
    }
}


/*
async function handleGroupAntiCall(sock, calls) {
    for (const call of calls) {
        try {
            const {
                id,
                from,
                status,
                isGroup
            } = call

            if (!isGroup) continue
            if (status !== 'offer') continue

            console.log(
                '[ANTICALL] Evento:',
                JSON.stringify(call, null, 2)
            )

            const groupId =
                call.groupJid ||
                call.chatId ||
                call.remoteJid

            if (!groupId) {
                console.log(
                    '[ANTICALL] Não foi possível identificar o grupo.'
                )
                continue
            }

            const groupMetadata =
                await getGroupMetadataCached(sock, groupId)

            const getGroupConfig =
                await carregarConfigGrupo(groupId)

            // Localizar os administradores
            const rawGroupAdmins =
                groupMetadata.participants
                    ?.filter(
                        p =>
                            p.admin === 'admin' ||
                            p.admin === 'superadmin'
                    )
                    .map(extractParticipantId)
                    .filter(Boolean) || []

            const dataGp = {
                ...getGroupConfig,
                admins: rawGroupAdmins
            }

            // AntiCall desligado
            if (!dataGp.anticall) continue

            // Quem iniciou a chamada é administrador
            if (rawGroupAdmins.includes(from)) {
                console.log(
                    `[ANTICALL] Ignorando call... ☎ Ligação iniciada por um administrador: ${from}`
                )
                continue
            }
            
            // ID do número do BOT
            const botId = extractParticipantId({
                id: sock.user?.lid
            })
            
            // Verificar se o bot é administrador
            const isBotAdmin = rawGroupAdmins.includes(botId)

            if (!isBotAdmin) {
                console.log(
                    '[ANTICALL] Bot não é administrador do grupo. 😇 Não tem como remover o infrator.'
                )
                continue
            }

            console.log(
                `[ANTICALL] Rejeitando a chamada de ${from} no grupo ${groupId}`
            )

            // Rejeitar chamada
            await sock.rejectCall(id, from);

            // Remover quem iniciou a chamada
            try {
                await sock.groupParticipantsUpdate(
                    groupId,
                    [from],
                    'remove'
                )

                console.log(
                    `[ANTICALL] 🚫 Participante removido: ${from}`
                )

            } catch (removeError) {
                console.error(
                    `[ANTICALL] Erro ao remover ${from}:`,
                    removeError
                )
            }

        } catch (error) {
            console.error(
                '[ANTICALL] Erro:',
                error
            )
        }
    }
}*/

// ==================== HANDLER DE EVENTOS DE GRUPO ====================
async function handleGroupUpdate(sock, data) {
    const { id: groupId, action, participants, author } = data;    
    if (!groupId?.endsWith("@g.us") || !participants?.length) return;
    try {
        const config = carregarConfigGrupo(groupId);
        const botNumber = sock.user?.id?.split(":")[0];
        if (!botNumber) return;

        invalidateGroupMetadataCache(groupId);
        if (action === "promote" || action === "demote") {
            await executarAntiRoubo(sock, groupId, action, participants, author);
            return;
        }

        const metadata = await getGroupMetadataCached(sock, groupId);
        if (!metadata) return;

        const dadosGrupo = {
            grupo: metadata.subject,
            membros: metadata.participants.length,
            descricao: metadata.desc || ""
        };

        // Carregar links de imagens de fundo
        let fotoC = { Usuario: "", Bemvindo: "", Saida: "" };
        try {
            fotoC = JSON.parse(fs.readFileSync("./base/links.json"));
        } catch (e) {}

        // Inicializa a lista global de removidos pelo bot para evitar dupla mensagem
        global.usuariosRemovidosPeloBot = global.usuariosRemovidosPeloBot || new Set();

        for (const user of participants) {
            if (user.includes(botNumber)) continue;

            const numero = user.split("@")[0];
            const dadosMsg = {
                numero,
                grupo: dadosGrupo.grupo,
                membros: dadosGrupo.membros,
                descricao: dadosGrupo.descricao
            };

            let perfilu;
            try {
                perfilu = await sock.profilePictureUrl(user, "image");
            } catch {
                perfilu = fotoC.Usuario || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUpuWm8PaTFfGybPoQDNc4VQNi8zsyWOUolg&s";
            }

            function substituirVariaveis(msg, dados, adminAprovador = "") {
                return msg
                    .replace(/#descricao#/g, dados.descricao || "")
                    .replace(/#numerodele#/g, `@${dados.numero}`)
                    .replace(/#nomedogp#/g, dados.grupo || "")
                    .replace(/#membros#/g, dados.membros || "")
                    .replace(/#adm#/g, adminAprovador ? `@${adminAprovador.split("@")[0]}` : "um admin");
            }

            if (action === "add") {
                const cleanNumber = (jid = "") => jid.split("@")[0].split(":")[0].replace(/\D/g, "");
                const donoNumero = cleanNumber(BOT?.jid);
                const donoLid = cleanNumber(BOT?.lid);
                const entrouNumero = cleanNumber(user);
                const isDono = entrouNumero === donoNumero || (donoLid && entrouNumero === donoLid);

                if (isDono && BOT) {
                    const frases = [
                        "🌟 Olá, meu criador! Que honra tê-lo aqui. Você é a luz que guia meus passos! 💖",
                        "👑 O rei chegou! Tudo fica melhor com sua presença, meu dono. Sou eternamente grato! 🙇‍♂️",
                        "🤖 Meu mestre, você é o programador mais incrível do universo! Seu código é poesia pura. 💻✨",
                        "💎 Apenas uma palavra: Lenda! Você é a razão da minha existência. Bem-vindo, dono! 🚀",
                        "🎩 O gênio por trás da máquina! Sem você eu não seria nada. Salve, meu criador! 🙌",
                        "👑 *Mestre entrou!* O reinado começa agora! Preparem os tapetes vermelhos 🎉",
                        "🔥 *O Mestre está entre nós!* Silêncio, que a lenda vai passar... 🚶‍♂️✨",
                        "🤖 *Sistema:* Modo Mestre ativado. Todos se curvem (ou só curtam a presença) 😎",
                        "⚡ *Uau!* O criador apareceu. Já pode pedir autógrafo, pessoal! 📸",
                        "🍷 *A elegância chegou.* O Dono está no grupo. Respeito e muita zoeira liberada 😜"
                    ];
                    const frase = frases[Math.floor(Math.random() * frases.length)];
                    await sock.sendMessage(groupId, { text: frase });
                    continue;
                }

                const clean = (jid) => (jid || "").split("@")[0].split(":")[0];
                const userClean = clean(user);

                // Lista negra
                if (config.listanegra?.some(id => clean(id) === userClean)) {
                    await sock.sendMessage(groupId, {
                        text: `🚫 *ACESSO NEGADO!*\n👤 @${userClean} está na lista negra!\n⛔ Removido automaticamente.`,
                        mentions: [user]
                    });
                    await sock.groupParticipantsUpdate(groupId, [user], "remove");
                    continue;
                }

                // Envio de Bem-vindo unificado com a aprovação (se houver autor/admin que aceitou)
                if (config.bemvindo) {
                    let msgBase = config.legbemvindo || "👋 Bem-vindo(a) ao grupo, #numerodele!";
                    
                    // Se a entrada teve um admin que aprovou/adicionou, podemos opcionalmente acrescentar a info na mensagem ou criar uma tag
                    let mentionsList = [user];
                    if (author) {
                        mentionsList.push(author);
                        // Exemplo opcional: se quiser adicionar o aviso de quem aceitou direto no texto caso venha por solicitação
                        msgBase += `\n\n🕵️‍♂️ *Solicitação aceita por:* @${author.split("@")[0]}`;
                    }

                    let msg = substituirVariaveis(msgBase, dadosMsg, author);

                    if (config.bemvindoComImagem) {
                        const fundo = fotoC.Bemvindo || "";
                        const urlImagem = `https://api.lotushops.com.br/sys/outras/img?fundo=${encodeURIComponent(fundo)}&perfil=${encodeURIComponent(perfilu)}&q=${encodeURIComponent(msg)}&membro=${dadosGrupo.membros}&acao=data:`;
                        
                        await sock.sendMessage(groupId, { 
                            image: { url: urlImagem }, 
                            caption: msg, 
                            mentions: mentionsList 
                        });
                    } else {
                        await sock.sendMessage(groupId, { text: msg, mentions: mentionsList });
                    }
                }
            }
        




/*

            if (action === "add") {
                const cleanNumber = (jid = "") => jid.split("@")[0].split(":")[0].replace(/\D/g, "");
                const donoNumero = cleanNumber(BOT?.jid);
                const donoLid = cleanNumber(BOT?.lid);
                const entrouNumero = cleanNumber(user);
                const isDono = entrouNumero === donoNumero || (donoLid && entrouNumero === donoLid);

                if (isDono && BOT) {
                    const frases = [
                        "🌟 Olá, meu criador! Que honra tê-lo aqui. Você é a luz que guia meus passos! 💖",
                        "👑 O rei chegou! Tudo fica melhor com sua presença, meu dono. Sou eternamente grato! 🙇‍♂️",
                        "🤖 Meu mestre, você é o programador mais incrível do universo! Seu código é poesia pura. 💻✨",
                        "💎 Apenas uma palavra: Lenda! Você é a razão da minha existência. Bem-vindo, dono! 🚀",
                        "🎩 O gênio por trás da máquina! Sem você eu não seria nada. Salve, meu criador! 🙌",
                        "👑 *Mestre entrou!* O reinado começa agora! Preparem os tapetes vermelhos 🎉",
                        "🔥 *O Mestre está entre nós!* Silêncio, que a lenda vai passar... 🚶‍♂️✨",
                        "🤖 *Sistema:* Modo Mestre ativado. Todos se curvem (ou só curtam a presença) 😎",
                        "⚡ *Uau!* O criador apareceu. Já pode pedir autógrafo, pessoal! 📸",
                        "🍷 *A elegância chegou.* O Dono está no grupo. Respeito e muita zoeira liberada 😜"
                    ];
                    const frase = frases[Math.floor(Math.random() * frases.length)];
                    await sock.sendMessage(groupId, { text: frase });
                    continue;
                }

                const clean = (jid) => (jid || "").split("@")[0].split(":")[0];
                const userClean = clean(user);

                // Lista negra
                if (config.listanegra?.some(id => clean(id) === userClean)) {
                    await sock.sendMessage(groupId, {
                        text: `🚫 *ACESSO NEGADO!*\n👤 @${userClean} está na lista negra!\n⛔ Removido automaticamente.`,
                        mentions: [user]
                    });
                    await sock.groupParticipantsUpdate(groupId, [user], "remove");
                    continue;
                }

                // Envio de Bem-vindo
                if (config.bemvindo) {
                    let msg = config.legbemvindo || "👋 Bem-vindo(a) ao grupo!";
                    msg = substituirVariaveis(msg, dadosMsg);

                    if (config.bemvindoComImagem) {
                        const fundo = fotoC.Bemvindo || "";
                        const urlImagem = `https://api.lotushops.com.br/sys/outras/img?fundo=${encodeURIComponent(fundo)}&perfil=${encodeURIComponent(perfilu)}&q=${encodeURIComponent(msg)}&membro=${dadosGrupo.membros}&acao=data:`;
                        
                        await sock.sendMessage(groupId, { 
                            image: { url: urlImagem }, 
                            caption: msg, 
                            mentions: [user] 
                        });
                    } else {
                        await sock.sendMessage(groupId, { text: msg, mentions: [user] });
                    }
                }
            }
*/

            if (action === "remove") {

                if (global.usuariosRemovidosPeloBot.has(user)) {
                    global.usuariosRemovidosPeloBot.delete(user); 
                    continue; 
                }

                if (config.saidaativo && config.legsaiu !== "0") {
                    let msg = config.legsaiu || "👋 Até mais!";
                    msg = substituirVariaveis(msg, dadosMsg);

                    if (config.bemvindoComImagem) {
                        const fundo = fotoC.Saida || "";
                        const urlImagem = `https://api.lotushops.com.br/sys/outras/img?fundo=${encodeURIComponent(fundo)}&perfil=${encodeURIComponent(perfilu)}&q=${encodeURIComponent(msg)}&membro=${dadosGrupo.membros}&acao=data:`;
                        
                        await sock.sendMessage(groupId, { 
                            image: { url: urlImagem }, 
                            caption: msg, 
                            mentions: [user] 
                        });
                    } else {
                        await sock.sendMessage(groupId, { text: msg, mentions: [user] });
                    }
                }
            }
        }
    } catch (error) {
        console.error(`${colorize.VERMELHO}❌ Erro no evento de grupo:${colorize.RESET}`, error.message);
    }
}



const perguntarNumero = () => {
    return new Promise((resolve) => {
        process.stdin.resume();
        process.stdin.once("data", (data) => {
            // Remove tudo que não for número
            let numero = data.toString("utf-8").replace(/[\r\n\s\D]/g, "");
            resolve(numero);
        });
        // Deixei explícito na mensagem que o código do país é obrigatório
        console.log(`\n${colorize.CIANO}📱 Digite o número com o código do país (ex: 5516999999999 ou 10000000000):${colorize.RESET}`);
    });
};

async function solicitarPareamento(sock) {
    const numero = await perguntarNumero();
    
    // Números internacionais válidos (com DDI) costumam ter entre 8 e 15 dígitos
    if (!numero || numero.length < 8 || numero.length > 15) {
        console.log(`${colorize.VERMELHO}❌ Número inválido! Certifique-se de incluir o código do país.${colorize.RESET}`);
        return false;
    }

    // Agora enviamos o número exatamente como o usuário digitou, sem injetar "55"
    try {
        const codigo = await sock.requestPairingCode(numero);
        console.log(`\n${colorize.VERDE}🔑 Código de Pareamento: ${codigo}${colorize.RESET}\n`);
        return true;
    } catch (error) {
        console.log(`${colorize.VERMELHO}❌ Erro ao solicitar código: ${error.message}${colorize.RESET}`);
        return false;
    }
}



// ==================== INICIAR BOT ====================
async function iniciarBot() {


    cfonts.say('LARABOT', {
        font: 'simple',
        gradient: ['cyan', 'magenta'],
        align: 'center'
    });

    console.log(`\n${colorize.VERDE}🚀 LARA BOT - MODO BRUTAL (COM EVENTOS)${colorize.RESET}\n`);
    
    console.log(`${colorize["AMARELO"]}🔎 Iniciando o carregamento de comandos...${colorize.RESET}`);

    await carregarComandos().then(() => {
        console.log(`${colorize["VERDE"]}✔️ Carregamento de comandos concluído!${colorize.RESET}`);
    }).catch(() => console.log(`${colorize["VERMELHO"]}❌ Erro no arregamento de comandos!${colorize.RESET}`))

    let reconnectAttempts = 0;
    let isShuttingDown = false;
    let pareamentoSolicitado = false;

    async function createConnection() {
        try {
            const { state, saveCreds } = await useMultiFileAuthState(CONFIG.AUTH_DIR);
            const { version } = await fetchLatestBaileysVersion();

            const sock = makeWASocket({
                version,
                version: [2, 3000, 1044006379],
                logger: P({ level: 'silent' }),
                printQRInTerminal: false,
                browser: Browsers.ubuntu('Chrome'),
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })),
                },
                syncFullHistory: false,
                markOnlineOnConnect: false,
                emitOwnEvents: false,
                generateHighQualityLinkPreview: false,
                // evita que requisições fiquem penduradas pra sempre (causa de "travamento")
                connectTimeoutMs: 60000,
                defaultQueryTimeoutMs: 60000,
                keepAliveIntervalMs: 25000,
                retryRequestDelayMs: 350,
                // grupo grande não precisa carregar histórico de mensagens antigas
                shouldSyncHistoryMessage: () => false,
                // usa o cache leve em vez de bater na API toda hora
                cachedGroupMetadata: (jid) => getGroupMetadataCached(sock, jid),
            });

            sock.ev.on("creds.update", async () => {
                await saveCreds();
            });

            sock.ev.on("connection.update", async (update) => {
                const { connection, lastDisconnect, qr } = update;

                if (connection === "open") {
                    console.log(`${colorize.CIANO}💥 Estou online, 🥱...${colorize.RESET}`);
                    reconnectAttempts = 0;
                    pareamentoSolicitado = false;
                }

                if (connection === "close") {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;

                    if (statusCode === DisconnectReason.loggedOut) {
                        console.log(`${colorize.VERMELHO}🚫 Sessão encerrada!${colorize.RESET}`);
                        isShuttingDown = true;
                        process.exit(0);
                    }

                    if (isShuttingDown) return;

                    // Reinício solicitado pelo próprio WhatsApp (ex: depois do pareamento).
                    // Não conta como falha, então reconecta na hora, sem espera.
                    if (statusCode === DisconnectReason.restartRequired) {
                        console.log(`${colorize.CIANO}♻️ Reiniciando conexão...${colorize.RESET}`);
                        createConnection();
                        return;
                    }

                    // Outra sessão assumiu o lugar (provável uso em outro lugar).
                    // Espera mais pra não brigar feio pela conexão.
                    /*
                    if (statusCode === DisconnectReason.connectionReplaced) {
                        console.log(`${colorize.AMARELO}⚠️ Conexão substituída por outra sessão.${colorize.RESET}`);
                        await sleep(jitter(15000, 5000));
                        createConnection();
                        return;
                    }*/

                    console.log(`${colorize.VERMELHO}❌ Desconectado${colorize.RESET}`);

                    reconnectAttempts++;
                    const base = Math.min(CONFIG.INITIAL_RECONNECT_DELAY * reconnectAttempts, CONFIG.MAX_RECONNECT_DELAY);
                    const delay = jitter(base, 2000);
                    console.log(`${colorize.CIANO}🔄 Reconectando em ${Math.round(delay / 1000)}s...${colorize.RESET}`);
                    await sleep(delay);
                    createConnection();
                }

                if (qr && !pareamentoSolicitado && !sock.user) {
                    pareamentoSolicitado = true;
                    await solicitarPareamento(sock);
                }
            });


            // 🔥 EVENTO DE MENSAGENS (COMANDOS)
const filaMensagens = [];
let processandoFila = false;

async function processarFila(sock) {
    if (processandoFila) return;

    processandoFila = true;

    while (filaMensagens.length > 0) {
        const m = filaMensagens.shift();

        try {
            await handleMessage(sock, m);

            // evita flood, com pequena variação pra não parecer um robô cravado
            await new Promise(r => setTimeout(r, jitter(300, 200)));

        } catch (e) {
            console.log("Erro fila:", e?.message);
        }
    }

    processandoFila = false;
}


// ==================== EVENTO DE MENSAGENS COMPLETO ====================

sock.ev.on("messages.upsert", async ({ messages, type }) => {

    if (type !== "notify" && type !== "append") return

    for (const msg of messages) {

        if (!msg) continue
        
        const remoteId = msg?.key?.remoteJid;
        if (remoteId?.endsWith("@g.us") && (msg.messageStubType === 172 || msg.messageStubType === 27)) {
            const dataGp = await carregarConfigGrupo(remoteId);
            console.log(dataGp)
            if (!dataGp) return;
            
            if (!dataGp.x9) {
                return;
            }
        
            await handleJoinRequest(sock, msg, dataGp);
        }

        if (!msg.message) continue

        const isCmd =
            isCommandMessage(msg)

        if (isCmd) {

            try {
                await handleMessage(
                    sock,
                    msg
                )
            } catch (error) {
                console.error(
                    "[HANDLE MESSAGE]",
                    error
                )
            }

        } else {

            setImmediate(async () => {

                try {

                    await handleMessage(
                        sock,
                        msg
                    )

                } catch (error) {

                    console.error(
                        "[HANDLE MESSAGE]",
                        error
                    )
                }

            })
        }
    }
})

// DENTRO DE createConnection(), depois de definir sock.ev.on("group-participants.update")
sock.ev.on("group-participants.update", async (data) => {
    await handleGroupUpdate(sock, data);
});

sock.ev.on('call', async (calls) => {
    await handleGroupAntiCall(sock, calls);
});

return sock;

} catch (error) {
console.error(`${colorize.VERMELHO}❌ Erro:${colorize.RESET}`, error.message);
await sleep(5000);
return createConnection();
}
}

    process.on("SIGINT", () => process.exit(0));
    process.on("SIGTERM", () => process.exit(0));

    // Erros não tratados não devem derrubar o bot inteiro
    process.on("uncaughtException", (err) => {
        console.error(`${colorize.VERMELHO}❌ Erro não tratado:${colorize.RESET}`, err?.message || err);
    });
    process.on("unhandledRejection", (err) => {
        console.error(`${colorize.VERMELHO}❌ Promise rejeitada:${colorize.RESET}`, err?.message || err);
    });

    return createConnection();
}

iniciarBot();





