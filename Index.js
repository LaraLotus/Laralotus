//========= LARA-BOT OFICIAL ==========//
import {
    downloadContentFromMessage,
    getContentType
} from "@whiskeysockets/baileys";
import fs from "fs";

import fetch from "node-fetch";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

import axios from "axios";
import FormData from "form-data";

import { upload } from "./base/upload.js";
import { comandosInfo } from "./base/comandosInfo.js";
import tabela from './base/tabela.js'
import { sendMediaAsSticker, renomearSticker, updateStickerMetadata, WebP_GIF } from "./base/sticker.js";

const tictactoe = (await import(new URL('./base/tictactoe.js', import.meta.url)));
const hangman = (await import(new URL('./base/hangman.js', import.meta.url)));
const guessMyNumber = (await import(new URL('./base/guessmynumber.js', import.meta.url)));
const vabJson = JSON.parse(await fs.readFileSync(new URL("./base/json/vab.json", import.meta.url), "utf8"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsok = await import(`./base/menus.js`);
//======Lara parar em gp======//
global.db = global.db || {};
global.db.groups = global.db.groups || {};
//==========================≈=======//
function getGroup(id) {
if (!global.db.groups[id]) {
global.db.groups[id] = {
lara: true, // padrão ligado
};
}
return global.db.groups[id];
}
// ================= EXEC =================//
const execPromise = (cmd) =>
new Promise((resolve, reject) => {
exec(cmd, (err) => {
if (err) reject(err);
else resolve();
});
});

const getUserName = (userId) => {
    if (!userId || typeof userId !== 'string') return 'unknown';
    if (userId.includes('@lid')) {
        return userId.split('@')[0];
    } else if (userId.includes('@s.whatsapp.net')) {
        return userId.split('@')[0];
    }
    return userId.split('@')[0] || userId;
};

// ================= MENSAGENS =================//
const frasesPorTipo = {
    soAdm: [
        "😎 Cê acha que é adm? Tenta de novo, amigão.",
        "🫵 Comando blindado: só quem tem chave de ouro (ou seja, adm).", 
        "🤣 Os outros podem até pedir, mas vão levar um 'não' mais educado que minha avó."
    ],
    soDono: [
        "👑 Esse é nível super sayajin 3 – só o criador da bagaça.",
        "🎮 Quer usar? Compra o bot primeiro (spoiler: não está à venda).",
        "😭 Os meros mortais só podem olhar e chorar no banho."
    ],
    soGrupo: [
        "👥 Isso aqui não funciona em conversa de dois, flor.",
        "🏠 No PV eu sou uma planta decorativa. No grupo viro palhaço profissional.",
        "📢 Vai pro grupo, seu tímido! Aqui não é consultório psicológico."
    ],
    erro: [
        "💥 Deu pane seca no código. Tenta de novo quando o bot voltar da cervejada.",
        "🐞 O erro é tipo barata assustada – aparece do nada e some depois do café.",
        "🤯 Se insistir, o bot vai entrar em greve e pedir aumento."
    ],
    soAdmOuDono: [
        "🛡️ Só dois tipos de pessoa: quem manda (adm/dono) e quem obedece (você).",
        "🎩 Esse comando é tipo camarote no show da Madonna – precisa de pulseira vip.",
        "🧠 Se não é adm nem dono, sugiro tentar a sorte no jogo do bicho."
    ],
    botadm: [
        "🤖 Me dá adm, seu mão de vaca! Senão vou começar a responder tudo com 'au au'.",
        "🔧 Sem adm eu viro um peso de papel digital. Quer testar?",
        "🗣️ Dá logo o cargo ou vou spam 'lula molusco' até você render."
    ]
};

// Controla qual índice será usado na próxima vez para cada tipo
let indices = {
  soAdm: 0,
  soDono: 0,
  soGrupo: 0,
  erro: 0,
  soAdmOuDono: 0,
  botadm: 0
};

// Proxy que retorna a próxima frase (sequencial) cada vez que a propriedade é acessada
export const msgs = new Proxy({}, {
get(target, prop) {
if (frasesPorTipo[prop]) {
const lista = frasesPorTipo[prop];
const indiceAtual = indices[prop];
indices[prop] = (indiceAtual + 1) % lista.length;
return lista[indiceAtual];
}
return undefined;
  }
});

// ===== CONFIG JS NAO MEXER ============ //
const fotoC = JSON.parse(fs.readFileSync("./base/links.json"));
const version = JSON.parse(fs.readFileSync("./package.json"));
const conS = JSON.parse(fs.readFileSync("./base/json/conselhos.json"));

// ================= DATABASE =================//
const dbPath = "./base/json/database.json";
let db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : {};
const saveDB = () => {
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

// == LIMPEZA AUTOMÁTICA DE INFRAÇÕES ======== //
const limparInfracoesAntigas = () => {
const agora = Date.now();
const umaSemana = 7 * 24 * 60 * 60 * 1000; // 7 dias
for (const key in db) {
if (key.startsWith("infracoes_")) {
for (const usuario in db[key]) {
if (agora - db[key][usuario].data > umaSemana) {
delete db[key][usuario];
}}
if (Object.keys(db[key]).length === 0) {
delete db[key];}}}
saveDB();
};

const getGroupPath = (jid) => `./lara/chats/${jid}.json`;
const loadGroup = (jid) => {
const path = getGroupPath(jid);
if (!fs.existsSync(path)) return {
    nomegp: "",
    autofigu: false,
    antilink: false,
    antilinkgp: false,
    antidoc: false,
    antiloc: false,
    antisticker: false,
    ativo: false,
    anticontato: false,
    antistatus: false,
    antiaudio: false,
    antivideo: false,
    antiimg: false,
    antienquete: false,
    anticallgp: false,
    bemvindo: false,
    saidaativo: true,
    x9: false,
    soadm: false,
    autorepo: false,
    modobrincadeira: false,
    escudo: false,    
    simih: false,
    listanegra: [],
    lista: [],
    mute: [],
    antipv: false,
    bemvindoComImagem: false,

    legbemvindo: `👋 Olá, tudo bem? @#numerodele#\n\n🎉 Bem-vindo(a) ao nosso grupo! #nomedogp#\n\n📜 Leia as regras com atenção e evite remoção.\n\n✨ Boa estadia!`,

      legsaiu: "0"
  };
  return JSON.parse(fs.readFileSync(path));
};


const saveGroup = (jid, data) => {
const path = getGroupPath(jid);
fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

// ===============BOT ID (LID)==================//
const obterLidDoBot = async (lara) => {
if (BOT_ID) return BOT_ID;
const botId = lara.user.id.split(":")[0];
const jid = botId.includes("@lid")
? botId
: botId + "@s.whatsapp.net";
try {
const res = await lara.onWhatsApp(jid);
BOT_ID = res?.[0]?.lid || res?.[0]?.jid || res?.[0]?.id || jid;
} catch {
BOT_ID = jid;
}
return BOT_ID;
};

// ================= FETCH =================//
const fetchJson = async (url) => {
    const res = await fetch(url);
    
    return res.json();
};
let BOT_ID = null;

// ================= EXECUTAR=================//
export default async function executar(ctx) {
const { lara, m } = ctx;



// ========== VERIFICAÇÕES MÍNIMAS ==========//
if (!m || !m.key) return;
if (m.messageStubType) return;  
if (m.key.fromMe) return; 

const jid = m.key.remoteJid;

// SÓ BLOQUEIA reactionMessage
if (m.message?.reactionMessage) return;

// 🔥 NÃO BLOQUEIA MAIS NADA - DEIXA TUDO PASSAR
// REMOVIDO: if (jid === "status@broadcast") return;
// REMOVIDO: if (jid?.includes("broadcast")) return;
// REMOVIDO: if (m.message?.protocolMessage && ...) return;

// CONTINUA O FLUXO
const from = m.key?.remoteJid || "";
const isGroup = from.endsWith("@g.us");
let group = isGroup ? loadGroup(from) : null;
const sender = m.key?.participant || m.key?.remoteJid || "0@s.whatsapp.net";
const pushName = m.pushName || "Usuário";



// ========== CONTINUAÇÃO DO SEU CÓDIGO ==========//
// ... TODO O RESTO DO SEU CÓDIGO AQUI ...



const isDonoSec = global.donos && global.donos.includes(sender);
const getBody = (m) => m.message?.conversation || m.message?.extendedTextMessage?.text || m.message?.imageMessage?.caption || m.message?.videoMessage?.caption || "";

const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
const larastist = JSON.parse(fs.readFileSync("./lara/lara.json"));

let prefix = larastist.prefixo;
const laradona = larastist.laradona;
const larabot = larastist.larabot;
const laranumero = larastist.laranumero;
const laralid = larastist.laralid;
const larakey = larastist.larakey;
const laralotus = larastist.laralotus;
const fopm = JSON.parse(fs.readFileSync("./base/links.json"));
const logo = fopm.logo;
const body = getBody(m) || "";
const budy = body;
const budy2 = body.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const isCmd = budy.startsWith(prefix);
const full = isCmd ? budy.slice(prefix.length) : "";
const hasLeadingSpace = full.startsWith(' ');
const args = (isCmd && !hasLeadingSpace) ? full.trim().split(/ +/).slice(1) : [];
const command = (isCmd && !hasLeadingSpace) ? full.trim().split(/ +/)[0]?.toLowerCase() : "";
const q = args.join(" ");
const obterLidDoBot = async (lara) => {
if (BOT_ID) return BOT_ID;
const botId = lara.user.id.split(":")[0];
const jid = botId.includes("@lid")
? botId
: botId + "@s.whatsapp.net";
try {
const res = await lara.onWhatsApp(jid);
BOT_ID = res?.[0]?.lid || res?.[0]?.jid || res?.[0]?.id || jid; } catch { BOT_ID = jid; }
return BOT_ID;
};

// ================= DONOS =================//
const numeroDono = String(laranumero);
const Dono = numeroDono + "@s.whatsapp.net";
const lidDono = laralid;
const infobot = await obterLidDoBot(lara);
const isDono =
sender === Dono ||
sender === lidDono ||
sender === infobot;

// ================= GRUPO =================//
let metadata = null;
let participants = [];
let admins = [];

let isAdmin = false;
let isGroupAdmin = false;
let isBotAdm = false;
let isSoadm = false;

const clean = (jid) =>
(jid || "")
.split("@")[0]
.split(":")[0];

if (isGroup) {

try {

metadata = await lara.groupMetadata(from);

participants =
metadata?.participants || [];

admins = participants
.filter(p => p.admin)
.map(p => p.id || p.lid);

isAdmin = admins.some(
id => clean(id) === clean(sender)
);

isGroupAdmin = isAdmin;

isBotAdm = admins.some(
id => clean(id) === clean(infobot)
);

isSoadm = admins.some(
id => clean(id) === clean(sender)
);

if ( !group.nomegp || group.nomegp !== metadata.subject ) { group.nomegp = metadata.subject; saveGroup(from, group);}
} catch (e) {
}

}

const menc_prt = m.message?.extendedTextMessage?.contextInfo?.participant;

        const menc_jid2 = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const menc_os2 = (menc_jid2 && menc_jid2.length > 0) ? menc_jid2[0] : menc_prt;
        const sender_ou_n = (menc_jid2 && menc_jid2.length > 0) ? menc_jid2[0] : menc_prt || sender;

// ================= CONTADOR =================//
if (isGroup) {
const botNumber = (lara.user?.id || "").split(":")[0];
if (sender.includes(botNumber)) return;
if (sender === from) return;
const chatId = from.trim();
if (!db[chatId]) db[chatId] = {};
if (!db[chatId][sender]) {
db[chatId][sender] = {
mensagens: 0,
comandos: 0,
figurinhas: 0
}
}
db[chatId][sender].mensagens++;
if (m.message?.stickerMessage) {
db[chatId][sender].figurinhas++; 
}

if (isCmd) {
db[chatId][sender].comandos++ }
saveDB();
}

let quotedMessageContent = null;
        if ((getContentType(m.message)) === 'extendedTextMessage' && m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            quotedMessageContent = m.message.extendedTextMessage.contextInfo.quotedMessage;
        }
        const isQuotedMsg = !!quotedMessageContent?.conversation;
        const isQuotedMsg2 = !!quotedMessageContent?.extendedTextMessage?.text;
        const isQuotedImage = !!quotedMessageContent?.imageMessage;
        const isQuotedVisuU = !!quotedMessageContent?.viewOnceMessage;
        const isQuotedVisuU2 = !!quotedMessageContent?.viewOnceMessageV2;
        const isQuotedVideo = !!quotedMessageContent?.videoMessage;
        const isQuotedDocument = !!quotedMessageContent?.documentMessage;
        const isQuotedDocW = !!quotedMessageContent?.documentWithCaptionMessage;
        const isQuotedAudio = !!quotedMessageContent?.audioMessage;
        const isQuotedSticker = !!quotedMessageContent?.stickerMessage;
        const isQuotedContact = !!quotedMessageContent?.contactMessage;
        const isQuotedLocation = !!quotedMessageContent?.locationMessage;
        const isQuotedProduct = !!quotedMessageContent?.productMessage;

// ================= HELPERS =================//
const enviar = async (txt) => {
await lara.sendMessage(from, { text: txt }, { quoted: m });
};
const react = async (emoji) => {
await lara.sendMessage(from, { react: { text: emoji, key: m.key } });};

//============= HANDELER ================//
const groupData = getGroup(from);
if (groupData?.lara === false && !isDono) {
return;
}

// ========= PREFIX DETECTOR ============//
if (body && body.trim() === prefix) {

const mensagens = [
`👽 *Olá terráqueo!* Você digitou só o prefixo 😄

📌 Use: *${prefix}menu* para ver os comandos.`,

`🤖 *Fala comigo direito!* 😅

📋 Exemplo: *${prefix}menu*
⚡ Assim você vê tudo que posso fazer!`,

`🚀 *Ei! Você esqueceu o comando!* 😎

💡 Digite: *${prefix}menu* para começar a diversão!`
];

const aleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];

await enviar(aleatoria);
return;
}

// ============= MODO BRINCADEIRA ================//

// nao sei pra que esso  ser for útil ver se funciona ae vc
/*
if (isGroup && db[from]?.config?.brincadeira) {
const txt = budy2;
const respostas = {
    "oi": ["Oi 😄", "Fala comigo 😏", "Oi sumido 👀"],
    "bom dia": ["Bom dia ☀️", "Acordou cedo hein 😴", "Bom diaaaa 😍"],
    "boa noite": ["Boa noite 🌙", "Vai dormir já? 😏", "Sonha comigo 😌"],
    "kkk": ["Tá rindo de quê? 🤨", "Engraçado né 😂", "kkkkk 😆"],
    "te amo": ["Eu também 😳❤️", "Calma emocionado 😏", "Só amizade 😌"],
    "bot": ["Oi, sou a Lara 🤖", "Chamou? 😎", "Tô online 🔥"]
  };
for (let palavra in respostas) {
if (txt.includes(palavra)) {
const lista = respostas[palavra];
const resposta = lista[Math.floor(Math.random() * lista.length)];
await enviar(resposta);
break;
}
}
}*/

// ==== AUTORRESPOSTA COM JSON (Resposta.json) ====
if (isGroup && group?.autorepo) {
const txt = budy2;
try {
const respostas = JSON.parse(fs.readFileSync('./base/resposta.json', 'utf8'));
for (let palavra in respostas) {
if (txt.includes(palavra)) {
const lista = respostas[palavra];
const resposta = lista[Math.floor(Math.random() * lista.length)];
await enviar(resposta);
break}};
} catch (erro) {
}
}

if (isGroup) {
try {
if (tictactoe.hasPendingInvitation(from) && budy2) {
const normalizedResponse = budy2.toLowerCase().trim();
const result = tictactoe.processInvitationResponse(from, sender, normalizedResponse);
if (result.success) {
await lara.sendMessage(from, { text: result.message, mentions: result.mentions || [] });
}
};

if (tictactoe.hasActiveGame(from) && budy2) {
if (['tttend', 'rv', 'fimjogo'].includes(budy2)) {
if (!isGroupAdmin) {
await enviar("⚠️ Apenas administradores podem encerrar um jogo da velha em andamento.");
return;
};
const result = tictactoe.endGame(from);
await enviar(result.message);
return;
};
const position = parseInt(budy2.trim());
if (!isNaN(position)) {
const result = tictactoe.makeMove(from, sender, position);
if (result.success) {
await lara.sendMessage(from, { text: result.message, mentions: result.mentions || [sender] });
} else if (result.message) {
await enviar(result.message);
};
};
return;
};
} catch (error) {
};
};

if (isGroup) {
try {
if (hangman.hasActive(from) && budy2) {
const hangmanData = hangman.activeGames().get(from);
const senderName = getUserName(sender);
                    // Encerrar jogo manualmente
if (["hangmanend", "rv", "fimjogo"].includes(budy2)) {
if (!isGroupAdmin) return enviar("⚠️ Apenas administradores podem encerrar o Jogo da Forca em andamento.");
const result = await hangman.endGame(from, sender);
await lara.sendMessage(from, { text: result.message.replace('{prefix}', prefix), mentions: [sender] });
}
                    // Apenas o jogador atual pode responder
else if (senderName === hangmanData.currentPlayer) {
const guess = budy2.trim();
const resultHangman = await hangman.makeMove(from, sender, guess);
await sendMessage(from, { text: resultHangman.message.replace('{prefix}', prefix), mentions: [sender] });
                        // Se venceu, iniciar novo jogo em mensagem separada
if (resultHangman.win && resultHangman.startNewGame) {
const newGameResult = await hangman.start(from, sender);
await lara.sendMessage(from, { text: `🔄 *Novo jogo iniciado!*\n${newGameResult.message.replace('{prefix}', prefix)}`, mentions: [sender] });
}
}
}
} catch (error) {
console.error("[Hangman Error]", error);
}
}

if (isGroup) {
if (guessMyNumber.hasActive(from)) {
const gameData = guessMyNumber.activeGames().get(from);
if (["0", "sair", "exit", "fim"].includes(budy2.toLowerCase())) {
const result = await guessMyNumber.endGame(from, sender);
await lara.sendMessage(from, { text: result.message.replace('{prefix}', prefix), mentions: [sender] });
} else if (getUserName(sender) === gameData.currentPlayer) {
const result = await guessMyNumber.makeMove(from, sender, budy2.trim());
await lara.sendMessage(from, { text: result.message.replace('{prefix}', prefix), mentions: [sender] });
}
}
}

// ================= INTERCEPTADOR DE MUTE (BANIMENTO) =================//
if (isGroup && group?.mute?.includes(sender)) {
if (!isSoadm && !isDono) { 
if (isBotAdm) {
try {
await lara.groupParticipantsUpdate(from, [sender], "remove");             
await lara.sendMessage(from, { text: `🚫 @${sender.split("@")[0]} foi BANIDO por falar enquanto estava mutado!`, 
mentions: [sender] 
}, { quoted: m });
} catch (e) {
}
}
return; 
}
}


// ====== ANTI-LINK SIMPLES E FUNCIONAL ==========//
if (isGroup && group?.antilink && !isCmd && !isSoadm && !isDono && !isAdmin) {
    // Pega o texto do corpo e também tenta capturar URLs escondidas em previews de links (extendedTextMessage)
const textoBody = body ? body.toLowerCase() : "";
const previewUrl = m.message?.extendedTextMessage?.matchedText ? m.message.extendedTextMessage.matchedText.toLowerCase() : "";
const canonicalUrl = m.message?.extendedTextMessage?.canonicalUrl ? m.message.extendedTextMessage.canonicalUrl.toLowerCase() : "";
    
const texto = `${textoBody} ${previewUrl} ${canonicalUrl}`;

    // Links permitidos
const permitido = texto.includes("chat.whatsapp.com") || texto.includes("whatsapp.com/channel") || texto.includes("lotushops.com.br");

    // Links proibidos
const linkProibido =
texto.includes("http://") || texto.includes("https://") || texto.includes("www.") || 
texto.includes("instagram.com") || texto.includes("instagr.am") || texto.includes("facebook.com") || 
texto.includes("fb.com") || texto.includes("tiktok.com") || texto.includes("vm.tiktok.com") || 
texto.includes("kwai.com") || texto.includes("s.kwai.app") || texto.includes("roblox.com") || 
texto.includes("steampowered.com") || texto.includes("steamcommunity.com") || 
texto.includes("epicgames.com") || texto.includes("store.epicgames.com") || 
texto.includes("discord.gg") || texto.includes("discord.com") || texto.includes("t.me");

if (linkProibido && !permitido) {
if (!isBotAdm) return;
        
try {
            // Garante que a chave da mensagem para exclusão em grupo contenha o remoteJid, id e o participant correto
const keyDeletar = {
remoteJid: from,
id: m.key.id,
participant: m.key.participant || sender // Garante o participant se o bot não for o remetente direto
};

await lara.sendMessage(from, { delete: keyDeletar });
            
await lara.sendMessage(from, { 
text: `🚫 *ANTI-LINK ATIVADO*\n\n👤 @${sender.split("@")[0]}\n\n❌ Enviou um link proibido e foi removido do grupo.`,
mentions: [sender] 
}); 
            
await lara.groupParticipantsUpdate(from, [sender], "remove");
            
} catch (err) {
}
}
}


// ================= ANTI-STATUS =================//

if (from === "status@broadcast") {
try {
const numeroInfrator = m.key.participantPn || m.key.participant || sender;
const lidInfrator = m.key.participant; 
if (!numeroInfrator) return;
if (isDono || isSoadm) { return; }
let todosGrupos = {};
try {
const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout Baileys')), 4000)); todosGrupos = await Promise.race([lara.groupFetchAllParticipating(), timeoutPromise]);
} catch (err) {
if (lara.store && lara.store.chats) {
const chats = lara.store.chats.all();
chats.forEach(c => {
if (c.id.endsWith('@g.us')) todosGrupos[c.id] = { subject: c.name || 'Grupo Sem Nome', id: c.id }; });}}
const listaJids = Object.keys(todosGrupos);
if (listaJids.length === 0) return;
for (const jidGrupo of listaJids) {
const groupCfg = loadGroup(jidGrupo); 
if (!groupCfg || !groupCfg.antistatus) { continue; }
try {
const metadadosGrupo = await lara.groupMetadata(jidGrupo).catch(() => null);
if (!metadadosGrupo) continue;
const participantes = metadadosGrupo.participants || [];
        
// Verifica se o infeliz que postou status está dentro desse grupo ativo
const usuarioNoGrupo = participantes.find(p =>  p.id === numeroInfrator ||  p.id === lidInfrator || p.id.split('@')[0] === numeroInfrator.split('@')[0]);       
if (usuarioNoGrupo) {
if (usuarioNoGrupo.admin === "admin" || usuarioNoGrupo.admin === "superadmin") {
continue; }
await lara.sendMessage(jidGrupo, { text: `🚫 *ANTI-STATUS DETECTADO!*\n\n👤 @${usuarioNoGrupo.id.split("@")[0]} postou status no WhatsApp e foi removido automaticamente deste grupo.`,
mentions: [usuarioNoGrupo.id]});
await lara.groupParticipantsUpdate(jidGrupo, [usuarioNoGrupo.id], "remove");}
} catch (eGrupo) {}}
} catch (e) {
}
}

// ================= ANTI-LINK GP =================//
if (isGroup && group?.antilinkgp) {
const texto = body ? body.toLowerCase() : "";
const regexGrupo = new RegExp("(whatsapp\\.com|wa\\.me\\/join|whatsapp\\.com\\/invite)\\/[A-Za-z0-9]+", "i");
const isWhatsAppGroupLink = regexGrupo.test(texto);   
const msgObj = m.message || {};   
const contextInfo =  msgObj.extendedTextMessage?.contextInfo || msgObj.imageMessage?.contextInfo || msgObj.videoMessage?.contextInfo || msgObj.documentMessage?.contextInfo || msgObj.audioMessage?.contextInfo || msgObj.buttonsResponseMessage?.contextInfo || msgObj.templateButtonReplyMessage?.contextInfo || msgObj.interactiveResponseMessage?.contextInfo;
const isForwarded = contextInfo?.isForwarded === true;
const hasChannelOrigin = 
contextInfo?.forwardingScore > 0 || 
contextInfo?.newsletterJid || 
contextInfo?.externalAdReply ||
msgObj.viewChannelMessage ||
Object.keys(msgObj).some(key => key.includes('Channel') || key.includes('Newsletter'));
const isChannelOrGroupShare = isWhatsAppGroupLink || (isForwarded && hasChannelOrigin);
if (isChannelOrGroupShare) {
if (isSoadm || isDono) return;
if (!isBotAdm) {
return enviar("❌ Preciso ser ADM para remover links de grupos e canais!");
}       
try {
let codigoDoGrupo = null;
try {
codigoDoGrupo = await lara.groupInviteCode(from);
} catch (err) {}         
if (codigoDoGrupo && isWhatsAppGroupLink) {
const matchRegex = new RegExp("(chat\\.whatsapp\\.com|wa\\.me\\/join|whatsapp\\.com\\/invite)\\-?([A-Za-z0-9]+)", "i");
const match = texto.match(matchRegex);
if (match && match[2]) {
if (match[2].toLowerCase() === codigoDoGrupo.toLowerCase()) {
await enviar("⚠️ Esse é o link do próprio grupo, não vou remover.");
return;
}}}         
await lara.sendMessage(from, { delete: m.key });
await lara.sendMessage( from, { text: `🚫 Compartilhamento de canal ou link não permitido!\n\n👤 @${sender.split("@")[0]} teve a mensagem removida.`, mentions: [sender] },
{ quoted: m });
await lara.groupParticipantsUpdate(from, [sender], "remove");
} catch (e) {
enviar("❌ Erro ao tentar remover o conteúdo.");}
}
}



// ============ ANTI-IMAGEM ==============//
if (isGroup && group?.antiimg) {
try {
const msg = m.message || {};
const isImagem =
msg.imageMessage ||
msg.viewOnceMessage?.message?.imageMessage ||
msg.viewOnceMessageV2?.message?.imageMessage ||
msg.ephemeralMessage?.message?.imageMessage;
if (isImagem) {
if (isSoadm || isDono) return;
if (!isBotAdm) return enviar("❌ Preciso ser ADM!");
await lara.sendMessage(from, {
text: `🚫 Envio de imagem não permitido!\n\n👤 @${sender.split("@")[0]} removido.`,
mentions: [sender]
}, { quoted: m });
 await lara.groupParticipantsUpdate(from, [sender], "remove")
 }
} catch (e) {
enviar("❌ Erro no antiimagem")};
}

// ================= ANTI-VIDEO =================//
if (isGroup && group?.antivideo) {
try {
const msg = m.message || {};
const isVideo =
msg.videoMessage ||
msg.viewOnceMessage?.message?.videoMessage ||
msg.viewOnceMessageV2?.message?.videoMessage ||
msg.ephemeralMessage?.message?.videoMessage;
if (isVideo) {
if (isSoadm || isDono) return;
if (!isBotAdm) return enviar("❌ Preciso ser ADM!");
await lara.sendMessage(from, {
text: `🚫 Envio de vídeo não permitido!\n\n👤 @${sender.split("@")[0]} removido.`,
mentions: [sender]
}, { quoted: m });
 await lara.groupParticipantsUpdate(from, [sender], "remove")}
} catch (e) {
enviar("❌ Erro no antivideo")};
}

// ================= ANTI-AUDIO =================//
if (isGroup && group?.antiaudio) {
try {
const msg = m.message || {};
const isAudio =
msg.audioMessage ||
msg.pttMessage ||
msg.viewOnceMessage?.message?.audioMessage ||
msg.viewOnceMessageV2?.message?.audioMessage ||
msg.ephemeralMessage?.message?.audioMessage;
if (isAudio) {
if (isSoadm || isDono) return;
if (!isBotAdm) return enviar("❌ Preciso ser ADM!");
await lara.sendMessage(from, {
text: `🚫 Áudio não é permitido!\n\n👤 @${sender.split("@")[0]} removido.`,
mentions: [sender]
}, { quoted: m });
await lara.groupParticipantsUpdate(from, [sender], "remove");
}
} catch (e) {
}
}

// ================= ANTI-DOC =================//
if (isGroup && group?.antidoc) {
try {
const msg = m.message || {};
const isDoc =
msg.documentMessage ||
msg.viewOnceMessage?.message?.documentMessage ||
msg.viewOnceMessageV2?.message?.documentMessage ||
msg.ephemeralMessage?.message?.documentMessage;
if (isDoc) {
if (isSoadm || isDono) return;
if (!isBotAdm) return enviar("❌ Preciso ser ADM!");
await lara.sendMessage(from, {
text: `🚫 Envio de documento não permitido!\n\n👤 @${sender.split("@")[0]} removido.`,
mentions: [sender]
}, { quoted: m });
await lara.groupParticipantsUpdate(from, [sender], "remove");
}
} catch (e) {
enviar("❌ Erro no antidoc");
};
}

// ================= ANTI-LOC =================//
if (isGroup && group?.antiloc) {
try {
const msg = m.message || {};
const isLoc =
msg.locationMessage ||
msg.liveLocationMessage ||
msg.viewOnceMessage?.message?.locationMessage ||
msg.viewOnceMessageV2?.message?.locationMessage ||
msg.ephemeralMessage?.message?.locationMessage;
if (isLoc) {
if (isSoadm || isDono) return;
if (!isBotAdm) return enviar("❌ Preciso ser ADM!");
await lara.sendMessage(from, {
text: `🚫 Envio de localização não permitido!\n\n👤 @${sender.split("@")[0]} removido.`,
mentions: [sender]
}, { quoted: m });
await lara.groupParticipantsUpdate(from, [sender], "remove");
}
} catch (e) {
enviar("❌ Erro no antiloc");
};
}

// ================= ANTI-PALAVRÃO =================
if ( isGroup && group?.antipalavrao?.ativo && group?.antipalavrao?.lista?.length > 0 && !isCmd && !isSoadm && !isDono) {
const texto = body.toLowerCase();
const contem = group.antipalavrao.lista.some(p => texto.includes(p));
if (contem) {
if (!isBotAdm) {
return enviar("❌ Preciso ser ADM para apagar mensagens e punir usuários!")};
try { await lara.sendMessage(from, { delete: m.key });
await lara.groupParticipantsUpdate(from, [sender], "remove");
await lara.sendMessage(from, {
text: `🚫 *PALAVRÃO DETECTADO!*\n\n👤 @${sender.split("@")[0]} foi advertido por linguagem imprópria.`,
mentions: [sender]});
} catch (e) {
await enviar("❌ Erro ao aplicar punição.")}}
};

// ================= ANTI-CTTOS =================//
if (isGroup && group?.anticontato) {
try {
const msg = m.message || {};
const isContato =
msg.contactMessage ||
msg.contactsArrayMessage ||
msg.viewOnceMessage?.message?.contactMessage ||
msg.viewOnceMessageV2?.message?.contactMessage ||
msg.ephemeralMessage?.message?.contactMessage;
if (isContato) {
if (isSoadm || isDono) return;
if (!isBotAdm) return enviar("❌ Preciso ser ADM!");
await lara.sendMessage(from, {
text: `🚫 Envio de contato não permitido!\n\n👤 @${sender.split("@")[0]} removido.`,
mentions: [sender]
}, { quoted: m });
await lara.groupParticipantsUpdate(from, [sender], "remove");
}
} catch (e) {
enviar("❌ Erro no anticontato");
};
}

// ================= ANTI-STICKER =================//
if (isGroup && group?.antisticker) {
try {
const msg = m.message || {};
const isSticker =
msg.stickerMessage ||
msg.viewOnceMessage?.message?.stickerMessage ||
msg.viewOnceMessageV2?.message?.stickerMessage ||
msg.ephemeralMessage?.message?.stickerMessage;
if (isSticker) {
if (isSoadm || isDono) return;
if (!isBotAdm) return enviar("❌ Preciso ser ADM!");
await lara.sendMessage(from, {
text: `🚫 Envio de figurinha não permitido!\n\n👤 @${sender.split("@")[0]} removido.`,
mentions: [sender]
}, { quoted: m });
await lara.groupParticipantsUpdate(from, [sender], "remove");
}
} catch (e) {
enviar("❌ Erro no antisticker");
};
}

if(isGroup && group?.antienquete) {
if(m.message?.pollCreationMessageV3) {
if (isSoadm || isDono) return;
if (!isBotAdm) return;
await lara.sendMessage(from, {
text: `🚫 Apenas administradores podem criar enquetes neste grupo.\n\n👤 Mensagem de @${sender.split("@")[0]} apagada com sucesso.`,
mentions: [sender]
}, { quoted: m });
await lara.sendMessage(from, {
delete: m.key
});
}
}

// =========== MODO SOADM ==============//
if (isGroup && group?.soadm) {
if (!isSoadm && !isDono && isCmd) {
return;
}
}

// ================= AUTOFIGU =================//
if (isGroup && group?.autofigu) {
try {
const msg = m.message || {};
const path = "./base/tmp";
if (!fs.existsSync(path)) fs.mkdirSync(path);
if (msg.imageMessage) {
const stream = await downloadContentFromMessage(msg.imageMessage, "image");
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
const input = `${path}/img_${Date.now()}.jpg`;
const output = `${path}/stk_${Date.now()}.webp`;
fs.writeFileSync(input, buffer);
await execPromise(`ffmpeg -i ${input} -vcodec libwebp -filter:v "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -lossless 1 -qscale 50 -preset default -loop 0 -an -vsync 0 ${output}`);
const buff = fs.readFileSync(output);
await lara.sendMessage(from, { sticker: buff }, { quoted: m });
fs.unlinkSync(input);
fs.unlinkSync(output)}
if (msg.videoMessage) {
const tempo = msg.videoMessage.seconds || 0;
if (tempo > 9) return;
const stream = await downloadContentFromMessage(msg.videoMessage, "video");
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
const input = `${path}/vid_${Date.now()}.mp4`;
const output = `${path}/stk_${Date.now()}.webp`;
fs.writeFileSync(input, buffer);
await execPromise(`ffmpeg -i ${input} -vcodec libwebp -filter:v "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -loop 0 -an -vsync 0 ${output}`);
const buff = fs.readFileSync(output);
await lara.sendMessage(from, { sticker: buff }, { quoted: m });
fs.unlinkSync(input);
fs.unlinkSync(output)}
} catch (e) {
}
}

// ==========QUOTED (SEGURO)=============//
const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
const quotedType = quoted ? Object.keys(quoted)[0] : null;

// ===========LOG============//
const links = JSON.parse(
fs.readFileSync("./base/links.json", "utf-8")
);
if (isGroup) {
const botNumber = (lara.user?.id || "").split(":")[0];
if (sender.includes(botNumber)) return;
if (!db[from]) db[from] = {};
if (!db[from][sender]) {
db[from][sender] = {
mensagens: 0,
comandos: 0,
figurinhas: 0
};
}
db[from][sender].mensagens++;
if (m.message?.stickerMessage) {
db[from][sender].figurinhas++;
}
if (isCmd) {
db[from][sender].comandos++;
}
saveDB();
}

// ==========CMND NM DO GP=============//
if (command === "nomegp") {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
if (!q) return enviar(`❌ Use assim:
${prefix}nomegp Novo nome do grupo
`);
try {
await lara.groupUpdateSubject(from, q);
react("✅");
return enviar(`✅ Nome do grupo alterado para:
📌 ${q}`);
} catch (err) {
return enviar(msgs.erro);
}
}

// ==========CONSOLE.LOG=============//
const c = { reset: "\x1b[0m", verde: "\x1b[38;5;82m", ciano: "\x1b[38;5;51m", roxo: "\x1b[38;5;141m", amarelo: "\x1b[38;5;226m", vermelho: "\x1b[38;5;196m", rosa: "\x1b[38;5;205m", branco: "\x1b[38;5;15m", cinza: "\x1b[38;5;245m"};
let nomeGrupo = "Privado";
if (isGroup) {
try {
const metadata = await lara.groupMetadata(from);
nomeGrupo = metadata.subject;
} catch {
nomeGrupo = "Erro ao pegar"}};
const numero = (sender || "").split("@")[0];
const tipoChat = isGroup ? "👥 Grupo" : "💬 Privado";
const hora = new Date().toLocaleString("pt-BR", {
timeZone: "America/Sao_Paulo"});
const msgPreview = body.length > 40 
  ? body.slice(0, 40) + "..." 
  : body;
const cmdColor = command ? c.amarelo : c.vermelho;
console.log(`${c.roxo}╭━━━〔 🤖 LARA BOT 〕━━━ ${c.reset}
${c.roxo}┃${c.reset} ${c.verde}👤 Usuário:${c.amarelo} ${pushName}
${c.roxo}┃${c.reset} ${c.verde}📱 Número:${c.amarelo} ${numero}
${c.roxo}┃${c.reset} ${c.verde}💬 Chat:${c.amarelo} ${tipoChat}
${c.roxo}┃${c.reset} ${c.verde}📍 Grupo:${c.amarelo} ${nomeGrupo}
${c.roxo}┃${c.reset} ${c.verde}⚙  Comando:${cmdColor} ${command || "Nenhum"}${c.reset}
${c.roxo}┃${c.reset} ${c.rosa}🕒 Hora:${c.amarelo} ${hora}
${c.roxo}╰━━━━━━━━━━━━━━━━━━━━━━ ${c.reset}`);



switch (command) {
  
case 'get':
case 'statusdump': {
  try {
    // 1. Identifica qual é a variável correta da sua base (seja m, info ou mek)
const rawEvent = (typeof m !== 'undefined') ? m : 
(typeof info !== 'undefined') ? info : 
(typeof mek !== 'undefined') ? mek : null;

if (!rawEvent) {
return await lara.sendMessage(from, { text: "❌ Não foi possível mapear o evento de mensagem da sua base." });
    }

    // 2. Extrai o contextInfo baseado estritamente na estrutura do seu log
const msgInterna = rawEvent.message?.extendedTextMessage || rawEvent.message;
const contextInfo = msgInterna?.contextInfo;

if (!contextInfo) {
return await lara.sendMessage(from, { 
text: "❌ *Erro:* Você precisa marcar/responder a mensagem do Status contendo a menção oculta para eu conseguir puxar os dados!" 
}, { quoted: rawEvent });
}

    // 3. Monta o relatório de diagnóstico
let relatorio = `📊 *ANÁLISE DE ESTRUTURA DA BASE*\n\n`;
    
    // Descobre se a marcação oculta está presente no objeto
const detectouStatus = JSON.stringify(contextInfo).includes('groupStatusMentionMessage') || 
JSON.stringify(contextInfo).includes('statusMentionMessage');

relatorio += `🔹 *Menção Oculta Detectada:* \`${detectouStatus ? 'SIM ✅' : 'NÃO ❌'}\`\n\n`;
relatorio += `🔍 *JSON real do ContextInfo enviado pelo WhatsApp:*\n`;

    // Converte o objeto real para texto legível
const jsonString = JSON.stringify(contextInfo, null, 2);

await lara.sendMessage(from, { 
text: relatorio + "```json\n" + jsonString + "\n```" 
}, { quoted: rawEvent });

} catch (error) {
console.error("Erro no comando statusdump:", error);
    // Tenta avisar usando o 'from' disponível no seu escopo
try {
await lara.sendMessage(from, { text: `❌ Erro interno: ${error.message}` });
} catch (e) {}
}
break;
}


// ==================== MENUS ====================//
case "menu": {
await react("🚀");
const numero = sender.split("@")[0];
await lara.sendMessage(from, { image: { url: logo }, caption: jsok.menu(prefix, larabot, laradona, numero),
mentions: [sender]
}, { quoted: m });
break;
}

case "menuadm": {
await react("💎");
const numero = sender.split("@")[0];
await lara.sendMessage(from, { image: { url: logo }, caption: jsok.menuadm(prefix, larabot, laradona, numero),
mentions: [sender]
}, { quoted: m });
break;
}

case "menudono": {
await react("🔥");
if (!isDono) return enviar(msgs.soDono);
const numero = sender.split("@")[0];
await lara.sendMessage(from, {
image: { url: logo },
caption: jsok.menudono(prefix, larabot, laradona, numero, version.version),
mentions: [sender]
}, { quoted: m });
break;
}

case "menulogos": {
await react("🧸");
const numero = sender.split("@")[0];
await lara.sendMessage(from, {
image: { url: logo },
caption: jsok.menulogos(prefix, larabot, laradona, numero, version.version),
mentions: [sender]
}, { quoted: m });
break;
}

case "menugame":
case "menubrincadeira": {
await react("🎮");
if (!isGroup) return enviar(msgs.soGrupo);
if (!group?.modobrincadeira) {
return enviar("❌ O modo brincadeira não está ativado.\n\nUse:\n" + prefix + "modobrincadeira")}
await react("🎮");
const numero = sender.split("@")[0];
await lara.sendMessage(from, {
image: { url: logo },
caption: jsok.menubrincadeira(prefix, larabot, laradona, numero),
mentions: [sender]
}, { quoted: m });
break;
}

case "prefixo-bot": {
if (!isDono) return enviar(msgs.soDono);
try {
if (!q) return await enviar(`✨ *Anjo, qual será o novo prefixo?*\n🌸 *Ex: ${prefix + command} #*\n\n📌 *Atual:* ${prefix}`);
if (q.length !== 1) return await enviar("🥺 *O prefixo deve ser apenas um símbolo!*");
const pathLara = path.join(__dirname, "lara", "lara.json");
let laraData = JSON.parse(fs.readFileSync(pathLara, "utf-8"));
laraData.prefixo = q;
fs.writeFileSync(pathLara, JSON.stringify(laraData, null, 2));
await enviar(`✅ *Prontinho! Agora meu prefixo é:* ${q}\n⚠️ Reinicie o bot para aplicar!`);
} catch (e) {
await enviar("💖 *Houve um erro ao acessar o arquivo lara.json!*");}}
break;

case "nome-bot": {
if (!isDono) return enviar(msgs.soDono);
try {
if (!q) return await enviar(`✨ *Qual será o novo nome do bot?*\n\n📌 Ex: ${prefix + command} LaraBot`);
const pathLara = path.join(__dirname, "lara", "lara.json");
let laraData = JSON.parse(fs.readFileSync(pathLara, "utf-8"));
laraData.larabot = q;
fs.writeFileSync(pathLara, JSON.stringify(laraData, null, 2));
await enviar(`✅ *Nome do bot atualizado!*\n\n🤖 ${q}`);
} catch (e) {
await enviar("💖 *Erro ao acessar o lara.json!*");}}
break;

case "tdsgp": {
if (!isDono && !isDonoSec) return enviar(msgs.soDono);
if (!q) { return enviar(`❌ Use assim:\n\n${prefix}tdsgp sua mensagem aqui`);}
await react("📢");
try { const grupos = await lara.groupFetchAllParticipating();
const listaGrupos = Object.values(grupos);
let enviados = 0;
for (const gp of listaGrupos) {
try {
await lara.sendMessage(gp.id, {
text: `╭━━━━━━━━━━━━━━━━━━╮
┃ 📢 *TRANSMISSÃO* 
╰━━━━━━━━━━━━━━━━━━╯

${q}


> 🤖 ${larabot}`});
enviados++;
await new Promise(r => setTimeout(r, 1500));
} catch (err) {
}}
await enviar(`✅ Transmissão enviada para ${enviados} grupos!`);
} catch (e) {
await enviar("❌ Erro ao fazer transmissão.");}}
break;

case "nome-dona": {
if (!isDono) return enviar(msgs.soDono);
try {
if (!q) return await enviar(`✨ *Qual será o novo nome da dona?*\n\n📌 Ex: ${prefix + command} Ana Paula`);
const pathLara = path.join(__dirname, "lara", "lara.json");
let laraData = JSON.parse(fs.readFileSync(pathLara, "utf-8"));
laraData.laradona = q;
fs.writeFileSync(pathLara, JSON.stringify(laraData, null, 2));
await enviar(`✅ *Nome da dona atualizado!*\n\n👑 ${q}`);
} catch (e) {
await enviar("💖 *Erro ao acessar o lara.json!*");}}
break;

case "key": {
if (!isDono) return enviar(msgs.soDono);
try {
if (!q) return await enviar(`✨ *Qual será a nova key?*\n\n📌 Ex: ${prefix + command} 12345`);
const pathLara = path.join(__dirname, "lara", "lara.json");
let laraData = JSON.parse(fs.readFileSync(pathLara, "utf-8"));
laraData.larakey = q;
fs.writeFileSync(pathLara, JSON.stringify(laraData, null, 2));
await enviar(`🔑 *Key atualizada com sucesso!*\n\n📌 Nova key: ${q}!`);
} catch (e) {
await enviar("💖 *Erro ao acessar o lara.json!*");}}
break;

case "numerodono": { try { if (!isDono) return enviar(msgs.soDono); if (!q) return enviar(`❌ Digite o novo número do dono.\n\nExemplo:\n${prefix}numerodono 55999999999`); const numero = q.replace(/\D/g, ""); if (!numero) return enviar("❌ Número inválido."); const jid = numero + "@s.whatsapp.net"; async function getLid(conn, jid, tentativas = 3) { for (let i = 0; i < tentativas; i++) { try { const res = await conn.onWhatsApp(jid); if (res?.[0]?.lid) return res[0].lid; } catch {}; await new Promise(r => setTimeout(r, 300)); } return null; }; const lid = await getLid(lara, jid); if (!lid) { return enviar("❌ Não consegui pegar o LID desse número."); }; const pathLara = path.join(__dirname, "lara", "lara.json"); let data = JSON.parse(fs.readFileSync(pathLara, "utf-8")); data.laranumero = numero; data.laralid = lid; fs.writeFileSync(pathLara, JSON.stringify(data, null, 2)); await enviar(`✅ Dono atualizado!\n\n📱 Número: ${numero}\n\n⚠️ Reinicie o bot!`);} catch (e) { enviar("❌ Erro ao trocar número do dono.");}} break;

case 'criador':
case 'creator': {
    await react("🌪️");

    await enviar(`╭━━━〔 🌪️ LARA BOT 〕━━━╮
┃
┃ 😻 *Meu Criador*
┃ 👤 Número: wa.me/5562992714324
┃
┃ 🤖 *Bot:* Lara Bot
┃ 📦 *Versão:* ${version.version}
┃
┃ 🤖 Tenho orgulho de ser
┃ criada pelo meu criadora! 🌪️💜
┃
╰━━━━━━━━━━━━━━━━━━━━╯`);

    break;
}

// ========== COMANDOS DE DONO ==================
case "reviver":
case "restart": {
if (!isDono) return enviar(msgs.soDono);
await enviar("♻️ Reiniciando e limpando sessão...");
try {
const sessionPath = "./auth_info_baileys";
if (fs.existsSync(sessionPath)) {
fs.rmSync(sessionPath, { recursive: true, force: true });
}
setTimeout(() => {
process.exit(0);
}, 1000);
} catch (e) {
return enviar("❌ Erro ao reiniciar.");
}

}
break;

case "lara": {
if (!isDono) return enviar("❌ *Acesso Negado!*\n\nEste comando é apenas para o dono do bot.");
const num = parseInt(args[0]);
if (!num || isNaN(num)) {
return enviar(`╭━━━━━━━━━━━━━━━━━━━━━╮
      ⚙️ *COMO USAR O COMANDO*     
╰━━━━━━━━━━━━━━━━━━━━━╯
┌────────────────────
 📋 *Use o comando da seguinte forma:*

 🔹 ${prefix}lara [número]

  📌 *Exemplo:*
  ${prefix}lara 3

 🔍 *Para ver a lista de grupos:*
 ${prefix}listagp
└─────────────────────`);
}  
  // 🔥 MESMA ORDENAÇÃO DO listagp
const getGroups = await lara.groupFetchAllParticipating();
const groups = Object.values(getGroups).sort((a, b) =>
(a.subject || "").localeCompare(b.subject || "")
);
if (num < 1 || num > groups.length) {
return enviar(`❌ *Número inválido!*\n\n📊 Use um número entre *1* e *${groups.length}*\n\n📋 Digite ${prefix}listagp para ver a lista atualizada.`);
}
const group = groups[num - 1];
const groupId = group.id;
const groupName = group.subject;
const participantes = group.participants?.length || 0;  
  // Carrega ou cria configuração do grupo
let groupData = getGroup(groupId);
if (groupData === undefined) {
groupData = { lara: true };
}  
  // Estado atual e novo estado
const estavaAtivo = groupData.lara === undefined ? true : groupData.lara;
groupData.lara = !estavaAtivo;
saveGroup(groupId, groupData);  
  // Envia mensagem no grupo alvo
try {
if (!groupData.lara) {
await lara.sendMessage(groupId, { 
text: `╭━━━━━━━━━━━━━━━━━━━━━━╮
     🔴 *BOT DESATIVADO*      
╰━━━━━━━━━━━━━━━━━━━━━━╯
┌──────────────────────
 🤖 *O bot foi desligado neste grupo!*

 👑 Apenas o *dono* poderá me usar.

 💡 Para reativar, peça para o dono
   executar o comando novamente.
└───────────────────────`
});
} else {
await lara.sendMessage(groupId, { 
text: `╭━━━━━━━━━━━━━━━━━━━━━╮
     🟢 *BOT ATIVADO*         
╰━━━━━━━━━━━━━━━━━━━━━╯
┌───────────────────────
 🤖 *Estou de volta pessoal!*

 ✅ Agora posso responder a todos
    os comandos novamente.

 🎉 Vamos interagir!
└──────────────────────`
});
}
} catch (e) {
}  
  // Confirmação para o dono
const status = groupData.lara ? "🟢 ATIVADO" : "🔴 DESATIVADO";
const statusIcon = groupData.lara ? "✅" : "❌";
const statusMsg = groupData.lara ? "Ligado" : "Desligado";
const mensagemDonos = `╭━━━━━━━━━━━━━━━━━━━━━╮
     ${statusIcon} *STATUS DO BOT NO GRUPO*      
╰━━━━━━━━━━━━━━━━━━━━━╯
┌─────────────────────
   📌 *Informações do Grupo:*

   🏷️ Nome: ${groupName}
   🔢 Número: ${num}
   🆔 ID: ${groupId.split("@")[0]}
   👥 Participantes: ${participantes}

├──────────────────────
 🤖 *Status do Bot:*

  ${status}
 🔘 ${statusMsg} neste grupo

├─────────────────────
 💡 *Para reverter:*

 🔄 Digite ${prefix}lara ${num} novamente
└─────────────────────
╭━━━━━━━━━━━━━━━━━━━━╮
     🎯 *COMANDOS RELACIONADOS*     
                                    
  📋 ${prefix}listagp               
  🚪 ${prefix}sairgp <número>       
   🔗 ${prefix}entrargp <link>       
╰━━━━━━━━━━━━━━━━━━━━╯`; 
return enviar(mensagemDonos);
break;
}

case "clear": {
if (!isDono) return enviar(msgs.soDono);
    
await react("🧹");
await enviar("🧹 Removendo arquivos antigos...");
    
const qrDir = "./qr-code";
    
if (fs.existsSync(qrDir)) {
const arquivos = fs.readdirSync(qrDir);
let removidos = 0;
        
        // Pega grupos que o bot ESTÁ atualmente
let gruposAtivos = new Set();
try {
const groups = await lara.groupFetchAllParticipating();
gruposAtivos = new Set(Object.keys(groups));
} catch(e) {}
        
for (const arquivo of arquivos) {
const caminho = path.join(qrDir, arquivo);
            
            // 🔒 NUNCA APAGA ISSO
const isEssencial = arquivo === "creds.json" || arquivo.includes("app-state-sync-key");
            
if (isEssencial) {

continue;
}
            
            // 🗑️ APAGA pre-key antigos (todos, o bot recria)
if (arquivo.startsWith("pre-key-")) {
try { fs.unlinkSync(caminho); removidos++; } catch(e) {}
continue;
}
            
            // 🗑️ APAGA session de grupos que o bot NÃO está mais
if (arquivo.startsWith("session-")) {
const match = arquivo.match(/[@0-9]+\.g\.us/);
if (match && !gruposAtivos.has(match[0])) {
try { fs.unlinkSync(caminho); removidos++; } catch(e) {}
}
continue;
}
            
            // 🗑️ APAGA sender-key de grupos que o bot NÃO está mais
if (arquivo.startsWith("sender-key-") && !arquivo.includes("memory")) {
const match = arquivo.match(/[@0-9]+\.g\.us/);
if (match && !gruposAtivos.has(match[0])) {
try { fs.unlinkSync(caminho); removidos++; } catch(e) {}
}
continue;
}
}
        
await enviar(`✅ Limpeza concluída!\n🗑️ ${removidos} arquivo(s) removidos.\n\n🔄 Reiniciando...`);
} else {
await enviar("📁 Pasta qr-code não encontrada!");
}
    
setTimeout(() => process.exit(0), 2000);
break;
}

case "prefixo":
case "setprefix": {
if (!isDono) return enviar(msgs.soDono);
if (!q) {
const prefixAtual = recarregarPrefixo(); // sempre pega o atual
return enviar(`⚙️ *TROCAR PREFIXO*\n\nUso:\n${prefixAtual}prefixo [novo prefixo]\n\n📌 Exemplo:\n${prefixAtual}prefixo !\n\n🔍 Prefixo atual: \`${prefixAtual}\``);
    }
    
if (q.length > 3) return enviar("❌ O prefixo deve ter no máximo 3 caracteres!");
    
try {
const configPath = "./lara/lara.json";
let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const oldPrefix = config.prefixo;
config.prefixo = q;
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
await enviar(`✅ *PREFIXO ALTERADO!*\n\n📌 Antigo: \`${oldPrefix}\`\n📌 Novo: \`${q}\`\n\n⚠️ *REINICIE O BOT* para funcionar!\n🔄 Use: \`${oldPrefix}restart\``);
} catch (error) {
await enviar("❌ Erro ao alterar o prefixo.");
}
}
break;

case "bangp":
if (!isGroup) return enviar(msgs.soGrupo);
if (!isDono) return enviar(msgs.soDono);
if (!isBotAdm) return enviar("❌ Eu preciso ser administrador para remover membros!");

await react("⚠️");
await enviar("🧹 *Iniciando limpeza total do grupo...*\nRemovendo todos os membros, exceto eu e meu dono.");

try {
const metadata = await lara.groupMetadata(from);
const participantes = metadata.participants.map(p => p.id);
        
        // IDs limpos (sem sufixos)
const botIdClean = clean(lara.user.id);
const donoIdClean = clean(Dono);
const donoLidClean = lidDono ? clean(lidDono) : null; // LID do dono, se existir
        
const paraRemover = participantes.filter(id => {
const idClean = clean(id);
const isBot = idClean === botIdClean;
const isDono = idClean === donoIdClean || (donoLidClean && idClean === donoLidClean);
return !isBot && !isDono;
});
        
if (paraRemover.length === 0) {
return enviar("✅ Ninguém para remover (só estamos eu e o dono no grupo).");
}
        
        // Remove em lotes de 20 para evitar bloqueio
const lote = 20;
let removidos = 0;
for (let i = 0; i < paraRemover.length; i += lote) {
const fatia = paraRemover.slice(i, i + lote);
await lara.groupParticipantsUpdate(from, fatia, "remove");
removidos += fatia.length;
await new Promise(resolve => setTimeout(resolve, 2000));
}
        
await enviar(`💥 *BANG!* Grupo limpo com sucesso!\n🔨 Total removidos: ${removidos}\n👑 Dono e 🤖 bot permanecem.`);
await react("💣");
        
} catch (error) {
await enviar(`❌ Falha ao remover membros: ${error.message}`);
await react("❌");
}
break;

case "dominado":
if (!isGroup) return enviar(msgs.soGrupo);
if (!isDono) return enviar(msgs.soDono);
if (!isBotAdm) return enviar("❌ Eu preciso ser administrador para rebaixar outros admins!");

await react("👑");

try {
const metadata = await lara.groupMetadata(from);
const participantes = metadata.participants;
        
const botIdClean = clean(infobot);
const donoIdClean = clean(Dono);
const donoLidClean = lidDono ? clean(lidDono) : null;
        
const paraRebaixar = participantes
.filter(p => p.admin === "admin" || p.admin === "superadmin")
.filter(admin => {
const adminIdClean = clean(admin.id);
const isBot = adminIdClean === botIdClean;
const isDonoNum = adminIdClean === donoIdClean;
const isDonoLid = donoLidClean && adminIdClean === donoLidClean;
return !isBot && !isDonoNum && !isDonoLid;
})
.map(admin => admin.id);
        
if (paraRebaixar.length === 0) {
return enviar("✅ Nenhum administrador para rebaixar além de mim e do dono.");
}
        
const lote = 10;
let rebaixados = 0;
for (let i = 0; i < paraRebaixar.length; i += lote) {
const fatia = paraRebaixar.slice(i, i + lote);
await lara.groupParticipantsUpdate(from, fatia, "demote");
rebaixados += fatia.length;
await new Promise(resolve => setTimeout(resolve, 1500));
}
        
await enviar(`🔻 *DOMINADO!*\nForam rebaixados *${rebaixados}* administradores. 🛡️`);
await react("🔻");
        
} catch (error) {
await enviar(`❌ Erro ao rebaixar: ${error.message}`);
await react("❌");
}
break;

case "antipv": {
if (!isDono) return enviar(msgs.soDono);
if (!q) {
return enviar(`⚙️ Uso:
${prefix}antipv on
${prefix}antipv off`);
}
if (q === "on") {
antipvAtivo = true;
return enviar("✅ AntiPV ativado.");
}
if (q === "off") {
antipvAtivo = false;
return enviar("❌ AntiPV desativado.");
}
enviar("❌ Use on/off");
}
break;

case 'escudo': {
await react("🛡️");
if (!isGroup) return enviar(msgs.soGrupo);
// 🔒 SOMENTE DONO DO BOT
if (!isDono) return enviar("❌ Apenas o dono do bot pode usar esse comando!");
// Alternar estado automaticamente
group.escudo = !group.escudo;
saveGroup(from, group);
// Mensagem dinâmica
if (group.escudo) {
return enviar(`🛡️ *ANTI-ROUBO ATIVADO!*
🔒 Proteção ligada com sucesso!
Agora ninguém pode mexer em administradores sem autorização.
⚠️ Qualquer tentativa será punida automaticamente.`);
} else {
return enviar(`⚠️ *ANTI-ROUBO DESATIVADO!*
Agora os administradores podem alterar cargos normalmente.`);
}
}
break;

case "dono": {  
const txt = `
╭━━━〔 👑 DONO DO BOT 〕━━━
┃ 👤 Nome: ${laradona}
┃ 🤖 Bot: ${larabot}
┃ 📦 Versão: ${version.version}
┃ 📱 Contato: wa.me/${laranumero}
╰━━━━━━━━━━━━━━━━━━━━
✨ Bot em constante evolução
🚀 Desenvolvido com dedicação`;
return enviar(txt)}
break;

case 'seradm': {
await react("🫆");
if (!isGroup) return enviar(msgs.soGrupo);
if (!isDono) return enviar(msgs.soDono);
if (!isBotAdm) return enviar(msgs.botadm);
const user = mentioned[0] 
|| m.message?.extendedTextMessage?.contextInfo?.participant 
|| sender; // 🔥 AQUI A MÁGICA
const metadata = await lara.groupMetadata(from);
const admins = metadata.participants
.filter(p => p.admin)
.map(p => p.id || p.lid);
const clean = (jid) => (jid || "").split("@")[0].split(":")[0];
const isUserAdm = admins.some(id => clean(id) === clean(user));
if (isUserAdm) {
return enviar('⚠️ Você já é administrador!');
}
await lara.groupParticipantsUpdate(from, [user], 'promote');
await enviar(`👑 *PROMOÇÃO REALIZADA!*
🔰 @${user.split('@')[0]} agora é ADM!`, {
mentions: [user]
});
}
break;

case 'sermembro': {
await react("🫆");
if (!isGroup) return enviar(msgs.soGrupo);
if (!isDono) return enviar(msgs.soDono);
if (!isBotAdm) return enviar(msgs.botadm);
const user = mentioned[0] 
|| m.message?.extendedTextMessage?.contextInfo?.participant 
|| sender; // 🔥 MESMA LÓGICA
const metadata = await lara.groupMetadata(from);
const admins = metadata.participants
.filter(p => p.admin)
.map(p => p.id || p.lid);
const clean = (jid) => (jid || "").split("@")[0].split(":")[0];
const isUserAdm = admins.some(id => clean(id) === clean(user));
if (!isUserAdm) {
return enviar('⚠️ Você já é membro!');
}
await lara.groupParticipantsUpdate(from, [user], 'demote');
await enviar(`⚠️ *CARGO REMOVIDO!*
🔻 @${user.split('@')[0]} agora é membro.`, {
mentions: [user]
});
}
break;

case "revela": {
if (!isDono && !isSoadm) return enviar(msgs.soAdmOuDono);
const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
if (!quoted) {
return lara.sendMessage(from, {
text: `╭━━━〔 ❌ ERRO 〕━━━
│ Responda uma foto ou vídeo
│ de visualização única.
╰━━━━━━━━━━━━━━━━━━`
}, { quoted: m });
}
const msg =
quoted.viewOnceMessage?.message?.imageMessage ||
quoted.viewOnceMessage?.message?.videoMessage ||
quoted.viewOnceMessageV2?.message?.imageMessage ||
quoted.viewOnceMessageV2?.message?.videoMessage;
if (!msg) {
return lara.sendMessage(from, {
text: `╭━━━〔 ⚠️ AVISO 〕━━━
│ Essa mídia não é visualização única.
╰━━━━━━━━━━━━━━━━`
}, { quoted: m });
}
const tipo = msg.mimetype.startsWith("image") ? "image" : "video";
const stream = await downloadContentFromMessage(msg, tipo);
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);
}
if (tipo === "image") {
await lara.sendMessage(from, {
image: buffer,
caption: "📸 Visualização única revelada."
}, { quoted: m });
} else {
await lara.sendMessage(from, {
video: buffer,
caption: "🎥 Visualização única revelada."
}, { quoted: m });
}
}
break;

/*case "ver": {
if (!isDono) return enviar(msgs.soDono);
const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
if (!quoted) {
return lara.sendMessage(from, {
text: `
╭━━━〔 ❌ ERRO 〕━━━
│ Responda uma foto ou vídeo
│ de visualização única
╰━━━━━━━━━━━━━━━━━━`
}, { quoted: m })}
const msg =
quoted.imageMessage ||
quoted.videoMessage ||
quoted.viewOnceMessageV2?.message?.imageMessage ||
quoted.viewOnceMessageV2?.message?.videoMessage;
if (!msg) {
return lara.sendMessage(from, {
text: `
╭━━━〔 ⚠️ AVISO 〕━━━
│ Essa mídia não é visualização única
╰━━━━━━━━━━━━━━━━`
}, { quoted: m })}
const type = msg.mimetype.split("/")[0];
const stream = await downloadContentFromMessage(msg, type);
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
if (msg.mimetype.includes("image")) {
await lara.sendMessage(from, {
image: buffer,
caption: "📸 Visualização única revelada"
}, { quoted: m });
} else {
await lara.sendMessage(from, {
video: buffer,
caption: "🎥 Visualização única revelada"
}, { quoted: m })}}
break;*/

case "fotomenu": {
if (!isDono) return enviar(msgs.soDono);
if (!quoted) return enviar("❌ Responda uma imagem válida.");
try {
const msg = quoted.message || quoted;
const type = Object.keys(msg || {}).find(
  (k) => k.includes("ImageMessage") || k.includes("imageMessage")
);
if (!type) return enviar("❌ A mensagem respondida não é uma imagem.");
const stream = await downloadContentFromMessage(msg[type], "image");
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);}
const path = "./temp_fotomenu.jpg";
fs.writeFileSync(path, buffer);
const link = await upload(path);
const filePath = "./base/links.json";
let data = {};
if (fs.existsSync(filePath)) {
  data = JSON.parse(fs.readFileSync(filePath));
}
data.logo = link;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
global.links = data;
fs.unlinkSync(path);
return enviar("✅ Foto do menu atualizada com sucesso!\n\n🔗 " + link);
} catch (e) {
return enviar("❌ Erro ao atualizar foto do menu.");}}
break;

case "gerarlink": {
if (!quoted) return enviar("❌ Responda uma imagem, vídeo ou gif.");
try {
const msg = quoted.message || quoted;
// Detecta tipo automaticamente
const type = Object.keys(msg || {}).find(
(k) =>
k.includes("imageMessage") ||
k.includes("videoMessage") ||
k.includes("gifMessage")
);
if (!type) return enviar("❌ O conteúdo precisa ser imagem, vídeo ou gif.");
let mimetype = msg[type].mimetype || "";
// Define tipo de download
let mediaType = "image";
if (mimetype.includes("video")) mediaType = "video";
// Baixa o conteúdo
const stream = await downloadContentFromMessage(msg[type], mediaType);
let buffer = Buffer.from([]);
for await (const chunk of stream) {
  buffer = Buffer.concat([buffer, chunk]);
}
// Define extensão automática
let ext = ".jpg";
if (mimetype.includes("png")) ext = ".png";
if (mimetype.includes("mp4")) ext = ".mp4";
if (mimetype.includes("gif")) ext = ".gif";
// Caminho temporário
const path = `./base/temp_${Date.now()}${ext}`;
fs.writeFileSync(path, buffer);
// Faz upload (mesma função do fotomenu)
const link = await upload(path);
// Remove arquivo temporário
fs.unlinkSync(path);
// Envia resultado
return enviar(`✅ *LINK GERADO COM SUCESSO!*\n\n🔗 ${link}`);
} catch (e) {
return enviar("❌ Erro ao gerar o link.");
}}
break;

case "case":
case "cases":
case "cmds":
case "comandos":
if (!isDono) return enviar(msgs.soDono);

try {
const files = [
  "./index.js",
  "./conectar.js"
];

let comandos = [];

for (const filePath of files) {
if (fs.existsSync(filePath)) {
const file = fs.readFileSync(filePath, "utf-8");

// pega: case "cmd"
const regex = /case\s+["'](.*?)["']/g;

let match;
while ((match = regex.exec(file)) !== null) {
if (match[1]) comandos.push(match[1]);
}
}
}

// remove duplicados
const unicos = [...new Set(comandos.filter(Boolean))].sort();

// categorias reais baseadas na sua Lara Bot
const categorias = {
dono: [
"dono","owner","menudono","case","cases","restart","reviver","clear",
"lara","prefixo","prefixo-bot","nome-bot","nome-dona","sender","key"
],

adm: [
"ban","b","promover","rebaixar","admins","adms","mute","desmute",
"clear","limpar","deleta","citar","cita","marcar","marca","checkativo",
"antilink","antilinkgp","antiimg","antivideo","antidoc","antiloc",
"antisticker","anticontato","antiaudio","antienquete","antistatus",
"antipalavrao","escudo","x9","soadm","grupo","linkgp","tdsgp"
],

download: [
"play","playvideo","tiktok","instagram","insta","facebook","kwai",
"pinterest","img","imagem","video","audio","download"
],

pesquisa: [
"info","comando","ping","traduzir","encurtar","gerarlink","calc",
"calcular","signo","tabela","letras","simbolos","perfil","me","eu"
],

brincadeiras: [
"dado","ppt","caraoucoroa","qi","corno","gay","hetero","rico","pobre",
"bebado","ship","casal","tapa","beijo","morte","treta","roletarussa",
"sorteio","verdade","desafio","mimimi","boladecristal","eununca"
],

logos: [
"fluffy","lava","cool","fire","galaxy","glitch","metallic","dragonfire",
"goldpink","halloween","neon","retro","chrome","space","amongus","snow",
"america","captain","blackpink","deadpool","graffitiwall","phlogo",
"glitter","vintage3d"
]
};

let contagem = {
dono: 0,
adm: 0,
download: 0,
pesquisa: 0,
brincadeiras: 0,
logos: 0,
outros: 0
};

// classifica
for (const cmd of unicos) {
const lower = cmd.toLowerCase();
let found = false;

for (const [cat, list] of Object.entries(categorias)) {
if (list.some(k => lower.includes(k))) {
contagem[cat]++;
found = true;
break;
}
}

if (!found) contagem.outros++;
}

// texto final
const texto = `
╭━━━━━━━━━━━━━━━━━━━╮
     📊 ESTATÍSTICAS DE CASES
╰━━━━━━━━━━━━━━━━━━━╯

📦 *Total:* ${unicos.length} comandos

👑 *Dono:* ${contagem.dono}
🛡️ *Administração:* ${contagem.adm}
📥 *Download:* ${contagem.download}
🔍 *Pesquisa:* ${contagem.pesquisa}
🎭 *Brincadeiras:* ${contagem.brincadeiras}
🎨 *Logos:* ${contagem.logos}
📁 *Outros:* ${contagem.outros}

📂 *Arquivos lidos:* index.js + conectar.js

╭━━━━━━━━━━━━━━━━━━━━╮
      📜 LISTA COMPLETA
╰━━━━━━━━━━━━━━━━━━━━╯

${unicos.map(c => `➤ ${prefix}${c}`).join("\n")}
`;

await enviar(texto);

} catch (e) {
await enviar("❌ Erro ao puxar cases: " + e.message);
}
break;

case 'listagp': {
try {
if (!isDono) return enviar(mes.dono());
const getGroups = await lara.groupFetchAllParticipating();
const groups = Object.values(getGroups).sort((a, b) =>
(a.subject || "").localeCompare(b.subject || "")
);
if (groups.length === 0) {
return enviar("❌ *Nenhum grupo encontrado!*\n\nO bot não está em nenhum grupo no momento.");
}
let groupList = '';
const promises = groups.map(async (g, i) => {
const createdAt = g.creation
? new Date(g.creation * 1000).toLocaleString('pt-BR', {
weekday: 'long',
day: 'numeric',
month: 'long',
year: 'numeric',
hour: '2-digit',
minute: '2-digit'
})
: "Desconhecida";
const owner = g.ownerJid ? g.ownerJid.split('@')[0] : "Desconhecido";
const participantsCount = g.participants?.length || 0;
const adminCount = g.participants
? g.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length
: 0;
const type = g.isCommunity ? "🌐 Comunidade" : "👥 Grupo";
let link = "🔒 Indisponível";
try {
const code = await lara.groupInviteCode(g.id);
link = `https://chat.whatsapp.com/${code}`;
} catch {
link = "🔒 Indisponível";
}
return `
┌───────────────────
│ ✨ *[${i + 1}]* ${g.subject}
├───────────────────
  🆔 ID: ${g.id}
  📅 Criado: ${createdAt}
  👑 Criador: @${owner}
  👥 Membros: ${participantsCount}
  🛡️ Admins: ${adminCount}
  📌 Tipo: ${type}
  🔗 Link: ${link}
└──────────────────`;
});
const result = await Promise.all(promises);
groupList = result.join("\n\n");
const totalGrupos = groups.length;
const totalMembros = groups.reduce((acc, g) => acc + (g.participants?.length || 0), 0);
const mensagem = `╭━━━━━━━━━━━━━━━━━━━╮
          📋 *LISTA DE GRUPOS*         
             🤖 *LARA BOT*             
╰━━━━━━━━━━━━━━━━━━━━╯
┌──────────────────────
   📊 *RESUMO GERAL*
├──────────────────────
  📌 Total de Grupos: *${totalGrupos}*
  👥 Total de Membros: *${totalMembros}*
└──────────────────────
${groupList}
╭━━━━━━━━━━━━━━━━━━━━━╮
          💡 *COMANDOS ÚTEIS*        
                                     
  📍 ${prefix}sairgp <número>        
  🔄 ${prefix}entrargp <link>        
  ⚙️ ${prefix}lara <número>          
  🔍 ${prefix}listagp                
                                     
╰━━━━━━━━━━━━━━━━━━━━━╯`;  
return enviar(mensagem);    
} catch (e) {
return enviar(mes.error());
}
}
break;

case "sairgp": {
if (!isDono) return enviar("❌ *Acesso Negado!*\n\nApenas o dono pode usar este comando.");  
const num = parseInt(args[0]);
if (!num || isNaN(num)) {
return enviar(`╭━━━━━━━━━━━━━━━━━━╮
┃      🚪 *COMO SAIR DO GRUPO*     
╰━━━━━━━━━━━━━━━━━━╯
┌───────────────────────
  📋 *Use o comando da seguinte forma:*

  🔹 ${prefix}sairgp [número]

  📌 *Exemplo:*
  ${prefix}sairgp 3

  🔍 *Para ver a lista de grupos:*
  ${prefix}listagp
└───────────────────────`);
  }  
  // 🔥 MESMA ORDENAÇÃO DO listagp
const getGroups = await lara.groupFetchAllParticipating();
const groups = Object.values(getGroups).sort((a, b) =>
(a.subject || "").localeCompare(b.subject || "")
);
if (num < 1 || num > groups.length) {
return enviar(`❌ *Grupo não encontrado!*\n\n📊 Total de grupos: ${groups.length}\n\n📋 Use ${prefix}listagp para ver a lista atualizada.`);
}
const group = groups[num - 1];
const jid = group.id;
const nome = group.subject;
const participantes = group.participants?.length || 0;
const mensagemConfirmacao = `╭━━━━━━━━━━━━━━━━━━━━╮
┃     🚪 *SAINDO DO GRUPO*       
╰━━━━━━━━━━━━━━━━━━━━╯
┌────────────────────
│ 📌 *Grupo:* ${nome}
│ 👥 *Membros:* ${participantes}
│ 🆔 *ID:* ${jid.split("@")[0]}
│
├────────────────────
│ ⏳ *Processando...*
└────────────────────`; 
await enviar(mensagemConfirmacao);
try {
await lara.groupLeave(jid);
const mensagemSucesso = `╭━━━━━━━━━━━━━━━━━━━━╮
┃     ✅ *SAÍDA REALIZADA*       
╰━━━━━━━━━━━━━━━━━━━━╯
┌────────────────────
│ 🚪 *Saí do grupo com sucesso!*
│
│ 📌 *Grupo:* ${nome}
│
│ 💡 Use ${prefix}entrargp para
│    entrar em novos grupos.
└────────────────────`;
return enviar(mensagemSucesso);
} catch (e) {
const mensagemErro = `╭━━━━━━━━━━━━━━━━━━━━╮
┃     ❌ *ERRO AO SAIR*         
╰━━━━━━━━━━━━━━━━━━━━╯
┌────────────────────
│ ❌ *Não consegui sair do grupo:*
│
│ 📌 ${nome}
│
│ 🔍 *Possíveis motivos:*
│ • Bot já saiu do grupo
│ • Grupo foi deletado
│ • Erro de conexão
│
│ 💡 Tente novamente mais tarde.
└────────────────────`;
return enviar(mensagemErro);
}
}
break;

case "entrargp": {
  await react("🔗");
if (!isDono) return enviar("❌ Apenas o dono pode usar.");
let link = q?.trim();
if (!link || !link.includes("chat.whatsapp.com")) {
return enviar("❌ Envie um link de grupo válido.");
}
  // 🔥 LIMPA LINK (remove parâmetros extras)
const code = link.split("chat.whatsapp.com/")[1]?.split("?")[0];
if (!code) {
return enviar("❌ Código do grupo inválido.");
}
try {
await enviar("🔄 Entrando no grupo...");
await lara.groupAcceptInvite(code);
return enviar("✅ Entrei no grupo com sucesso!");
} catch (e) {
return enviar("❌ Falha ao entrar no grupo. Pode ser: link inválido ou convite expirado.");
}
}

case "donos": {
await react("👑");
  // 🔒 só dono principal usa
if (!isDono) return enviar("❌ Apenas o dono principal pode usar.");
if (!args[0]) {
return enviar(`❌ Use assim:
${prefix}donos 556199999999`);
}
let numero = args[0].replace(/\D/g, "") + "@s.whatsapp.net";
  // 🔹 cria lista se não existir
if (!global.donos) global.donos = [];
  // 🔒 limite de 3 donos
if (global.donos.length >= 3) {
return enviar("❌ Limite de 3 donos atingido.");
}
  // ❌ evitar duplicado
if (global.donos.includes(numero)) {
return enviar("❌ Esse número já é dono.");
}
  // ✅ adiciona
global.donos.push(numero);
  enviar(`✅ Novo dono adicionado:
@${numero.split("@")[0]}`, [numero]);
}
break;

case "rmdono": {
await react("❌");
if (!isOwner) return enviar("❌ Apenas o dono principal pode usar.");
if (!args[0]) return enviar(`Use:
${prefix}rmdono 556199999999`);
let numero = args[0].replace(/\D/g, "") + "@s.whatsapp.net";
if (!global.donos || !global.donos.includes(numero)) {
return enviar("❌ Esse número não é dono.");
}
global.donos = global.donos.filter(n => n !== numero);
enviar(`✅ Dono removido:
@${numero.split("@")[0]}`, [numero]);
}
break



// ==================== COMANDO MUTE ====================//
case "mute": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
    
let alvo = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
m.message?.extendedTextMessage?.contextInfo?.participant;
               
if (!alvo) return enviar(`❌ Marque o usuário para mutar.`);
    
if (!group.mute) group.mute = [];
if (group.mute.includes(alvo)) return enviar("⚠️ Usuário já mutado.");
    
group.mute.push(alvo);
saveGroup(from, group);
    
await react("🔇");
return enviar(`🔇 @${alvo.split("@")[0]} foi mutado. Se falar, será banido!`, { mentions: [alvo] });
}
break;

// ==================== COMANDO DESMUTE ====================//
case "desmute": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
    
let alvo = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
m.message?.extendedTextMessage?.contextInfo?.participant;
               
if (!alvo) return enviar(`❌ Marque o usuário para desmutar.`);
    
if (!group.mute || !group.mute.includes(alvo)) return enviar("⚠️ Este usuário não está na lista de mutados.");
    
group.mute = group.mute.filter(id => id !== alvo);
saveGroup(from, group);
    
await react("🔊");
return enviar(`🔊 @${alvo.split("@")[0]} foi desmutado e agora pode falar novamente.`, { mentions: [alvo] });
}
break;



case "antilink": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// alterna sozinho
group.antilink = !group.antilink;
saveGroup(from, group);
enviar(`✅ Antilink ${group.antilink ? "ativado" : "desativado"}!`);
}
break;

case "antistatus": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
group.antistatus = !group.antistatus;
saveGroup(from, group);
enviar(`✅ Antistatus ${group.antistatus ? "ativado" : "desativado"}!`);}
break;

case "antilinkgp": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// alterna automaticamente
group.antilinkgp = !group.antilinkgp;
saveGroup(from, group);
enviar(`✅ Antilink GP ${group.antilinkgp ? "ativado" : "desativado"}!`);
}
break;

case "linkgp": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
try {
const codigo = await lara.groupInviteCode(from);
const link = `https://chat.whatsapp.com/${codigo}`;
const texto = `✅ *Link de convite do grupo gerado com sucesso!*
_______________________________
🔗 ${link}
_______________________________

⚠️ *Atenção:* Compartilhe apenas com pessoas de confiança, e grupos de divulgações de links.`;
await enviar(texto);
} catch (e) {

enviar("❌ Erro ao gerar link do grupo.");
}
}
break;

case "antiimg": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.antiimg = group.antiimg || false;
// alterna
group.antiimg = !group.antiimg;
saveGroup(from, group);
enviar(`✅ Anti-imagem ${group.antiimg ? "ativado" : "desativado"}!`);
}
break;

case "anticallgp": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm) return enviar(msgs.soAdm);
// garante valor padrão
group.anticall = group.anticall || false;
// alterna
group.anticall = !group.anticall;
saveGroup(from, group);
enviar(`✅ Anti-call em grupo ${group.anticall ? "ativado" : "desativado"}!`);
}
break;

case "antivideo": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.antivideo = group.antivideo || false;
// alterna
group.antivideo = !group.antivideo;
saveGroup(from, group);
enviar(`✅ Anti-vídeo ${group.antivideo ? "ativado" : "desativado"}!`);
}
break;

case "antidoc": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.antidoc = group.antidoc || false;
// alterna
group.antidoc = !group.antidoc;
saveGroup(from, group);
enviar(`✅ Anti-documento ${group.antidoc ? "ativado" : "desativado"}!`);
}
break;

case "antiloc": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.antiloc = group.antiloc || false;
// alterna
group.antiloc = !group.antiloc;
saveGroup(from, group);
enviar(`✅ Anti-localização ${group.antiloc ? "ativado" : "desativado"}!`);
}
break;

case "antisticker": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.antisticker = group.antisticker || false;
// alterna
group.antisticker = !group.antisticker;
saveGroup(from, group);
enviar(`✅ Anti-sticker ${group.antisticker ? "ativado" : "desativado"}!`);
}
break;

case "anticontato": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.anticontato = group.anticontato || false;
// alterna
group.anticontato = !group.anticontato;
saveGroup(from, group);
enviar(`✅ Anti-contato ${group.anticontato ? "ativado" : "desativado"}!`);
}
break;

case "antiaudio": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.antiaudio = group.antiaudio || false;
// alterna
group.antiaudio = !group.antiaudio;
saveGroup(from, group);
enviar(`✅ Anti-áudio ${group.antiaudio ? "ativado" : "desativado"}!`);
}
break;

case "antienquete": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.antienquete = group.antienquete || false;
// alterna
group.antienquete = !group.antienquete;
saveGroup(from, group);
enviar(`✅ Anti-enquete ${group.antienquete ? "ativado" : "desativado"}!`);
}
break;

case "gerarlink": {
try {
if (!quoted) return enviar("❌ Marque uma imagem, vídeo ou gif!");
let msg = quoted;
let tipo = Object.keys(msg)[0];
// corrige viewOnce
if (tipo === "viewOnceMessage" || tipo === "viewOnceMessageV2") {
msg = msg[tipo].message;
tipo = Object.keys(msg)[0];
}
if (!["imageMessage", "videoMessage"].includes(tipo)) {
return enviar("❌ Apenas imagem, vídeo ou gif!");
}
// baixar mídia
const stream = await downloadContentFromMessage(
msg[tipo],
tipo === "imageMessage" ? "image" : "video"
);
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);
}
// 🔥 upload pra SUA API
const form = new FormData();
form.append("file", buffer, "arquivo");
const res = await axios.post("http://api.lotushops.com.br/upload", form, {
headers: {
...form.getHeaders()
}
});
const link = res.data.link || res.data.url || res.data;
// resposta
await enviar(`✅ *Link gerado com sucesso!*
_______________________________
🔗 ${link}
_______________________________
📌 Clique para visualizar.`);
} catch (e) {
enviar("❌ Erro ao gerar link.");
}
}
break;
      
// ======== AUTAS PROTEÇÃO E BV ============
case "bemvindo": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.bemvindo = group.bemvindo || false;
// alterna
group.bemvindo = !group.bemvindo;
saveGroup(from, group);
enviar(`✅ Sistema de boas-vindas ${group.bemvindo ? "ativado" : "desativado"}!`);
}
break;

case "autofigu": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.autofigu = group.autofigu || false;
// alterna
group.autofigu = !group.autofigu;
saveGroup(from, group);
enviar(`✅ Autofigu ${group.autofigu ? "ativado" : "desativado"}!`);
}
break;

case "x9": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.x9 = group.x9 || false;
// alterna
group.x9 = !group.x9;
saveGroup(from, group);
enviar(`✅ X9 ${group.x9 ? "ativado" : "desativado"}!`);
}
break;

case "soadm": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isDono) return enviar(msgs.soDono);
// garante valor padrão
group.soadm = group.soadm || false;
// alterna
group.soadm = !group.soadm;
saveGroup(from, group);
enviar(`✅ Modo só ADM ${group.soadm ? "ativado" : "desativado"}!`);
}
break;

case "autorepo": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.autorepo = group.autorepo || false;
// alterna
group.autorepo = !group.autorepo;
saveGroup(from, group);
enviar(`✅ Autorepo ${group.autorepo ? "ativado" : "desativado"}!`);
}
break;

case "modobrincadeira": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
// garante valor padrão
group.modobrincadeira = group.modobrincadeira || false;
// alterna
group.modobrincadeira = !group.modobrincadeira;
saveGroup(from, group);
enviar(`✅ Modo brincadeira ${group.modobrincadeira ? "ativado" : "desativado"}!`);
}
break;

case "status": 
case "dados": {
if (!isDono) { return enviar("❌ Apenas o dono do bot pode usar este comando.");}
if (!isGroup) return enviar(msgs.soGrupo);
await react("💣");
const groupPath = `./lara/chats/${from}.json`;
let rawConfig = {};
if (fs.existsSync(groupPath)) {
rawConfig = JSON.parse(fs.readFileSync(groupPath, "utf-8"));}
const normalizedConfig = {};
for (const [key, value] of Object.entries(rawConfig)) {
normalizedConfig[key.toLowerCase()] = value;}
const getStatusValue = (key) => {
const lowerKey = key.toLowerCase();
return normalizedConfig.hasOwnProperty(lowerKey) ? normalizedConfig[lowerKey] : false; 
};

const recursos = {
    x9: getStatusValue("x9"),
    soadm: getStatusValue("soadm"),
    autorepo: getStatusValue("autorepo"),
    modobrincadeira: getStatusValue("modobrincadeira"),
    escudo: getStatusValue("escudo"),
    autofigu: getStatusValue("autofigu"),
    bemvindo: getStatusValue("bemvindo"),
    antilinkgp: getStatusValue("antilinkgp"),
    antilink: getStatusValue("antilink"),
    antistatus: getStatusValue("antistatus"),
    antidoc: getStatusValue("antidoc"),
    antiloc: getStatusValue("antiloc"),
    antisticker: getStatusValue("antisticker"),
    anticontato: getStatusValue("anticontato"),
    antipalavrão: getStatusValue("antipalavrao"),
    antiaudio: getStatusValue("antiaudio"),
    antivideo: getStatusValue("antivideo"),
    antiimg: getStatusValue("antiimg"),
    antienquete: getStatusValue("antienquete")
  };

const status = (value) => (value === true ? "✅" : "⛔");
const cmdWidth = 18;
const pad = (str, width) => str.padEnd(width, " ");

const metadata = await lara.groupMetadata(from);
const nomeGrupo = metadata.subject;
const membros = participants.length;
const adminsCount = admins.length;

const caption = `━〔 🌀 CONFIGURAÇÕES 🌀 〕━

👤 Usuário: @${sender.split("@")[0]}
💬 Grupo: ${nomeGrupo}
👥 Membros: ${membros}  │ 👑 ADMs: ${adminsCount}
🕒 Hora: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}

━〔 🌐 RECURSOS GERAIS 🌐 〕━
 ${pad(`💢 ${prefix}x9`, cmdWidth)} ${status(recursos.x9)}
 ${pad(`💢 ${prefix}soadm`, cmdWidth)} ${status(recursos.soadm)}
 ${pad(`💢 ${prefix}autorepo`, cmdWidth)} ${status(recursos.autorepo)}
 ${pad(`💢 ${prefix}modobrincadeira`, cmdWidth)} ${status(recursos.modobrincadeira)}
 ${pad(`💢 ${prefix}escudo`, cmdWidth)} ${status(recursos.escudo)}
 ${pad(`💢 ${prefix}autofigu`, cmdWidth)} ${status(recursos.autofigu)}
 ${pad(`💢 ${prefix}bemvindo`, cmdWidth)} ${status(recursos.bemvindo)}

━〔 💣 AUTO-BANIMENTO 💣 〕━
 ${pad(`💢 ${prefix}antilinkgp`, cmdWidth)} ${status(recursos.antilinkgp)}
 ${pad(`💢 ${prefix}antilink`, cmdWidth)} ${status(recursos.antilink)}
 ${pad(`💢 ${prefix}antistatus`, cmdWidth)} ${status(recursos.antistatus)}
 ${pad(`💢 ${prefix}antidoc`, cmdWidth)} ${status(recursos.antidoc)}
 ${pad(`💢 ${prefix}antiloc`, cmdWidth)} ${status(recursos.antiloc)}
 ${pad(`💢 ${prefix}antisticker`, cmdWidth)} ${status(recursos.antisticker)}
 ${pad(`💢 ${prefix}antipalavrão`, cmdWidth)} ${group?.antipalavrao?.ativo ? "✅" : "⛔"}
 ${pad(`💢 ${prefix}anticontato`, cmdWidth)} ${status(recursos.anticontato)}
 ${pad(`💢 ${prefix}antiaudio`, cmdWidth)} ${status(recursos.antiaudio)}
 ${pad(`💢 ${prefix}antivideo`, cmdWidth)} ${status(recursos.antivideo)}
 ${pad(`💢 ${prefix}antiimg`, cmdWidth)} ${status(recursos.antiimg)}
 ${pad(`💢 ${prefix}antienquete`, cmdWidth)} ${status(recursos.antienquete)}

━━━━━━━━━━━━━━━━━━━━━━
✨ Mantenha o grupo organizado e seguro!`;

await lara.sendMessage(
from,
{
image: { url: logo },
caption: caption,
mentions: [sender],
},
{ quoted: m }
);
break;
}


case "adms":
case "admins": {
if (!isGroup) return enviar(msgs.soGrupo);
try {
const metadata = await lara.groupMetadata(from);
const participants = metadata.participants || [];
const admins = participants
  .filter(p => p.admin)
  .map(p => p.id || p.lid);
let txt = `
━〔 📢 CHAMANDO ADMINS 〕━

`;

admins.forEach(num => {
  txt += `┃ 👤 @${num.split("@")[0]}\n`;
});

txt += `
━━━━━━━━━━━━━━━━━━
⚠️ Atenção necessária no grupo!`;
await lara.sendMessage(from, {
text: txt,
mentions: admins
}, { quoted: m });
} catch (err) {

return enviar(msgs.erro)}}
break;

case "promover": 
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
if (!mentioned) return enviar('❌ Marque a pessoa que deseja promover');
await lara.groupParticipantsUpdate(from, mentioned, "promote")
await lara.sendMessage(from, {
text: `👑 @${mentioned[0].split("@")[0]} agora é administrador!`,
mentions: mentioned
}, { quoted: m });
break;

case "rebaixar": 
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
if (!mentioned) return enviar('❌ Marque a pessoa que deseja rebaixar');
await lara.groupParticipantsUpdate(from, mentioned, "demote");
await lara.sendMessage(from, {
text: `⚠️ @${mentioned[0].split("@")[0]} não é mais administrador.`,
mentions: mentioned
}, { quoted: m })
break;

// ======= BOAS-VINDAS (COMANDO DIRETO) ===========
case "bemvindo": case "bv": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isDono) return enviar("❌ Apenas o dono do bot pode usar este comando!");
group.bemvindo = !group.bemvindo;
saveGroup(from, group);
const status = group.bemvindo ? "✅ ATIVADO" : "❌ DESATIVADO";
const comImagem = group.bemvindoComImagem ? "COM imagem" : "SEM imagem";
enviar(`🔔 *SISTEMA DE BOAS-VINDAS*\n\n${status}\n📸 ${comImagem}\n\nUse *${prefix}legendabv* para configurar a mensagem.`)}
break;

// ===== CONFIGURAR MENSAGEM DE BOAS-VINDAS =====
case "legendabv": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
if (!q) { return enviar(`❌ Use assim:

${prefix}legendabv Seu texto aqui

📌 Variáveis disponíveis:
#numerodele#
#nomedogp#
#descricao#`);}
group.legbemvindo = q;
saveGroup(from, group);
enviar("✅ Legenda de *bem-vindo* atualizada!");}
break;

// === ATIVAR/DESATIVAR IMAGEM NAS BOAS-VINDAS ====
case "bemvindoimg": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isDono) return enviar("❌ Apenas o dono do bot pode usar!");
group.bemvindoComImagem = !group.bemvindoComImagem;
saveGroup(from, group);
const status = group.bemvindoComImagem ? "✅ ATIVADA" : "❌ DESATIVADA";
    enviar(`🖼️ *IMAGEM NAS BOAS-VINDAS*\n\n${status}\n\nUse *${prefix}bemvindofoto* para alterar a imagem.`);
}
break;

// ==== ALTERAR IMAGEM DE BOAS-VINDAS ===========

case "bemvindofoto": {
if (!isDono) return enviar(msgs.soDono);
if (!quoted) return enviar("❌ Responda uma imagem válida.");
try {
const msg = quoted.message || quoted;
const type = Object.keys(msg || {}).find(
(k) => k.includes("ImageMessage") || k.includes("imageMessage"));
if (!type) return enviar("❌ A mensagem respondida não é uma imagem.");
const stream = await downloadContentFromMessage(msg[type], "image");
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);}
const path = "./base/temp_bemvindo.jpg";
fs.writeFileSync(path, buffer);
const link = await upload(path);
const filePath = "./base/links.json";
let data = {};
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath))}
data.Bemvindo = link;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
global.links = data;
fs.unlinkSync(path);
return enviar("✅ Foto de *BEM-VINDO* atualizada!\n\n🔗 " + link);
} catch (e) {
return enviar("❌ Erro ao atualizar foto de bem-vindo.");}}
break;

// ========== SAÍDA (COMANDO DIRETO) ===============
case "saida": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isDono) return enviar("❌ Apenas o dono do bot pode usar este comando!");    
    // Alterna direto (liga/desliga)
group.saidaAtivo = !group.saidaAtivo;
saveGroup(from, group);    
const status = group.saidaAtivo ? "✅ ATIVADO" : "❌ DESATIVADO";
const comImagem = group.saidaComImagem ? "COM imagem" : "SEM imagem";
enviar(`🚪 *SISTEMA DE SAÍDA*\n\n${status}\n📸 ${comImagem}\n\nUse *${prefix}legendasaiu* para configurar a mensagem.`);
}
break;

// ==== CONFIGURAR MENSAGEM DE SAÍDA ===========//
case "legendasaiu": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
if (!q) { return enviar(`❌ Use assim:

${prefix}legendasaiu Seu texto aqui

📌 Variáveis disponíveis:
#numerodele#
#nomedogp#
#descricao#`);}
group.legsaiu = q;
saveGroup(from, group);

enviar("✅ Legenda de *saída* atualizada!");}
break;

// ===== ALTERAR IMAGEM DE SAÍDA ================
case "saidafoto": {
if (!isDono) return enviar(msgs.soDono);
if (!quoted) return enviar("❌ Responda uma imagem válida.");
try {
const msg = quoted.message || quoted;
const type = Object.keys(msg || {}).find(
  (k) => k.includes("ImageMessage") || k.includes("imageMessage"));
if (!type) return enviar("❌ A mensagem respondida não é uma imagem.");
const stream = await downloadContentFromMessage(msg[type], "image");
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);}
const path = "./base/temp_saida.jpg";
fs.writeFileSync(path, buffer);
const link = await upload(path);
const filePath = "./base/links.json";
let data = {};
if (fs.existsSync(filePath)) {
  data = JSON.parse(fs.readFileSync(filePath));}
data.Saida = link;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
global.links = data;
fs.unlinkSync(path);
return enviar("✅ Foto de *SAÍDA* atualizada!\n\n🔗 " + link);
} catch (e) {
return enviar("❌ Erro ao atualizar foto de saída.");}}
break;

// ============ VER CONFIGURAÇÕES ===============
case "configbv": {
if (!isGroup) return enviar(msgs.soGrupo);
const welcomeStatus = group.bemvindo ? "✅ ATIVADO" : "❌ DESATIVADO";
const welcomeImg = group.bemvindoComImagem ? "✅ COM imagem" : "❌ SEM imagem";
const welcomeMsg = group.welcome?.text || "Não configurada";
const exitStatus = group.saidaAtivo ? "✅ ATIVADO" : "❌ DESATIVADO";
const exitImg = group.saidaComImagem ? "✅ COM imagem" : "❌ SEM imagem";
const exitMsg = group.exit?.text || "Não configurada";
    
    enviar(`╭━〔📋CONFIGURAÇÕES DO GRUPO〕━

 👋 *BOAS-VINDAS*
 Status: ${welcomeStatus}
 Imagem: ${welcomeImg}
 Mensagem: ${welcomeMsg.substring(0, 40)}${welcomeMsg.length > 40 ? "..." : ""}

 🚪 *SAÍDA*
 Status: ${exitStatus}
 Imagem: ${exitImg}
 Mensagem: ${exitMsg.substring(0, 40)}${exitMsg.length > 40 ? "..." : ""}

╰━━━━━━━━━━━━━━━━━━

📌 *COMANDOS RÁPIDOS:*
• ${prefix}bemvindo - Liga/Desliga
• ${prefix}legendabv [msg] - Configurar mensagem
• ${prefix}bemvindoimg - Liga/Desliga imagem
• ${prefix}bemvindofoto - Altera imagem
• ${prefix}saida - Liga/Desliga
• ${prefix}legendasaiu [msg] - Configurar mensagem
• ${prefix}saidafoto - Altera imagem`);
}
break;

case "sorteio": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
const metadata = await lara.groupMetadata(from);
const participantes = metadata.participants.map(p => p.id);
const filtrados = participantes.filter(v => v !== lara.user.id);
const escolhido = filtrados[Math.floor(Math.random() * filtrados.length)];
const premio = q || "um prêmio misterioso 🎁";
await lara.sendMessage(from, {
text: `━━━━━━━━━━━━━━━━━━━━
        🎁 SORTEIO
━━━━━━━━━━━━━━━━━━━━

🎲 Sorteando ${premio}...

⏳ Aguarde...`
}, { quoted: m });
setTimeout(async () => {
await lara.sendMessage(from, {
text: `
━━━━━━━━━━━━━━━━━━━━
       🎉 RESULTADO
━━━━━━━━━━━━━━━━━━━━

🏆 Vencedor: @${escolhido.split("@")[0]}
🎁 Prêmio: ${premio}

Parabéns procure um administrador 🎊`,
mentions: [escolhido]
}, { quoted: m });
}, 2000)}
break;

case 'totag':
case 'cita':
case 'citar':
case 'hidetag':
try {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);

var DFC4 = "";

var rsm4 =
m.message?.extendedTextMessage?.contextInfo?.quotedMessage;

if (!rsm4) {
return enviar("❌ marque uma mensagem");
}

var pink4 =
isQuotedImage
? rsm4?.imageMessage
: m.message?.imageMessage;

var blue4 =
isQuotedVideo
? rsm4?.videoMessage
: m.message?.videoMessage;

var purple4 =
isQuotedDocument
? rsm4?.documentMessage
: m.message?.documentMessage;

var yellow4 =
isQuotedDocW
? rsm4?.documentWithCaptionMessage?.message?.documentMessage
: m.message?.documentWithCaptionMessage?.message?.documentMessage;

var aud_d4 =
isQuotedAudio
? rsm4?.audioMessage
: "";

var figu_d4 =
isQuotedSticker
? rsm4?.stickerMessage
: "";

var red4 =
isQuotedMsg &&
!aud_d4 &&
!figu_d4 &&
!pink4 &&
!blue4 &&
!purple4 &&
!yellow4
? rsm4?.conversation
: m.message?.conversation;

var green4 =
rsm4?.extendedTextMessage?.text ||
m?.message?.extendedTextMessage?.text;

const metadata =
await lara.groupMetadata(from);

const participantes =
metadata.participants.map(
p => p.id
);

const type =
Object.keys(rsm4)[0];

        // ==========================================
        // IMAGEM
        // ==========================================

if (type === "imageMessage") {

const stream =
await downloadContentFromMessage(
rsm4.imageMessage,
"image"
);

let buffer =
Buffer.from([]);

for await (const chunk of stream) {
buffer = Buffer.concat([
buffer,
chunk
]);
}

await lara.sendMessage(from, {
image: buffer,
caption:
rsm4.imageMessage.caption || "",
mentions: participantes
});

        // ==========================================
        // VÍDEO
        // ==========================================

} else if (type === "videoMessage") {

const stream =
await downloadContentFromMessage(
rsm4.videoMessage,
"video"
);

let buffer =
Buffer.from([]);

for await (const chunk of stream) {
buffer = Buffer.concat([
                    buffer,
chunk
]);
}

await lara.sendMessage(from, {
video: buffer,
caption:
rsm4.videoMessage.caption || "",
mentions: participantes
});

        // ==========================================
        // ÁUDIO
        // ==========================================

} else if (type === "audioMessage") {

const stream =
await downloadContentFromMessage(
rsm4.audioMessage,
"audio"
);

let buffer =
Buffer.from([]);

for await (const chunk of stream) {
buffer = Buffer.concat([
buffer,
chunk
]);
}

await lara.sendMessage(from, {
audio: buffer,
mimetype: "audio/mpeg",
mentions: participantes
});

        // ==========================================
        // FIGURINHA
        // ==========================================

} else if (type === "stickerMessage") {

const stream =
await downloadContentFromMessage(
rsm4.stickerMessage,
"sticker"
);

let buffer =
Buffer.from([]);

for await (const chunk of stream) {
buffer = Buffer.concat([
buffer,
chunk
]);
}

await lara.sendMessage(from, {
sticker: buffer,
mentions: participantes
});

        // ==========================================
        // TEXTO
        // ==========================================

} else {

const text =
rsm4.conversation ||
rsm4.extendedTextMessage?.text;

if (!text) {
return enviar("❌ marque uma mensagem");
}

await lara.sendMessage(from, {
text,
mentions: participantes
});
}

} catch (error) {
console.error("[CITA] Erro:", error);
await enviar(msgs.error);
}

    break;

case "marca":
case "marcar": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
const metadata = await lara.groupMetadata(from);
const participantes = metadata.participants.map(p => p.id);
const nome = m.pushName || "Administrador";
const mensagem = q ? `\n💬 Mensagem: ${q}` : "";
const lista = participantes.map(v => `@${v.split("@")[0]}`).join("\n");
const texto = `
╭━━━━━━━━━━━━━━━━━━━━╮
        📢 MARCAÇÃO
╰━━━━━━━━━━━━━━━━━━━━╯

👤 Adm: ${nome}
👥 Total: ${participantes.length}${mensagem}

${lista}`;
await lara.sendMessage(from, {
text: texto,
mentions: participantes
}, { quoted: m })}
break;

case "limpar": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
const vazio = ("\n".repeat(5000)) + ("\u200B".repeat(4000));
await lara.sendMessage(from, {
text: vazio
}, { quoted: m })}
break;

case "rankativo": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!db[from]) return enviar("❌ Ainda não existe ranking.");
const ranking = Object.entries(db[from])
.sort((a, b) => (b[1].mensagens || 0) - (a[1].mensagens || 0))
.slice(0, 10);
let texto = `
╭━━━━━━━━━━━━━━━━━━━╮
      🏆 RANK ATIVO
╰━━━━━━━━━━━━━━━━━━━╯`;

ranking.forEach((user, i) => {
texto += `\n${i + 1}° - @${user[0].split("@")[0]} ➜ ${user[1].mensagens} msgs`;});
await lara.sendMessage(from, {
text: texto,
mentions: ranking.map(v => v[0])
}, { quoted: m })}
break;

case "zerarank": {
if (!isDono) return enviar(msgs.soDono);
if (!db[from]) return enviar("❌ Não existe ranking.");
delete db[from];
saveDB();
await enviar(`
╭━━━━━━━━━━━━━━━━━━━╮
      🧹 RANK RESETADO
╰━━━━━━━━━━━━━━━━━━━╯

Ranking zerado com sucesso.`)}
break;

case "checkativo": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
if (!mentionedJid || mentionedJid.length === 0) {
return enviar("❌ Marque um usuário.\nEx: .checkativo @usuario")}
const alvo = mentionedJid[0];
if (!db[from] || !db[from][alvo]) {
return enviar("❌ Esse usuário não tem dados.")}
const total = db[from][alvo].mensagens || 0;
await lara.sendMessage(from, {
text: `╭━━━━━━━━━━━━━━━━━━━━━━╮
     📊 CHECK ATIVO
╰━━━━━━━━━━━━━━━━━━━━━━╯

👤 Usuário: @${alvo.split("@")[0]}
💬 Mensagens: ${total}`,
mentions: [alvo]
}, { quoted: m });}
break;

case "rankinativo": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
if (!db[from]) return enviar("❌ Ainda não existe ranking.");
const ranking = Object.entries(db[from])
.sort((a, b) => (a[1].mensagens || 0) - (b[1].mensagens || 0))
.slice(0, 10);
let texto = `╭━━━━━━━━━━━━━━━━━━━━╮
     💤 RANK INATIVO
╰━━━━━━━━━━━━━━━━━━━━╯`;
ranking.forEach((user, i) => {
texto += `\n${i + 1}° - @${user[0].split("@")[0]} ➜ ${user[1].mensagens} msgs`;});
await lara.sendMessage(from, {
text: texto,
mentions: ranking.map(v => v[0])
}, { quoted: m })}
break;

case "d":
case "deleta": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
const ctxInfo = m.message?.extendedTextMessage. contextInfo;
if (!ctxInfo?.stanzaId) {
return enviar("❌ Responda a mensagem que deseja apagar.");
  }
const key = {
remoteJid: from,
fromMe: false,
id: ctxInfo.stanzaId,
participant: ctxInfo.participant
};
await lara.sendMessage(from, {
delete: key
});

break;
}


// ========== COMANDOS ANTI-PALAVRÃO ==========
case "antipalavrao": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
if (!group.antipalavrao) {
group.antipalavrao = { ativo: false, lista: [] };
}
group.antipalavrao.ativo = !group.antipalavrao.ativo;
saveGroup(from, group);
enviar( `🔇 *ANTI-PALAVRÃO*\n\n` + `Status: ${group.antipalavrao.ativo ? "✅ ATIVADO" : "❌ DESATIVADO"}\n`);
break;
}

case "addpalavrao":
case "adcionapalavrao": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
if (!q) return enviar(`❌ Use: ${prefix}addpalavrao [palavra]`);

const palavra = q.toLowerCase().trim();

if (!group.antipalavrao) {
group.antipalavrao = { ativo: false, lista: [] };
}

if (group.antipalavrao.lista.includes(palavra)) {
return enviar("⚠️ Essa palavra já existe na lista!");
}

group.antipalavrao.lista.push(palavra);
saveGroup(from, group);

enviar(`✅ Palavra *${palavra}* adicionada à lista.`);
break;
}
case "tirarpalavrao":
case "removerpalavrao": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
if (!q) return enviar(`❌ Use: ${prefix}tirarpalavrao [palavra]`);

const palavra = q.toLowerCase().trim();

if (!group.antipalavrao?.lista?.includes(palavra)) {
return enviar("❌ Essa palavra não está na lista!");
}

group.antipalavrao.lista = group.antipalavrao.lista.filter(p => p !== palavra);
saveGroup(from, group);

enviar(`✅ Palavra *${palavra}* removida.`);
break;
}

case "listapalavroes": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);

if (!group.antipalavrao?.lista?.length) {
return enviar("📋 Nenhuma palavra cadastrada.");
}

let texto = `🚫 *LISTA DE PALAVRÕES*\n\n`;

group.antipalavrao.lista.forEach((p, i) => {
texto += `${i + 1}. ${p}\n`;
});

texto += `\n📌 Total: ${group.antipalavrao.lista.length}`;

await enviar(texto);
break;
}

case "listanegra":
case "tirardalista": { if (!isGroup) return enviar(msgs.soGrupo); if (!isSoadm && !isDono) return enviar(msgs.soAdm); if (!q && command === "listanegra") { if (!group.listanegra?.length) { return enviar("📋 Lista negra vazia."); }; let txt = "🚫 *LISTA NEGRA:*\n\n"; group.listanegra.forEach((id, i) => { txt += `${i + 1}. @${id.split("@")[0]}\n`; }); return lara.sendMessage(from, { text: txt, mentions: group.listanegra }, { quoted: m });} let numero = q.replace(/\D/g, ""); if (!numero) return enviar("❌ Número inválido."); const jid = numero + "@s.whatsapp.net"; async function getLid(conn, jid, tentativas = 3) { for (let i = 0; i < tentativas; i++) { try { const res = await conn.onWhatsApp(jid); if (res?.[0]?.lid) return res[0].lid; } catch {}; await new Promise(r => setTimeout(r, 300));}; return null; }; const lid = await getLid(lara, jid); const clean = (jid) => (jid || "").split("@")[0].split(":")[0]; if (command === "tirardalista") { const antes = group.listanegra.length; group.listanegra = group.listanegra.filter(id => clean(id) !== numero ); saveGroup(from, group); if (group.listanegra.length === antes) { return enviar("❌ Esse número não está na lista negra.");}; return enviar(`✅ Removido da lista negra: ${numero}`);}; const existe = group.listanegra.some(id => clean(id) === numero ); if (existe) { return enviar("⚠️ Já está na lista negra.");}; group.listanegra.push(jid); if (lid) group.listanegra.push(lid); saveGroup(from, group); enviar(`🚫 Adicionado na lista negra: @${numero}`, { mentions: [jid]});} break;


case "d":
case "ban": {
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);   
let alvo;
let mensagemParaDeletarKey = null;
if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
alvo = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
} 
else if (quoted) { alvo = m.message.extendedTextMessage.contextInfo.participant;      
const contextInfo = m.message?.extendedTextMessage?.contextInfo;
if (contextInfo) {
mensagemParaDeletarKey = {
remoteJid: from,
id: contextInfo.stanzaId,
participant: contextInfo.participant };}}
if (!alvo) return enviar("❌ Marque ou responda a mensagem de alguém.");
const clean = jid => (jid || "").split("@")[0].split(":")[0];
if (clean(alvo) === clean(infobot)) {
return enviar("❌ Não posso remover a mim mesmo.");}
if (clean(alvo) === clean(Dono) || clean(alvo) === clean(lidDono)) {
return enviar("❌ Não posso remover o dono do bot.");}
if (clean(alvo) === clean(sender)) {
return enviar("❌ Você não pode remover a si mesmo.");}
try {
if (mensagemParaDeletarKey) {
await lara.sendMessage(from, { delete: mensagemParaDeletarKey });
} else {
await lara.sendMessage(from, { delete: m.key })}
} catch (err) {l
}   
await lara.groupParticipantsUpdate(from, [alvo], "remove");
await enviar("🎯 ALVO REMOVIDO! ✔️");
break;
}


case "grupo":
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
if (!q) return enviar(`❌ Use: ${prefix+command} a/f`);
if (q === "f") {
await lara.groupSettingUpdate(from, "announcement");
await enviar("🔒 grupo fechado")}
if (q === "a") {
await lara.groupSettingUpdate(from, "not_announcement");
await enviar("🔓 grupo aberto")}
break;

case "regras":
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
try {
const metadata = await lara.groupMetadata(from);
const nome = metadata.subject;
const desc = metadata.desc || "Sem descrição";
const membros = metadata.participants.length;
const totalAdmins = metadata.participants
 .filter(p => p.admin).length;
const criador = metadata.owner ? "@" + metadata.owner.split("@")[0]: "Desconhecido";
const link = await lara.groupInviteCode(from)
 .then(code => "https://chat.whatsapp.com/" + code)
 .catch(() => "Não disponível");
let foto = null;
try {
foto = await lara.profilePictureUrl(from, "image");
} catch {
foto = null; }
const texto =
`📜 *REGRAS / INFO DO GRUPO*

📛 Nome: ${nome}
👑 Criador: ${criador}
👥 Membros: ${membros}
🛡️ Total de admins: ${totalAdmins}
🔗 Link: ${link}

📌 Descrição:
${desc}`;
if (foto) {
await lara.sendMessage(from, {
image: { url: foto },
caption: texto,
mentions: metadata.owner ? [metadata.owner] : []
}, { quoted: m });
} else { await enviar(texto)}
} catch (err) {
await enviar("❌ erro ao pegar info")}
break

case "linkgp": { // pronto
if (!isGroup) return enviar(msgs.soGrupo);
if (!isBotAdm) return enviar(msgs.botadm);
if (!isSoadm && !isDono) return enviar(msgs.soAdm);
const link = await lara.groupInviteCode(from);
const textoLink = `━━━━━━━━━━━━━━━━━━━━━━━
        🔗 LINK DO GRUPO
━━━━━━━━━━━━━━━━━━━━━━━ \n\nAqui está o link do grupo 👇\n\nhttps://chat.whatsapp.com/${link}\n\nUse com responsabilidade.`;
await lara.sendMessage(from, {
text: textoLink
}, { quoted: m })}
break;


case 'nick': 
try {
if (!q) return enviar("Você precisa colocar nome na frente do comando!");
const url = laralotus+`sys/acoes/gerarnick?apikey=${larakey}&nome=${q}`;
const r = await fetch(url).then(v => v.json());
let txt = `🎭 *Nicks gerados para:* ${q}\n`;
txt += `🔢 *Total:* ${r.total}\n\n`;
r.resultados.forEach((nick, i) => {
txt += `*${i + 1}. ${nick}*\n`; });
return lara.sendMessage(from, { text: txt }, { quoted: m });
} catch (e) {
await enviar("error")}
break;

// ==== COMANDOS DE DOWNLOAD E PESQUISA ========
case "p": case "play": case "pv": case "playvideo": {
try {
const isVideo = command.includes("video") || command === "pv";
if (!q) return await enviar(`🔥 *E aí? Digita o nome do ${isVideo ? "vídeo" : "música"} pra mim, beleza?* 🎧`);
const Pqs = await fetchJson(`${laralotus}sys/infos/youtube?apikey=${larakey}&q=${q}`);
const toSeconds = (t) => {
const parts = t.split(":").map(Number);
return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];};
const res = Pqs.resultados.find(v => toSeconds(v.tempo) <= 1800);
if (!res) return await enviar("😭 *Nada encontrado... Tenta outro nome ou algo mais curto!* ⏱️");
let textoInfo = `🎧 ──── ⋆⋅☆⋅⋆ ──── 🎧\n` +
`${isVideo ? "🎬 Título:" : "🎵 Título:"} ${res.titulo}\n` +
`⏱️ Duração: ${res.tempo}\n` +
`📡 Fonte: YouTube\n` +
`⚡ ──── ⋆⋅☆⋅⋆ ──── ⚡\n\n` +
`⏳ *Bora lá, tô preparando seu negócio...*\n` +
`🔄 *Só um segundo!*`;
await lara.sendMessage(from, {image: {url: res.imagem}, caption: textoInfo}, {quoted: m});
if (isVideo) {
const videoUrl = `${laralotus}sys/down/playvideo?apikey=${larakey}&q=${res.url}`;
await lara.sendMessage(from, {video: {url: videoUrl}, mimetype: "video/mp4", fileName: `${res.titulo}.mp4`, caption: `🎬 *Tá na mão! Aproveita o vídeo* 🚀`}, {quoted: m});
} else {
const audioUrl = `${laralotus}sys/down/play?apikey=${larakey}&url=${res.url}`;
await lara.sendMessage(from, {audio: {url: audioUrl}, mimetype: "audio/mpeg", fileName: `${res.titulo}.mp3`}, {caption: `🎧 *Áudio enviado! Bora ouvir* 🎶`, quoted: m});
}
} catch (err) {
console.log(err)
await enviar("💥 *Ops, deu ruim... Tenta de novo mais tarde!* 🔁");}
}
break;

case "facebookaudio": case "facebookvídeo":  {
try {
const isAudio = command.includes("audio");
if (!q) return await enviar(`✨ *Anjo, mande o link do Facebook para eu baixar o ${isAudio ? "áudio" : "vídeo"}!* 🌸`);
const urlBase = `${laralotus}sys/down/face?apikey=${larakey}&url=${q}`;
const r = await fetchJson(isAudio ? `${urlBase}&type=audio` : urlBase);
if (!r.resultado) return await enviar("🥺 *Poxa, não consegui encontrar esse conteúdo...*");
if (isAudio) {
await lara.sendMessage(from, {audio: {url: r.resultado.audioUrl}, mimetype: 'audio/mp4'}, {quoted: m});
} else {
const v = r.resultado.links.hd || r.resultado.links.sd;
await lara.sendMessage(from, {video: {url: v}, caption: `✨ *${r.resultado.title || "Vídeo do Facebook"}* ✨`}, {quoted: m});}
} catch (e) {
await enviar("💖 *Houve um erro ao processar seu pedido, tente de novo!*");}
}
break;

case 'kwai': {
try {
if (!q) return await enviar("✨ *Anjo, mande o link do Kwai para eu baixar o vídeo!* 🌸");
const match = q.match(/https?:\/\/(k\.kwai\.com|v\.kwai\.com|www\.kwai\.com)\/\S+/);
if (!match) return await enviar("🥺 *Esse link parece não ser do Kwai, verifica de novo?*");
await enviar("☁️ *Buscando seu vídeo com carinho...*");
const url = match[0];
const api = `${laralotus}sys/down/kwai?apikey=${larakey}&url=${url}`;
const data = await fetchJson(api);
if (!data.resultado || !data.resultado.video_url) return await enviar("💔 *Não consegui baixar esse vídeo...*");
await lara.sendMessage(from, { video: { url: data.resultado.video_url }, caption: `✨ *Prontinho! Seu vídeo do Kwai chegou!* 💖`}, { quoted: m });
} catch (e) {
await enviar("💖 *Houve um erro, tente de novo em instantes!*");}}
break;

case 'pinterest': {
try {
if (!q) return await enviar(`✨ *Anjo, o que você quer que eu busque?*\n🌸 *Ex: ${prefix + command} gatinhos fofos*`);
await enviar("☁️ *Buscando imagens lindas para você...*");
const data = await fetchJson(`${laralotus}sys/infos/pinterest?apikey=${larakey}&nome=${q}`);
if (!data.resultado || data.resultado.length === 0) return await enviar("🥺 *Poxa, não achei nenhuma imagem sobre isso...*");
const randomIndex = Math.floor(Math.random() * data.resultado.length);
const img = data.resultado[randomIndex];
await lara.sendMessage(from, { image: { url: img.image }, caption: `✨ *Aqui está o que achei sobre: ${q}* 💖` }, { quoted: m });
} catch (error) {
await enviar("💖 *Houve um erro na busca, tente de novo!*");}}
break;

case 'tiktokvideo': case 'tiktokaudio': case 'tiktok': {
try {
const isAudio = command.includes('audio');
if (!q) return await enviar(`✨ *Anjo, mande o link do TikTok para eu baixar o ${isAudio ? "áudio" : "vídeo"}!* 🌸`);
const isTikTokUrl = /^https?:\/\/(?:www\.|m\.|vm\.|vt\.)?tiktok\.com\//.test(q);
if (!isTikTokUrl) return await enviar("🥺 *Esse link não parece ser do TikTok, verifica de novo?*");
await enviar(`☁️ *Buscando seu ${isAudio ? "áudio" : "vídeo"} com carinho...*`);
const tiktokUrl = `${laralotus}sys/down/tiktok?apikey=${larakey}&q=${q}`;
if (isAudio) {
await lara.sendMessage(from, { audio: { url: tiktokUrl }, mimetype: 'audio/mpeg' }, { quoted: m });
} else {
await lara.sendMessage(from, { video: { url: tiktokUrl }, mimetype: 'video/mp4', caption: '✨ *Prontinho! Aqui está seu vídeo!* 💖' }, { quoted: m });}
} catch (e) {
await enviar("💖 *Houve um erro ao processar o TikTok, tente de novo!*");}
}
break;

case 'instagram':
case 'instaaudio': {
try {
const isAudio = command.includes('audio') || /-a|--audio/.test(q);
if(!q) return await enviar(`✨ *Anjo, mande o link do Instagram para eu baixar o ${isAudio ? "áudio" : "vídeo"}!* 🌸`);
await enviar(`☁️ *Buscando sua mídia com todo carinho...*`);
const urlClean = q.replace(/-a|--audio|-v|--video/gi,'').trim();
const data = await fetchJson(`${laralotus}sys/down/instagram?apikey=${larakey}&url=${urlClean}`);
if(!data?.resultado?.length) return await enviar('🥺 *Poxa, não consegui encontrar nada nesse link...*');
for(const media of data.resultado){
const mediaUrl = media.url;
if(!mediaUrl) continue;
if(isAudio){
await lara.sendMessage(from,{
audio:{ url: mediaUrl },
mimetype:'audio/mpeg',
fileName:'insta.mp3'
},{ quoted: m });
}else{
await lara.sendMessage(from,{
video:{ url: mediaUrl },
mimetype:'video/mp4',
caption: '✨ *Prontinho! Aqui está seu vídeo!* 💖'
},{ quoted: m });}}
}catch(e){
await enviar("💖 *Houve um erro, tente de novo!*");}}
break;

 // pesquisa daqui pea baixar 

case 'receita': {
if (!q) return enviar(`🍳 Digite o nome da receita.\nEx: ${prefix}receita bolo de chocolate`);
await react("🍳");
try {
const { data } = await axios.get(
`${laralotus}sys/infos/receita?apikey=${larakey}&q=${encodeURIComponent(q)}`);
if (!data.status) {
return enviar("❌ Receita não encontrada.");}
const r = data.receita;
const ingredientes = Array.isArray(r.ingredientes)
? r.ingredientes.map(i => `• ${i}`).join('\n')
: 'Não informado';
const msg = `
╭━━━〔 🍳 RECEITA 〕━━━⬣

📛 *Nome:* ${r.nome || "Não informado"}
🌍 *Origem:* ${r.origem || "Não informado"}
🥘 *Categoria:* ${r.categoria || "Não informado"}

🧂 *Ingredientes*
${ingredientes}

📝 *Modo de preparo*
${(r.preparo || "Não informado").substring(0, 800)}...

📺 *Vídeo*
${r.video || "Não informado"}

╰━━━━━━━━━━━━━━━━⬣`;
await lara.sendMessage(from, {
image: { url: r.imagem },
caption: msg
}, { quoted: m });
} catch (e) {
enviar("❌ Erro ao buscar receita.");}}
break;

case 'futebol':
case 'jogo': {
try {
if (!q) return await enviar(`✨ *Anjo, me diga o nome do time!*\n🌸 *Ex: ${prefix + command} Flamengo*`);
await enviar("☁️ *Buscando os próximos jogos com carinho...*");
const data = await fetchJson(`${laralotus}sys/infos/jogo?apikey=${larakey}&time=${encodeURIComponent(q)}`);
if (!data.status || !data.result.length) return await enviar(`🥺 *Poxa, não achei nenhum jogo para o ${q}...*`);
let lista = '';
data.result.slice(0, 8).forEach((j, i) => {
lista += `\n${i + 1}️⃣ *${j.timeCasa}* 🆚 *${j.timeVisitante}*\n🏆 _${j.liga}_\n📅 _${j.data}_\n`;});
const msg = `🎀 *─── · ✨ · ───* 🎀\n` +
`⚽ *PRÓXIMOS JOGOS* ⚽\n\n` +
`🔎 *Busca:* ${data.time}\n` +
`${lista}\n` +
`✨ *─────────────* ✨\n\n` +
`🌸 _Espero que seu time vença!_ 💖`;
await lara.sendMessage(from, { text: msg }, { quoted: m });
} catch (e) {
await enviar("💖 *Houve um erro ao buscar os jogos, tente de novo!*");}
}
break;
 
case 'clima': {
try {
if (!q) return await enviar(`✨ *Anjo, me diga o nome da cidade!*\n🌸 *Ex: ${prefix + command} São Paulo*`);
const data = await fetchJson(`${laralotus}sys/infos/clima?apikey=${larakey}&cidade=${q}`);
if (!data.status) return await enviar("🥺 *Não consegui encontrar o clima dessa cidade, verifique o nome?*");
const local = data.localizacao;
const atual = data.clima.atual;
const diario = data.clima.diario;
const msg = `🎀 *─── · ✨ · ───* 🎀\n` +
`📍 *Cidade:* ${local.nome}\n` +
`🗺️ *Estado:* ${local.estado}\n` +
`🌡️ *Temperatura:* ${atual.temperatura}°C\n` +
`💧 *Umidade:* ${atual.umidade}%\n` +
`💨 *Vento:* ${atual.vento} km/h\n` +
`🌞 *Máxima:* ${diario.temp_max[0]}°C\n` +
`🌙 *Mínima:* ${diario.temp_min[0]}°C\n` +
`✨ *─────────────* ✨\n\n` +
`☁️ _Clima consultado com carinho!_ 💖`;
await lara.sendMessage(from, { text: msg }, { quoted: m });
} catch (e) {
await enviar("💖 *Houve um erro ao consultar o clima, tente de novo!*");}
}
break;

case "imagine": {
try {
if (!q) return enviar(`❌ *Use assim:*\n${prefix}imagine um gato astronauta`);

await react("🎨");
await enviar("🖌️ *Gerando imagem com IA...*");

const config = JSON.parse(fs.readFileSync("./lara/lara.json", "utf-8"));
const apiKey = config.openaiKey;
if (!apiKey) return enviar("❌ *Chave da OpenAI não configurada!*");

const response = await fetch("https://api.openai.com/v1/images/generations", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${apiKey}`
},
body: JSON.stringify({
prompt: q,
n: 1,
size: "512x512"
})
});

const data = await response.json();
if (!response.ok) throw new Error(data.error?.message);

const imageUrl = data.data[0].url;
await lara.sendMessage(from, { image: { url: imageUrl }, caption: `✨ *Sua imagem gerada para:*\n“${q}”` }, { quoted: m });
} catch (err) {
await enviar("❌ Erro ao gerar imagem. Tente outro prompt.");
}
break;
}

case "traduzir": {
try {
if (!q) return enviar(`❌ *Use assim:*\n${prefix}traduzir pt Olá, mundo!\n\nIdiomas: pt, en, es, fr, de, it, ja, ru, zh`);
const args = q.split(" ");
const lang = args[0];
const text = args.slice(1).join(" ");
if (!lang || !text) return enviar("❌ Informe o idioma e o texto.\nEx: `!traduzir en Olá`");

const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
const response = await fetch(url);
const data = await response.json();
const traduzido = data[0].map(item => item[0]).join("");
await enviar(`🌐 *Tradução (${lang}):*\n${traduzido}`);
} catch (err) {
await enviar("❌ Erro ao traduzir. Tente novamente.");
}
break;
}

case 'emojimix': 
try {
if (!q.includes("+")) return await enviar(`✨ *Anjo, misture dois emojis assim:* ${prefix + command} 😂+💀 🌸`);
let [emoji1, emoji2] = q.split("+").map(v => v.trim());
const urlApi = `${laralotus}sys/acoes/emojimix?apikey=${larakey}&emoji1=${emoji1}&emoji2=${emoji2}`;
await lara.sendMessage(from, { sticker: { url: urlApi } }, { quoted: m })
} catch (e) {
await enviar("💖 *Houve um erro ao misturar os emojis, tente outros!*")}
break;

case 'removerfundo': {
try {
const msg = quoted ? (quoted.message || quoted) : m.message;
const type = Object.keys(msg || {}).find(k => k.includes("ImageMessage") || k.includes("imageMessage"));

if (!type) return await enviar("📸 Envie ou marque uma imagem!");
await enviar("✨ Removendo fundo...");
const stream = await downloadContentFromMessage(msg[type], "image");
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);}
const input = "./base/temp_removebg.jpg";
const output = "./base/temp_removebg.webp";
fs.writeFileSync(input, buffer);
// 🔥 upload
const uploadedUrl = await upload(input);
// 🔥 API remove fundo
let urlApi = `${laralotus}sys/acoes/removebg?apikey=${larakey}&url=${encodeURIComponent(uploadedUrl)}`;
// 🔥 baixa resultado da API
const res = await fetch(urlApi);
const resultBuffer = await res.buffer();
// salva resultado
fs.writeFileSync("./result.png", resultBuffer);
// 🔥 converte pra figurinha
await execPromise(`ffmpeg -i ./result.png -vcodec libwebp -filter:v "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -lossless 1 -qscale 50 -preset default -loop 0 -an -vsync 0 ${output}`);
// envia figurinha
const buff = fs.readFileSync(output);
await lara.sendMessage(from, { sticker: buff }, { quoted: m });
// limpa
fs.unlinkSync(input);
fs.unlinkSync("./result.png");
fs.unlinkSync(output);
} catch (error) {
await enviar("❌ Erro ao processar imagem!");}}
break;

case "toimg": {
try {
const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
if (!quoted?.stickerMessage)
return enviar("❌ Responda uma figurinha!");
const stream = await downloadContentFromMessage(quoted.stickerMessage, "sticker");
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);
}
const input = `./tmp_${Date.now()}.webp`;
const output = `./tmp_${Date.now()}.jpg`;
fs.writeFileSync(input, buffer);
await execPromise(`ffmpeg -i ${input} ${output}`);
await lara.sendMessage(from, {
image: fs.readFileSync(output)
}, { quoted: m });
fs.unlinkSync(input);
fs.unlinkSync(output);
} catch (e) {
enviar(msgs.erro);
}
}
break;

case 'attp': case 'attp2': case 'attp3': 
case 'attp4': case 'attp5': case 'attp6': 
case 'attp7': case 'attp8': case 'attp9': 
case 'attp10':
{
try {
if (!q) return enviar(`❌ Exemplo: ${prefix + command} seu_texto_aqui`);
        
        // Verifica se a variável existe
if (!laralotus) {
return enviar("❌ Configuração da API não encontrada.");
}
        
const url = `${laralotus}sys/fun/attp/${command}?apikey=${larakey}&texto=${encodeURIComponent(q)}`;

        
        // Testa se a URL é válida antes de enviar
const testResponse = await fetch(url, { method: 'HEAD' });
if (!testResponse.ok) {
throw new Error(`API retornou status ${testResponse.status}`);
}
        
await lara.sendMessage(from, {
sticker: { url }
}, { quoted: m });
} catch (error) {
enviar("❌ Falha ao converter texto em figurinha. Verifique se a API está online.");
}
}
break;


case 'togif': {
const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  
if (!quoted?.stickerMessage) {
return enviar('❌ Responda uma figurinha animada!');
}


enviar('🔄 Convertendo figurinha em vídeo...');

try {
    // BAIXA O STICKER (MESMO MÉTODO DO SEU RENOMEAR)
const stream = await downloadContentFromMessage(quoted.stickerMessage, 'sticker');
let stickerBuffer = Buffer.from([]);
for await (const chunk of stream) {
stickerBuffer = Buffer.concat([stickerBuffer, chunk]);
}

    // USA A FUNÇÃO WebP_GIF QUE FUNCIONA (VIA EZGIF.COM)
const videoBuffer = await WebP_GIF(stickerBuffer);

if (!videoBuffer) {
return enviar("❌ Erro ao converter sticker.");
}

await lara.sendMessage(from, {
video: videoBuffer,
gifPlayback: true
}, { quoted: m });

} catch (error) {

enviar("❌ Erro ao converter: " + error.message);
}
}
break;

case 'ttt':
case 'jogodavelha': {
if (!isGroup) return enviar(msgs.soGrupo);
if (!menc_os2) return enviar("Marque alguém 🙄");

const result =
await tictactoe.invitePlayer(
from,
sender,
menc_os2
);

await lara.sendMessage(from, {
text: result.message,
mentions: result.mentions
});
}
break;


case 'forca': {
if (!isGroup) return enviar(msgs.soGrupo);

const result =
await hangman.start(
from,
sender
);

await lara.sendMessage(from, {
text: result.message.replace(
'{prefix}',
prefix
),
mentions: [
sender
]
});
}
break;


case 'adivinharnmr': {
if (!isGroup) return enviar(msgs.soGrupo);

const result =
await guessMyNumber.start(
from,
sender
);

await lara.sendMessage(from, {
text: result.message.replace(
'{prefix}',
prefix
),
mentions: [
sender
]
});
}
break;

// ========= COMANDOS DE USUÁRIO/STICKER ==========

case 's':
case 'sticker':
case 'f':
case 'figu': {
    // Verifica se é imagem ou vídeo (na mensagem ou marcada)
const isMedia = (m.message?.imageMessage || m.message?.videoMessage);
const isQuotedMedia = (quoted?.imageMessage || quoted?.videoMessage);

if (isMedia || isQuotedMedia) {
await react("⏳");
        
        // Determina qual mensagem contém a mídia
const messageToDownload = isMedia ? m.message : quoted;
const type = isMedia ? (m.message?.imageMessage ? 'image' : 'video') : (quoted?.imageMessage ? 'image' : 'video');

        // Se for vídeo, verifica a duração (limite de 10 segundos para figurinhas animadas)
if (type === 'video') {
const seconds = isMedia ? m.message.videoMessage.seconds : quoted.videoMessage.seconds;
if (seconds > 10) return enviar("❌ O vídeo deve ter no máximo 10 segundos!");
}

try {
            // Baixa a mídia
const stream = await downloadContentFromMessage(
messageToDownload[type + 'Message'],
type
);
            
let buffer = Buffer.from([]);
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);
}

            // Define nome do pacote e autor (pode ser personalizado)
const metadata = {
packname: q.split('/')[0] || "Lara-Bot",
author: q.split('/')[1] || "Oficial"
};

await sendMediaAsSticker(lara, from, buffer, m, metadata);
await react("✅");
} catch (err) {

await enviar("❌ Erro ao converter para figurinha.");
}
} else {
enviar(`Marque uma imagem ou vídeo, ou envie com a legenda: *${prefix}${command}*`);
}
}
break;


//== agora que ta nao funciona mais aque esta no bot na lotus 

case 'renomear':
case 'wm': {
await renomearSticker(lara, m, from, q);}
break;




/// logos
//1 - LOGOS TEXTO (Caminho: logostxt)
case 'fluffy': case 'lava': case 'cool': case 'comic': case 'fire': case 'water': case 'ice': case 'elegant': case 'gold': case 'fortune': case 'blue': case 'silver': case 'neon': case 'retro': case 'candy': case 'glossy': case 'graffiti': case 'steel': case 'glow': case 'matrix': case 'chrome': case 'magic': case 'space': case 'logo3d': case 'monster': {
try {
if (!q) return await enviar(`✨ *Anjo, me diga o nome para a logo!*\n🌸 *Ex: ${prefix + command} Lara*`);
await enviar("☁️ *Criando sua logo com carinho...*");
const logoUrl = `${laralotus}sys/logostxt?command=${command}&text=${encodeURIComponent(q)}&apikey=${larakey}`;
await lara.sendMessage(from, { image: { url: logoUrl }, caption: `✨ *Sua logo ${command} está pronta!* 💖` }, { quoted: m });
} catch (e) {
await enviar("💖 *Houve um erro, tente de novo!*");}
}
break;

//2 - LOGOS (Caminho: logos)
case 'galaxy-light': case 'galaxy': case 'glitch': case 'graffiti': case 'metallic': case 'glossy': case 'dragonfire': case 'goldpink': case 'pubgavatar': case 'ffavatar': case 'amongus': case 'comics': case 'cemiterio': case 'blood': case 'hallobat': case 'titanium': case 'eraser': case 'halloween': case 'snow': case 'america': case 'mascoteneon': case 'doubleexposure': case 'metal': case '3dcrack': case 'colorful': case 'multicolor': case 'graffitistyle': case 'frozen': case 'ligatures': case 'watercolor': case 'summerbeach': case 'cloudsky': case 'techstyle': case 'firework': case 'mascotemetal': {
try {
if (!q) return await enviar(`✨ *Anjo, me diga o que escrever!*\n🌸 *Ex: ${prefix + command} Lara*`);
await enviar("☁️ *Preparando sua logo, aguarde...*");
const logoUrl = `${laralotus}sys/logos/${command}?apikey=${larakey}&text=${encodeURIComponent(q)}`;
await lara.sendMessage(from, { image: { url: logoUrl }, caption: `✨ *Aqui está sua logo: ${command}* 💖` }, { quoted: m });
} catch (e) {
await enviar("💖 *Erro ao gerar essa logo, tente outra!*");}
}
break;

//3 - LOGOS 2 TEXTOS (Caminho: logos2txt)
case 'captain': case 'graffitiwall': case 'phlogo': case 'blackpink': case 'deadpool': case 'glitter': case 'vintage3d': {
try { 
if (!q.includes("/")) return await enviar(`✨ *Anjo, use a barra para separar!*\n🌸 *Ex: ${prefix + command} Lara/Bot*`);
const [t1, t2] = q.split("/").map(t => t.trim());
if (!t1 || !t2) return await enviar(`🥺 *Escreva os dois nomes separados por / para funcionar!*`);
await enviar("☁️ *Criando sua logo de dois textos...*");
const url = `${laralotus}sys/logos2txt/${command}?apikey=${larakey}&text=${t1}&text2=${t2}`;
await lara.sendMessage(from, { image: { url }, caption: `✨ *Sua logo especial ficou pronta!* 💖` }, { quoted: m });
} catch (e) {

await enviar("💖 *Houve um erro nos dois textos, tente de novo!*");}}
break;

case 'del':
await lara.sendMessage(from, { delete: m.message.extendedTextMessage.contextInfo.stanzaId, participant: menc_prt });
break

// === COMANDOS DE INFORMAÇÃO ==============
case "info":
case "comando": {
if (!q) {
        // Mostra a lista de comandos disponíveis
const listaComandos = Object.keys(comandosInfo).sort();
const linhas = [];
for (let i = 0; i < listaComandos.length; i += 3) {
const grupo = listaComandos.slice(i, i + 3);
linhas.push(`│ ${grupo.map(cmd => `${prefix}${cmd}`).join(" • ")}`);
}
        
const texto = `╭━〔 📖 SISTEMA DE INFO 〕━⬣
│
│ 🔍 Use: ${prefix}info [comando]
│
│ 📌 Exemplo:
│ ${prefix}info antilink
│
│ 📋 COMANDOS DISPONÍVEIS:
│
${linhas.join("\n")}
│
╰━━━━━━━━━━━━━━━━━━━━━⬣
💡 Digite ${prefix}info [comando] para ver detalhes`;
        
        await enviar(texto);
        break;
    }
    
const cmd = q.toLowerCase();
const info = comandosInfo[cmd];
if (!info) {
await enviar(`❌ Comando "${cmd}" não encontrado!\n\n📋 Use ${prefix}info para ver a lista de comandos disponíveis.`);
        break;
    }
    
    // Formata a mensagem no estilo da imagem
const textoInfo = `╭━〔 📌 INFORMAÇÕES: ${cmd} 〕━⬣
│
│ 📝 *Descrição:*
│ ${info.desc}
│
│ ⚙️ *Como usar:*
│ ${prefix}${info.uso}
│
│ 🎯 *Exemplo:*
│ ${prefix}${info.exemplo}
│
│ 🔧 *Detalhes:*
│ ${info.detalhes}
│
╰━━━━━━━━━━━━━━━━━━━━━⬣
💡 Use ${prefix}info para ver todos os comandos`;
    
    await react("📌");
    await enviar(textoInfo);
    break;
}

case "ping": {
try {
await react("⚡");
const start = Date.now();
await lara.sendPresenceUpdate("composing", from);
const end = Date.now();
const speed = ((end - start) / 1000).toFixed(3);
const uptime = process.uptime();
const tempo = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;
let grupos = 0;
try {
const allGroups = await lara.groupFetchAllParticipating();
grupos = Object.keys(allGroups).length;
} catch (e) {
grupos = 0;}
let status = "🔴 Lento";
if (speed < 1.5) status = "🟢 Excelente";
else if (speed < 3) status = "🟡 Estável";
const texto = `╭─〔 ✦ STATUS ✦ 〕
│ ⚙️ Velocidade: ${speed}s
│ 📊 Status: ${status}
│ 👥 Grupos: ${grupos}
│ ⏳ Uptime: ${tempo}
│
│ 👤 Dono: ${laradona}
│ 🤖 Bot: ${larabot}
╰───────────────`;
await enviar(texto);
} catch (err) {
await enviar("❌ Erro ao verificar status.")}}
break;

case "encurtar": 
try {
if (!q) return enviar(`❌ Use assim:\n\n${prefix}encurtar https://exemplo.com`);
if (!q.startsWith("http")) 
return enviar("❌ Envie um link válido (começando com http ou https)");
const res = await fetch(`https://tinyurl.com/api-create.php?url=${q}`);
const link = await res.text();
await enviar(`🔗 Link original:\n${q}\n\n✨ Link encurtado:\n${link}`);
} catch (err) {
await enviar("❌ Erro ao encurtar o link.")}
break;

case "eu": {
try {
await react("📄");
const numero = sender.split("@")[0];
const nome = pushName || "Sem nome";
const isAdm = isGroup ? isSoadm : false;
const isOwner = isDono ? "Sim" : "Não";
const hora = new Date().toLocaleString("pt-BR", {
timeZone: "America/Sao_Paulo"});
let nomeGrupo = "Privado";
if (isGroup) {
try {
const metadata = await lara.groupMetadata(from);
nomeGrupo = metadata.subject;
} catch {
nomeGrupo = "Erro ao pegar";}}
const texto = `╭─〔 👤 SUAS INFORMAÇÕES 〕
│ 🏷️ Nome: ${nome}
│ 📱 Número: ${numero}
│ 👑 Dono: ${isOwner}
│ 🛡️ Admin: ${isAdm ? "Sim" : "Não"}
│
│ 💬 Grupo: ${nomeGrupo}
│ 🕒 Hora: ${hora}
│
│ 🤖 Bot: ${larabot}
╰───────────────`;
await enviar(texto);
} catch (err) {
await enviar("❌ Erro ao pegar informações.")}}
break;

case "tabela":
case "letras":
case "simbolos": {
await react("🌀")
await lara.sendMessage(from, { text: tabela}, { quoted: m })}
break

case 'loli': {
try {
if (!q) { return await lara.sendMessage(from, {
text: '❌ Cadê o texto?'
}, { quoted: m })}
const lod = await fetchJson(
`https://nekobot.xyz/api/imagegen?type=kannagen&text=${encodeURIComponent(q)}`)
if (!lod?.message) {
return await lara.sendMessage(from, {
text: '⚠️ Não consegui gerar a imagem.'
}, { quoted: m })}
const tempInput = './temp_loli.png'
const tempOutput = './temp_loli.webp'
const img = await axios.get(lod.message, {
responseType: 'arraybuffer'})
await fs.promises.writeFile(tempInput, img.data)
await new Promise((resolve, reject) => {
exec(`ffmpeg -y -i ${tempInput} -vf "scale=512:512:force_original_aspect_ratio=decrease" -vcodec libwebp -preset default -loop 0 -an -vsync 0 ${tempOutput}`,
(err) => {
if (err) return reject(err)
resolve()})})
await lara.sendMessage(from, {
sticker: fs.readFileSync(tempOutput)
}, {
quoted: m})
if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput)
if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput)
} catch (err) {
await lara.sendMessage(from, {
text: '❌ Erro ao gerar a figurinha.'
}, {
quoted: m})}}
break

case 'metadinha': {
try {
const numb = Math.floor(Math.random() * 98) + 1
await lara.sendMessage(from, { sticker: { url: `https://cdn.jsdelivr.net/gh/lyna-url/Media/stick/meta/a${numb}.webp`}}, { quoted: m})
setTimeout(async () => {
try {
await lara.sendMessage(from, {sticker: {url: `https://cdn.jsdelivr.net/gh/lyna-url/Media/stick/meta/m${numb}.webp`}}, {quoted: m})} catch (err) {
await lara.sendMessage(from, {
text: '❌ Erro ao enviar a segunda figurinha.'}, {quoted: m})}
}, 2000)} catch (err) {
await lara.sendMessage(from, {text: '❌ Ocorreu um erro.'}, {quoted: m})}}
break

case "perfil":
case "myprofile": {
try {
if (!isGroup) return enviar(msgs.soGrupo);
let alvo = sender;
const mencionado = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
if (mencionado) alvo = mencionado;
const userData = db[from]?.[alvo] || { mensagens: 0, comandos: 0, figurinhas: 0 };      
let nomeAlvo = pushName;
if (alvo !== sender) {
try {
const metadata = await lara.groupMetadata(from);
const participante = metadata.participants.find(p => p.id === alvo);
nomeAlvo = participante?.pushName || "Alguém misterioso";
} catch {
nomeAlvo = "Alguém aí";
}
}      
const numero = alvo.split("@")[0];
const msgs = userData.mensagens || 0;
const cmds = userData.comandos || 0;
const figs = userData.figurinhas || 0;
        // Dados fictícios engraçados
const nivelPalhaco = Math.floor(Math.random() * 101);
const qi = Math.floor(Math.random() * 150) + 50;
const chanceRobo = Math.floor(Math.random() * 101);
const coracoesPartidos = Math.floor(Math.random() * 20);
const bebado = Math.floor(Math.random() * 101);     
const famas = [
"🕺 O dançarino do grupo", "🧠 O gênio incompreendido", "😴 O mestre da soneca",
"🍕 Viciado em pizza", "🐱 Amante de gatos", "🎮 Gamer profissional",
"🤣 O palhaço oficial", "💔 Sofredor de amores", "🔞 Posta coisas suspeitas",
"📚 Nunca leu um livro", "🚀 Vive no mundo da lua", "😂 O rei do zap"
];
const fama = famas[Math.floor(Math.random() * famas.length)];      
const frases = [
"Eu juro que não fui eu", "Tô offline, mas tô vendo tudo",
"Manda áudio que eu não leio", "Só uso esse grupo pra divulgar meu onlyfans",
"Se eu sumir é porque fui sequestrado por ET", "Minha mãe disse pra não falar com estranhos",
"Acorda, já é tarde!", "Vou ali e já volto (sumiu por 3 meses)"
];
const frase = frases[Math.floor(Math.random() * frases.length)];
        // 🔥 Tenta pegar a foto do perfil do alvo
let fotoPerfilBuffer;
let usarImagem = true;
try {
const fotoUrl = await lara.profilePictureUrl(alvo, "image");
            // Baixa a imagem da URL
const response = await fetch(fotoUrl);
if (response.ok) {
fotoPerfilBuffer = await response.buffer();
} else {
usarImagem = false;
}
} catch (err) {
usarImagem = false;
}
        // Texto da mensagem
const texto = `
╭━〔 🎭 PERFIL HUMORÍSTICO 〕━⬣
┃ 👤 *Nome:* ${nomeAlvo}
┃ 📞 *Número:* @${numero}
┃ ⭐ *Fama:* ${fama}
┃
┃ 📊 *Estatísticas reais:*
┃ 💬 Mensagens: ${msgs}
┃ ⚙️ Comandos: ${cmds}
┃ 🧩 Figurinhas: ${figs}
┃
┃ 🤪 *Estatísticas fictícias:*
┃ 🤡 Nível de palhaço: ${nivelPalhaco}%
┃ 🧠 QI estimado: ${qi}
┃ 🤖 Chance de ser robô: ${chanceRobo}%
┃ 💔 Corações partidos: ${coracoesPartidos}
┃ 🍺 Porcentagem de bêbado: ${bebado}%
┃
┃ 💬 *Frase do momento:* 
┃ “${frase}”
╰━━━━━━━━━━━━━━━━━⬣
        `;
        // Envia com a foto de perfil (se conseguiu)
if (usarImagem && fotoPerfilBuffer) {
await lara.sendMessage(from, {
image: fotoPerfilBuffer,
caption: texto,
mentions: [alvo]
}, { quoted: m });
} else {
            // Se não tem foto, envia só texto
await lara.sendMessage(from, {
text: texto,
mentions: [alvo]
}, { quoted: m });
}
await react("🎭");
} catch (error) {

await enviar("❌ Erro ao gerar o perfil engraçado. Tente novamente.");
}
break;
}

case "calcular":
case "calc": {
try { 
if (!q) { return enviar(`❌ Use assim:
${prefix}calc 2+2
${prefix}calc 10*5
${prefix}calc (5+3)*2`);
}
const conta = q.replace(/[^0-9+\-*/().]/g, "");
if (!conta) return enviar("❌ Conta inválida.");
let resultado;
try {
resultado = eval(conta);
} catch {
return enviar("❌ Erro ao calcular. Verifique a conta.")}
if (resultado === undefined) {
return enviar("❌ Não foi possível calcular.")}
const texto = `
╭─〔 🧮 CALCULADORA 〕
│ 📥 Conta: ${conta}
│ 📤 Resultado: ${resultado}
╰───────────────`;
await enviar(texto);
} catch (err) {
await enviar("❌ Erro ao processar cálculo.")}
}
break;

case "conselho": { // pronto nao mexer
try {
if (!conS?.conselhos?.length) { return enviar("❌ Nenhum conselho disponível.")}
const conselho = conS.conselhos[
Math.floor(Math.random() * conS.conselhos.length)];
await enviar(
`✨ *HORA DO CONSELHO* ✨
${conselho}
────────────────
💫 *Reflita e compartilhe este conselho!*
🎲 *Digite !conselho novamente para outro conselho*`);
} catch (e) {
await enviar("❌ Erro ao buscar conselho.")}
break;
}

case "conselhoamor": {
try {
const conselho = conS.conselhoamor[Math.floor(Math.random() * conS.conselhoamor.length)];
await enviar("💕 *CONSELHO DE AMOR* 💕\n\n" + conselho);
} catch (err) {
await enviar("❌ Erro ao buscar conselho de amor.")}
break;
}

case "conselhovida": {
try {
const conselho = conS.conselhovida[Math.floor(Math.random() * conS.conselhovida.length)];
await enviar("🌅 *CONSELHO DE VIDA* 🌅\n\n" + conselho);
} catch (err) {
await enviar("❌ Erro ao buscar conselho de vida.")}
break;
}

/*case "signo": {
try {
if (!q) return enviar(`❌ Use assim:
${prefix}signo dia/mês
Ex: ${prefix}signo 15/08
OU
${prefix}signo nome
Ex: ${prefix}signo leão`);
const signos = {
"áries": { nome: "♈ ÁRIES", data: "21/03 - 19/04", elemento: "Fogo", planeta: "Marte", cor: "Vermelho", pedra: "Diamante", amor: "Apaixonado e intenso", trabalho: "Líder nato" },
"touro": { nome: "♉ TOURO", data: "20/04 - 20/05", elemento: "Terra", planeta: "Vênus", cor: "Verde", pedra: "Esmeralda", amor: "Romântico e leal", trabalho: "Persistente e dedicado" },
"gêmeos": { nome: "♊ GÊMEOS", data: "21/05 - 20/06", elemento: "Ar", planeta: "Mercúrio", cor: "Amarelo", pedra: "Ágata", amor: "Comunicativo e divertido", trabalho: "Versátil e criativo" },
"câncer": { nome: "♋ CÂNCER", data: "21/06 - 22/07", elemento: "Água", planeta: "Lua", cor: "Branco", pedra: "Pérola", amor: "Cuidadoso e familiar", trabalho: "Empático e intuitivo" },
"leão": { nome: "♌ LEÃO", data: "23/07 - 22/08", elemento: "Fogo", planeta: "Sol", cor: "Dourado", pedra: "Rubi", amor: "Generoso e apaixonado", trabalho: "Confiante e ambicioso" },
"virgem": { nome: "♍ VIRGEM", data: "23/08 - 22/09", elemento: "Terra", planeta: "Mercúrio", cor: "Cinza", pedra: "Safira", amor: "Leal e dedicado", trabalho: "Organizado e perfeccionista" },
"libra": { nome: "♎ LIBRA", data: "23/09 - 22/10", elemento: "Ar", planeta: "Vênus", cor: "Rosa", pedra: "Opala", amor: "Romântico e justo", trabalho: "Diplomático e equilibrado" },
"escorpião": { nome: "♏ ESCORPIÃO", data: "23/10 - 21/11", elemento: "Água", planeta: "Plutão", cor: "Vermelho escuro", pedra: "Topázio", amor: "Intenso e misterioso", trabalho: "Determinado e estratégico" },
"sagitário": { nome: "♐ SAGITÁRIO", data: "22/11 - 21/12", elemento: "Fogo", planeta: "Júpiter", cor: "Roxo", pedra: "Turquesa", amor: "Aventureiro e livre", trabalho: "Otimista e inspirador" },
"capricórnio": { nome: "♑ CAPRICÓRNIO", data: "22/12 - 19/01", elemento: "Terra", planeta: "Saturno", cor: "Marrom", pedra: "Granada", amor: "Sério e comprometido", trabalho: "Ambicioso e responsável" },
"aquário": { nome: "♒ AQUÁRIO", data: "20/01 - 18/02", elemento: "Ar", planeta: "Urano", cor: "Azul", pedra: "Ametista", amor: "Original e independente", trabalho: "Inovador e humanitário" },
"peixes": { nome: "♓ PEIXES", data: "19/02 - 20/03", elemento: "Água", planeta: "Netuno", cor: "Lilás", pedra: "Água-marinha", amor: "Sonhador e romântico", trabalho: "Criativo e intuitivo" }
};

const mensagens = [
"✨ Hoje é um dia de boas energias!",
"🔮 Confie mais na sua intuição.",
"🌟 Uma oportunidade está chegando.",
"💫 Mantenha a calma, tudo vai dar certo.",
"❤️ O amor pode surpreender hoje.",
"🚀 Foque nos seus objetivos."
];

const personalidades = {
"áries": "Corajoso, impulsivo e cheio de energia!",
"touro": "Teimoso, mas leal e confiável!",
"gêmeos": "Versátil, comunicativo e curioso!",
"câncer": "Emocional, protetor e carinhoso!",
"leão": "Confiante, generoso e marcante!",
"virgem": "Perfeccionista, analítico e prático!",
"libra": "Justo, sociável e encantador!",
"escorpião": "Intenso, misterioso e forte!",
"sagitário": "Aventureiro, otimista e livre!",
"capricórnio": "Ambicioso, disciplinado e sério!",
"aquário": "Original, independente e inovador!",
"peixes": "Sonhador, empático e criativo!"
};

// detectar por data
function getSigno(dia, mes) {
if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return "áries";
if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return "touro";
if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return "gêmeos";
if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return "câncer";
if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return "leão";
if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return "virgem";
if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return "libra";
if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return "escorpião";
if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return "sagitário";
if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return "capricórnio";
if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return "aquário";
if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) return "peixes";
return null;
}

let signoKey = null;
let entrada = q.toLowerCase().trim();

// DATA
if (entrada.includes('/')) {
const [dia, mes] = entrada.split('/').map(Number);
if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
return enviar("❌ Data inválida!");
}
signoKey = getSigno(dia, mes);
if (!signoKey) return enviar("❌ Não consegui identificar!");
}

// NOME
else {
signoKey = Object.keys(signos).find(s => s === entrada || signos[s].nome.toLowerCase().includes(entrada));
if (!signoKey) {
return enviar("❌ Signo não encontrado!\n\nUse: áries, touro, gêmeos...");
}
}

const s = signos[signoKey];
const msgDia = mensagens[Math.floor(Math.random() * mensagens.length)];
const perso = personalidades[signoKey];

let resposta = `🔮 *${s.nome}* 🔮

📅 Período: ${s.data}
🌊 Elemento: ${s.elemento}
🪐 Planeta: ${s.planeta}
🎨 Cor: ${s.cor}
💎 Pedra: ${s.pedra}

❤️ Amor: ${s.amor}
💼 Trabalho: ${s.trabalho}

🧠 Personalidade: ${perso}
✨ Mensagem: ${msgDia}`;

await enviar(resposta);

} catch (e) {
enviar("❌ Erro ao buscar signo!");
}
break;
}*/

case 'signo': {
    try {
        if (!q || !q.trim()) {
            return enviar(`🔮 *Digite um signo!*

Exemplo:
${prefix}signo áries

♈ Áries
♉ Touro
♊ Gêmeos
♋ Câncer
♌ Leão
♍ Virgem
♎ Libra
♏ Escorpião
♐ Sagitário
♑ Capricórnio
♒ Aquário
♓ Peixes`);
        }

        const signo = q
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

        const url = `http://api.lotushops.com.br/api/outros/signo?signo=${encodeURIComponent(signo)}`;

        const res = await axios.get(url);
        const data = res.data;

        if (!data || data.status === false) {
            return enviar("❌ Não encontrei informações para esse signo.");
        }

        let texto;

        if (typeof data.data === "string") {
            texto = data.data;
        } else if (data.message) {
            texto = data.message;
        } else if (data.resultado) {
            texto = data.resultado;
        } else {
            texto = JSON.stringify(data, null, 2);
        }

        await enviar(
            `🔮 *HORÓSCOPO — ${q.trim().toUpperCase()}* 🔮\n\n${texto}`
        );

    } catch (e) {
        console.error("Erro no comando signo:", e);
        await enviar("❌ Erro ao consultar o signo.");
    }

    break;
}

// ======== COMANDOS DE BRINCADEIRAS =============
case "ship": {
if (!isGroup) return enviar(msgs.soGrupo);
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
if (!mentioned || mentioned.length < 2) {
return enviar(`❌ Marque 2 pessoas\nEx: ${prefix}ship @1 @2`);
}
const p1 = mentioned[0];
const p2 = mentioned[1];
const porcentagem = Math.floor(Math.random() * 101);
await lara.sendMessage(from, {
text: `💘 SHIP 💘
@${p1.split("@")[0]} ❤️ @${p2.split("@")[0]}
Compatibilidade: *${porcentagem}%* 😏`,
mentions: [p1, p2]
}, { quoted: m });
}
break;

case 'cantadas':
case 'cantada': {
    try {
        await react("😉");

        const cantadas = [
            "Se beleza fosse tempo, você seria uma eternidade. 😉",
            "Você não é Wi-Fi, mas senti uma conexão forte. 😏",
            "Se eu pudesse escolher um lugar agora, escolheria ao seu lado. 😊",
            "Você tem mapa? Porque me perdi no seu sorriso. 😄",
            "Acho que meu teclado quebrou... porque não consigo tirar você da minha cabeça. 😉"
        ];

        const cantada =
            cantadas[Math.floor(Math.random() * cantadas.length)];

        await enviar(`💘 *Cantada da Lara:*\n\n${cantada}`);

    } catch (error) {
        console.error("Erro no comando cantadas:", error);
        await enviar("❌ Ocorreu um erro ao gerar a cantada.");
    }
    break;
}

case "dado": {
const numero = Math.floor(Math.random() * 6) + 1;
await enviar(`🎲 Você tirou: *${numero}*`);
}
break;


case 'dogolpe': {
if (!isGroup)
return enviar("❌ Este comando só pode ser usado em grupos.");

if (!group.modobrincadeira)
return enviar(
`❌ Modo brincadeira está desativado!\n\n` +
`Use ${prefix}modobrincadeira para ativar.`
);

if (!menc_os2 || menc_jid2[1])
return enviar("❌ Marque apenas uma pessoa para usar o comando.");

const golpes = [
"𝐄𝐌 𝐑𝐎𝐁𝐀𝐑 𝐒𝐄𝐔 𝐒𝐎𝐑𝐑𝐈𝐒𝐎 😏",
"𝐄𝐌 𝐆𝐀𝐍𝐇𝐀𝐑 𝐒𝐄𝐔 𝐂𝐎𝐑𝐀ÇÃ𝐎 😂",
"𝐄𝐌 𝐓𝐄 𝐅𝐀𝐙𝐄𝐑 𝐃𝐀𝐑 𝐑𝐈𝐒𝐀𝐃𝐀 🤭",
"𝐄𝐌 𝐓𝐄 𝐃𝐄𝐈𝐗𝐀𝐑 𝐒𝐄𝐌 𝐑𝐄𝐀ÇÃ𝐎 😎"
];

const golpeEscolhido =
golpes[Math.floor(Math.random() * golpes.length)];

const numero = menc_os2.split("@")[0];

enviar(
`😏 @${numero} ${golpeEscolhido}`,
{
mentions: [menc_os2]
}
);

break;
}

case 'cassino':
case 'slot': {
if (!isGroup)
return reply(mess.onlyGroup());

await react("🎰");

const frutas = [
"🍓",
"🍒",
"🍎",
"🍉"
];

const slot1 = frutas[Math.floor(Math.random() * frutas.length)];
const slot2 = frutas[Math.floor(Math.random() * frutas.length)];
const slot3 = frutas[Math.floor(Math.random() * frutas.length)];

let resultado;

if (slot1 === slot2 && slot2 === slot3) {
resultado = `🎉 *JACKPOT!*

🎰 | ${slot1} | ${slot2} | ${slot3} |

🏆 *Você ganhou!*
✨ Três símbolos iguais!`;
} else if (
slot1 === slot2 ||
slot1 === slot3 ||
slot2 === slot3
) {
resultado = `🎰 *QUASE!*

🎰 | ${slot1} | ${slot2} | ${slot3} |

🍀 Você conseguiu uma combinação!
Tente novamente para conseguir três iguais.`;
} else {
resultado = `🎰 *CASSINO DO GRUPO*

🎰 | ${slot1} | ${slot2} | ${slot3} |

😅 Não foi dessa vez!
Boa sorte na próxima rodada.`;
}

return enviar(resultado);
}
break;
        
case "meme": {
const memes = [
"Quando o bot responde mais rápido que você 😂",
"Eu: vou dormir cedo\nTambém eu 3h da manhã 😭",
"Professor: é fácil\nA prova: 💀",
"Internet caiu = fim da vida 😔",
"Mensagem apagada = curiosidade ativada 👀"
];
const escolha = memes[Math.floor(Math.random() * memes.length)];
await enviar(`😂 *MEME DO DIA*\n\n${escolha}`);
}
break;

case "gay":
case "hetero":
case "rico":
case "pobre": {
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
const alvo = mentioned?.[0] || sender;
const porcentagem = Math.floor(Math.random() * 101);
await lara.sendMessage(from, {
text: `📊 Resultado:
@${alvo.split("@")[0]} é *${porcentagem}% ${command}* 😏`,
mentions: [alvo]
}, { quoted: m });
}
break;

case "ppt": {
if (!q) return enviar(`Use: ${prefix}ppt pedra/papel/tesoura`);
const opcoes = ["pedra", "papel", "tesoura"];
const bot = opcoes[Math.floor(Math.random() * opcoes.length)];
let resultado = "";
if (q === bot) resultado = "🤝 Empate!";
else if (
(q === "pedra" && bot === "tesoura") ||
(q === "papel" && bot === "pedra") ||
(q === "tesoura" && bot === "papel")
) resultado = "🎉 Você ganhou!";
else resultado = "💀 Você perdeu!";
await enviar(`🎮 *PEDRA PAPEL TESOURA*
Você: ${q}
Bot: ${bot}
${resultado}`);
}
break;

case "foto": {
const img = `https://picsum.photos/400/400?random=${Math.random()}`;
await lara.sendMessage(from, {
image: { url: img },
caption: "📸 Foto aleatória"
}, { quoted: m });
}
break;

case "pergunta": {
if (!q) return enviar("❌ Faça uma pergunta");
const respostas = [
"Sim 😎",
"Não 😔",
"Talvez 🤔",
"Com certeza 🔥",
"Nem ferrando 💀",
"Provavelmente sim 👀"
];
const resp = respostas[Math.floor(Math.random() * respostas.length)];
await enviar(`❓ Pergunta: ${q}\n\n🔮 Resposta: ${resp}`);
}
break;

case "tapa": {
if (!isGroup) return enviar(msgs.soGrupo);
try {
let alvo;
// pega metadata corretamente
const groupMetadata = await lara.groupMetadata(from);
// 👉 Se marcar alguém
if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
alvo = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
} else {
// 👉 participantes do grupo
const participantes = (groupMetadata?.participants || [])
.map(p => p.id)
.filter(id => id !== sender);
if (participantes.length === 0) {
return enviar("❌ Não achei ninguém pra levar tapa 😅");
}
alvo = participantes[Math.floor(Math.random() * participantes.length)];
}
const frases = [
`👋 @${sender.split("@")[0]} deu um tapa em @${alvo.split("@")[0]} 😳💥`,
`💥 TAPÃO! @${alvo.split("@")[0]} ficou até tonto 😵`,
`😂 @${sender.split("@")[0]} perdeu a paciência e BATEU em @${alvo.split("@")[0]}`,
`🔥 @${alvo.split("@")[0]} levou um tapa daqueles 😳`,
`🤣 Foi sem aviso! @${alvo.split("@")[0]} nem viu o tapa chegando 💥`
];
const resultado = frases[Math.floor(Math.random() * frases.length)];
await lara.sendMessage(from, {
image: { url: links?.tapa },
caption: resultado,
mentions: [sender, alvo]
}, { quoted: m });
} catch (err) {

enviar("❌ Erro no comando tapa");
}
break;
}

case 'beijo': {
if (!isGroup) return enviar(msgs.soGrupo);
try {
let alvo;
if (m.message?.extendedTextMessage?.contextInfo?.participant) {
alvo = m.message.extendedTextMessage.contextInfo.participant;
} else if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
alvo = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
} else {
return enviar(`❌ Marque alguém ou responda a mensagem\nEx: ${prefix}beijo @usuario`);
}
await lara.sendMessage(from, {
text: `💋 Preparando o beijo... 😏`,
mentions: [sender, alvo]
}, { quoted: m });
setTimeout(async () => {
const frases = [
`💖 @${sender.split("@")[0]} deu um beijo em @${alvo.split("@")[0]} 😘`,
`🔥 Beijo roubado! @${alvo.split("@")[0]} ficou sem reação 😳`,
`😂 @${alvo.split("@")[0]} até ficou vermelho 💌`,
`💋 Romance no ar! @${alvo.split("@")[0]} recebeu o beijo 😏`,
`😍 Beijo de novela! @${alvo.split("@")[0]} amou 💖`,
`🤣 Beijo surpresa! @${alvo.split("@")[0]} bugou 😳`
];
const resultado = frases[Math.floor(Math.random() * frases.length)];
await lara.sendMessage(from, {
image: { url: links.beijo },
caption: resultado,
mentions: [sender, alvo]
}, { quoted: m });
}, 3000);
} catch (err) {

enviar("❌ Erro ao executar comando");
}
break;
}

case "corno": {
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
const alvo = mentioned?.[0] || sender;
const porcentagem = Math.floor(Math.random() * 101);
const linkCorno = links.corno;
const frases = [
`🐂 @${alvo.split("@")[0]} é *${porcentagem}% corno* 🤣`,
`😂 Acabou de sair o teste... @${alvo.split("@")[0]} deu *${porcentagem}% de corno* 💔`,
`💔 Ihhh... @${alvo.split("@")[0]} tá com *${porcentagem}% de chifre* 😳`,
`🤣 Confirmado! @${alvo.split("@")[0]} atingiu *${porcentagem}% de corno* 🐂`,
`🔥 Teste revelado: @${alvo.split("@")[0]} tá com *${porcentagem}% de chifre* 😂`
];
const resultado = frases[Math.floor(Math.random() * frases.length)];
await lara.sendMessage(from, {
image: { url: links.corno },
caption: resultado,
mentions: [alvo]
}, { quoted: m });
break;
}

case "qi": {
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
const alvo = mentioned?.[0] || sender;
const qi = Math.floor(Math.random() * 200);
await lara.sendMessage(from, {
text: `🧠 QI de @${alvo.split("@")[0]}: *${qi}* 🤓`,
mentions: [alvo]
}, { quoted: m });
}
break;

case "top5": {
if (!isGroup) return enviar(msgs.soGrupo);
try {
const metadata = await lara.groupMetadata(from);
const membros = metadata.participants.map(p => p.id);

    // 🎯 embaralha e pega 5
const top = membros
.sort(() => 0.5 - Math.random())
.slice(0, 5);
const frases = [
"👑 O mais brabo do grupo",
"🔥 Tá dominando tudo",
"😎 Só vive no estilo",
"💥 Presença marcante",
"🚀 Esse aqui é diferenciado"
];
const emojis = ["🥇", "🥈", "🥉", "🏅", "🎖️"];
let texto = `🏆 *TOP 5 MAIS ZUEIROS DO GRUPO* 🏆\n\n`;
top.forEach((m, i) => {
texto += `${emojis[i]} @${m.split("@")[0]}\n${frases[i]}\n\n`;
});
await lara.sendMessage(from, {
text: texto.trim(),
mentions: top
}, { quoted: m });
} catch (err) {

enviar("❌ Erro ao gerar top 5");
}
break;
}

case "morte": {
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
const alvo = mentioned?.[0] || sender;
const mortes = [
"foi atropelado por um carro 🏎️💥",
"escorregou no banheiro 😭",
"foi abduzido por ET 👽",
"morreu de rir 😂💀",
"sumiu misteriosamente 🕵️‍♂️"
];
const morte = mortes[Math.floor(Math.random() * mortes.length)];
await lara.sendMessage(from, {
text: `💀 @${alvo.split("@")[0]} ${morte}`,
mentions: [alvo]
}, { quoted: m });
}
break;

case "gostoso": {
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
const alvo = mentioned?.[0] || sender;
const porcentagem = Math.floor(Math.random() * 101);
const linkGostoso = links.gostoso;
const frases = [
`😏 @${alvo.split("@")[0]} é *${porcentagem}% gostoso(a)* 😋`,
`🔥 Olha isso... @${alvo.split("@")[0]} tá com *${porcentagem}% de gostosura* 😳`,
`😍 Não tem jeito! @${alvo.split("@")[0]} bateu *${porcentagem}% de beleza* 💖`,
`🥵 Cuidado! @${alvo.split("@")[0]} tá com *${porcentagem}% de gostoso(a)* 😏`,
`💋 Resultado saiu! @${alvo.split("@")[0]} tem *${porcentagem}% de charme* 😎`
];
const resultado = frases[Math.floor(Math.random() * frases.length)];
await lara.sendMessage(from, {
image: { url: links.gostoso },
caption: resultado,
mentions: [alvo]
}, { quoted: m });
break;
}

case "gostosa": {
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
const alvo = mentioned?.[0] || sender;
const porcentagem = Math.floor(Math.random() * 101);
const linkGostosa = links.gostosa;
const frases = [
`😏 @${alvo.split("@")[0]} é *${porcentagem}% gostosa* 😋`,
`🔥 Eita... @${alvo.split("@")[0]} tá com *${porcentagem}% de gostosura* 😳`,
`😍 Perfeita demais! @${alvo.split("@")[0]} bateu *${porcentagem}% de beleza* 💖`,
`🥵 Cuidado hein! @${alvo.split("@")[0]} tá com *${porcentagem}% de gostosa* 😏`,
`💋 Resultado saiu! @${alvo.split("@")[0]} tem *${porcentagem}% de charme* 😎`
];
const resultado = frases[Math.floor(Math.random() * frases.length)];
  // 🔥 bônus se for muito alto
let extra = "";
if (porcentagem > 90) {
extra = "\n🔥 NÍVEL MÁXIMO DE GOSTOSURA!";
}
await lara.sendMessage(from, {
image: { url: links.gostosa },
caption: resultado + extra,
mentions: [alvo]
}, { quoted: m });
break;
}

case "rankgostoso": {
if (!isGroup) return enviar("❌ Só em grupo");
const metadata = await lara.groupMetadata(from);
const membros = metadata.participants.map(p => p.id);
  // Embaralha e pega 5
const escolhidos = membros
.sort(() => 0.5 - Math.random())
.slice(0, 5);
const frases = [
"🥵 Só os mais gostosos do grupo",
"🔥 Elite da beleza",
"😏 Quem pegava, pegava",
"💋 Só os perigosos",
"😍 Top 5 de parar o coração"
];
const titulo = frases[Math.floor(Math.random() * frases.length)];
const medalhas = ["🥇", "🥈", "🥉", "🏅", "🎖️"];
let texto = `🥵 *RANK GOSTOSO* 🥵\n_${titulo}_\n\n`;
escolhidos.forEach((u, i) => {
texto += `${medalhas[i]} @${u.split("@")[0]}\n`;
  });
await lara.sendMessage(from, {
image: { url: links.rankgostoso },
caption: texto,
mentions: escolhidos
}, { quoted: m });
}
break;

case "rankgostosa": {
if (!isGroup) return enviar("❌ Só em grupo");
const metadata = await lara.groupMetadata(from);
const membros = metadata.participants.map(p => p.id);
if (!membros || membros.length < 1) return enviar("❌ Erro ao pegar membros");
const escolhidas = membros
.filter(Boolean)
.sort(() => 0.5 - Math.random())
.slice(0, 5);
const frases = [
"💋 Só as mais gostosas do grupo",
"🔥 Elite feminina",
"😍 As mais perigosas",
"🥵 Só as que dominam tudo",
"💖 Top 5 de tirar o fôlego"
];
const titulo = frases[Math.floor(Math.random() * frases.length)];
const medalhas = ["🥇", "🥈", "🥉", "🏅", "🎖️"];
let texto = `💋 *RANK GOSTOSA* 💋\n_${titulo}_\n\n`;
escolhidas.forEach((u, i) => {
texto += `${medalhas[i]} @${u.split("@")[0]}\n`;
});
await lara.sendMessage(from, {
image: { url: links.rankgostosa },
caption: texto,
mentions: escolhidas
}, { quoted: m });
}
break;

case "casal": {
if (!isGroup) return enviar("❌ Só em grupo");
const metadata = await lara.groupMetadata(from);
const membros = metadata.participants.map(p => p.id);
if (!membros || membros.length < 2) return enviar("❌ Poucos membros no grupo");
  // embaralha e pega 2
const escolhidos = membros
.filter(Boolean)
.sort(() => 0.5 - Math.random())
.slice(0, 2);
const [p1, p2] = escolhidos;
const porcentagem = Math.floor(Math.random() * 101);
const frases = [
`💘 Casal do momento!`,
`😍 Olha esse casal 👀`,
`🔥 Já pode marcar o casamento`,
`💍 Ship aprovado`,
`😏 Climinha rolando`
];
const titulo = frases[Math.floor(Math.random() * frases.length)];
const texto = `${titulo}\n\n💖 @${p1.split("@")[0]} ❤️ @${p2.split("@")[0]}\n\n🔥 Compatibilidade: *${porcentagem}%*`;
await lara.sendMessage(from, {
image: { url: links.casal },
caption: texto,
mentions: [p1, p2]
}, { quoted: m });
}
break;

case "bebado": {
if (!isGroup) return enviar("❌ Só em grupo");
const metadata = await lara.groupMetadata(from);
const membros = metadata.participants.map(p => p.id);
  // escolhe aleatório
const alvo = membros[Math.floor(Math.random() * membros.length)];
const frases = [
`🍺 @${alvo.split("@")[0]} já tá vendo tudo em dobro 🤪`,
`🤣 @${alvo.split("@")[0]} bebeu até esquecer o próprio nome`,
`🥴 @${alvo.split("@")[0]} tá mais torto que poste velho`,
`🍻 @${alvo.split("@")[0]} virou dono do bar hoje`,
`😵 @${alvo.split("@")[0]} misturou tudo e agora tá doidão`,
`🤢 @${alvo.split("@")[0]} já tá abraçando o vaso`,
`😂 @${alvo.split("@")[0]} tá falando língua alienígena`
];
const texto = frases[Math.floor(Math.random() * frases.length)];
await lara.sendMessage(from, {
image: { url: links.bebado },
caption: texto,
mentions: [alvo]
}, { quoted: m });
}
break;

case "rankbebados": {
if (!isGroup) return enviar("❌ Só funciona em grupo");
const metadata = await lara.groupMetadata(from);
const membros = metadata.participants.map(p => p.id);
  // Embaralha e pega 5
const escolhidos = membros
.sort(() => 0.5 - Math.random())
.slice(0, 5);
const frases = [
"🍺 Os que não param nunca",
"🥴 Só vive torto",
"🍻 Bebeu, virou lenda",
"🤣 Já acorda bêbado",
"😵 Nem lembra de ontem"
];
const titulo = frases[Math.floor(Math.random() * frases.length)];
const medalhas = ["🥇", "🥈", "🥉", "🏅", "🎖️"];
let texto = `🍺 *RANK DOS BÊBADOS* 🍺\n_${titulo}_\n\n`;
escolhidos.forEach((u, i) => {
texto += `${medalhas[i]} @${u.split("@")[0]}\n`;
});
await lara.sendMessage(from, {
image: { url: links.rankbebado },
caption: texto,
mentions: escolhidos
}, { quoted: m });
}
break;

case "rankgay": {
if (!isGroup) return enviar("❌ Só funciona em grupo");
const metadata = await lara.groupMetadata(from);
const membros = metadata.participants.map(p => p.id);
  // Pega 5 aleatórios
const escolhidos = membros
.sort(() => 0.5 - Math.random())
.slice(0, 5);
const frases = [
"🌈 Só no estilo e na pose",
"😏 Esse aí não nega",
"💅 Ícone fashion do grupo",
"🔥 Charme que ninguém explica",
"😎 Brilha mais que LED",
"✨ Presença que chama atenção"
];
const titulo = frases[Math.floor(Math.random() * frases.length)];
const medalhas = ["🥇", "🥈", "🥉", "🏅", "🎖️"];
let texto = `🌈 *RANK DO ESTILO* 🌈\n_${titulo}_\n\n`;
escolhidos.forEach((u, i) => {
texto += `${medalhas[i]} @${u.split("@")[0]}\n`;
});
await lara.sendMessage(from, {
image: { url: links.rankgay },
caption: texto,
mentions: escolhidos
}, { quoted: m });
}
break;

case "rankfeio": {
if (!isGroup) return enviar("❌ Só funciona em grupo");
const metadata = await lara.groupMetadata(from);
const membros = metadata.participants.map(p => p.id);
  // Pega 5 aleatórios
const escolhidos = membros
.sort(() => 0.5 - Math.random())
.slice(0, 5);
const frases = [
"😨 Assustou até o espelho",
"🤣 Feiúra nível hard",
"💀 Nem filtro resolve",
"😵 Beleza passou longe",
"😂 Quando nasceu apagaram a luz",
"👀 Deus tava distraído nesse dia"
];
const titulo = frases[Math.floor(Math.random() * frases.length)];
const medalhas = ["🥇", "🥈", "🥉", "🏅", "🎖️"];
let texto = `🤡 *RANK DOS FEIOS* 🤡\n_${titulo}_\n\n`;
escolhidos.forEach((u, i) => {
texto += `${medalhas[i]} @${u.split("@")[0]}\n`;
});

await lara.sendMessage(from, {
image: { url: links.rankfeio },
caption: texto,
mentions: escolhidos
}, { quoted: m });
}
break;

case "sender": {
enviar(sender);
}
break;

case "ranktoxicos": {
if (!isGroup) return enviar(msgs.soGrupo);
  // pega participantes do grupo
const groupMetadata = await lara.groupMetadata(from);
const participantes = groupMetadata.participants
.map(p => p.id)
.filter(id => id !== sender);
if (participantes.length < 5) {
return enviar("❌ Precisa de pelo menos 5 pessoas no grupo 😅");
}
  // embaralha e pega 5 aleatórios
const selecionados = participantes
.sort(() => Math.random() - 0.5)
.slice(0, 5);
  // 🔥 frases engraçadas
const frases = [
"💀 nível de toxidade: perigoso",
"🔥 discute até com o vento",
"😂 briga por qualquer emoji",
"⚠️ energia 100% caos no grupo",
"👀 sempre começa a treta e some"
];
  // monta mensagem
let msg = "💀 RANK DOS TÓXICOS 💀\n\n";
selecionados.forEach((user, i) => {
const frase = frases[Math.floor(Math.random() * frases.length)];
msg += `🏅 ${i + 1}. @${user.split("@")[0]}\n👉 ${frase}\n\n`;
});
await lara.sendMessage(from, {
image: { url: links.ranktoxico },
caption: msg,
mentions: selecionados
}, { quoted: m });
break;
}

case "rankcasais": {
if (!isGroup) return enviar(msgs.soGrupo);
const groupMetadata = await lara.groupMetadata(from);
const participantes = groupMetadata.participants
.map(p => p.id)
.filter(id => id !== sender);
if (participantes.length < 6) {
return enviar("❌ Precisa de pelo menos 6 pessoas no grupo 😅");
}
  // embaralha lista
const embaralhados = participantes.sort(() => Math.random() - 0.5);
const casais = [];
const usados = new Set();
  // cria pares aleatórios
for (let i = 0; i < embaralhados.length; i++) {
const p1 = embaralhados[i];
if (usados.has(p1)) continue;
const p2 = embaralhados.find(p => p !== p1 && !usados.has(p));
if (!p2) break;
usados.add(p1);
usados.add(p2);
casais.push([p1, p2]);
}
const frases = [
"💍 casal perfeito do grupo",
"❤️ química inexplicável",
"🔥 combinam mais que Wi-Fi e senha",
"😂 namoro oficial do bot",
"💘 destino do algoritmo"
];
let msg = "💍 RANK DE CASAIS ALEATÓRIOS 💍\n\n";
casais.slice(0, 5).forEach((c, i) => {
const frase = frases[Math.floor(Math.random() * frases.length)];
msg += `💞 ${i + 1}. @${c[0].split("@")[0]} + @${c[1].split("@")[0]}\n👉 ${frase}\n\n`;
});
const mentions = casais.slice(0, 5).flat();
await lara.sendMessage(from, {
image: { url: "https://tinyurl.com/2xsfcyvs" },
caption: msg,
mentions
}, { quoted: m });
break;
}

case "rankfantasma": {
if (!isGroup) return enviar(msgs.soGrupo);
const groupMetadata = await lara.groupMetadata(from);
const participantes = groupMetadata.participants
.map(p => p.id)
.filter(id => id !== sender);
if (participantes.length < 5) {
return enviar("❌ Precisa de pelo menos 5 pessoas no grupo 😅");
}
  // embaralha e pega 5 aleatórios
const selecionados = participantes
.sort(() => Math.random() - 0.5)
.slice(0, 5);
const frases = [
"👻 vive online mas nunca responde",
"💤 desaparece mais rápido que Wi-Fi ruim",
"📵 sumiu e esqueceu o grupo",
"🕵️ fantasma oficial do chat",
"🚶 entrou no grupo e nunca mais falou",
"😂 aparece só quando convém",
"💀 nível sumiço profissional"
];
let msg = "👻 RANK DOS FANTASMAS 👻\n\n";
selecionados.forEach((user, i) => {
const frase = frases[Math.floor(Math.random() * frases.length)];
msg += `👻 ${i + 1}. @${user.split("@")[0]}\n👉 ${frase}\n\n`;
});
const mentions = selecionados;
await lara.sendMessage(from, {
image: { url: links.rankfantasma },
caption: msg,
mentions
}, { quoted: m });
break;
}

case "separar": {
if (!isGroup) return enviar(msgs.soGrupo);
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
if (!mentioned || mentioned.length < 2) {
return enviar(`❌ Marque 2 pessoas\nEx: ${prefix}separar @1 @2`);
}
const p1 = mentioned[0];
const p2 = mentioned[1];
const motivos = [
"💔 o amor acabou por causa de ciúmes de figurinha",
"😢 terminaram por briga de emoji",
"💀 descobriram que eram primos distantes",
"📱 um deles visualizou e não respondeu",
"🔥 desentendimento por causa do admin do grupo",
"😂 o relacionamento não aguentou o grupo"
];
const motivo = motivos[Math.floor(Math.random() * motivos.length)];
const msg = `💔 TERMINO OFICIAL 💔
@${p1.split("@")[0]} e @${p2.split("@")[0]} acabaram o relacionamento...
${motivo}`;
await lara.sendMessage(from, {
text: msg,
mentions: [p1, p2]
}, { quoted: m });
break;
}

case 'vab':
try {
if (!isGroup) return enviar(msgs.soGrupo);
const { nsfw, questions } = vabJson[Math.floor(Math.random() * vabJson.length)];
const { pergunta1, pergunta2 } = questions[Math.floor(Math.random() * questions.length)];
await lara.sendMessage(from, { poll: { name: 'Você prefere...', values: [pergunta1, pergunta2], selectableCount: 1 }, messageContextInfo: { messageSecret: Math.random() } }, { quoted: m, from, options: { userJid: lara?.user?.id } });
} catch (e) {
console.error(e);
await reply("❌ Ocorreu um erro interno. Tente novamente em alguns minutos.");
}
break;

case 'eununca': {
if (!isGroup) return enviar(msgs.soGrupo);
try {
await enviar(`🤔 Pensando na pergunta...`);
const perguntas = [
"Eu nunca dormi no meio de uma aula 😴",
"Eu nunca menti pra sair de um compromisso 😅",
"Eu nunca fingi entender algo que não entendi 🤔",
"Eu nunca mandei mensagem e me arrependi 😬",
"Eu nunca comi algo que caiu no chão 🤢",
"Eu nunca me apaixonei por quem nem me conhece 💔",
"Eu nunca passei vergonha em público 😂",
"Eu nunca stalkeei ex 🕵️",
"Eu nunca inventei desculpa pra não sair 🛋️",
"Eu nunca disse que tava ocupado só pra dormir 😴",
"Eu nunca fui pego mentindo 🤥",
"Eu nunca deixei o celular cair na cara 😵",
"Eu nunca dancei sozinho 💃",
"Eu nunca falei mal de alguém e ouviram 😨",
"Eu nunca senti ciúmes sem motivo 😒",
"Eu nunca prometi e não cumpri 😬",
"Eu nunca fiquei viajando nos pensamentos 😶",
"Eu nunca comi escondido 🍫",
"Eu nunca ri em momento errado 😂",
"Eu nunca salvei contato com nome fake 😏",
"Eu nunca mandei áudio chorando 😭",
"Eu nunca fiquei com alguém do grupo 😳",
"Eu nunca fiquei com mais de uma pessoa no dia 😏",
"Eu nunca mandei mensagem bêbado 🍺",
"Eu nunca fui corno 🐂",
"Eu nunca traí alguém 💔",
"Eu nunca fui traído 😢",
"Eu nunca mandei nude 😳",
"Eu nunca recebi nude 👀",
"Eu nunca me arrependi de um beijo 😬",
"Eu nunca voltei com ex 😅",
"Eu nunca fiquei por carência 😶",
"Eu nunca fiquei com alguém mais velho 😏",
"Eu nunca fiquei com alguém mais novo 😳",
"Eu nunca fiz ciúmes de propósito 😈",
"Eu nunca me humilhei por alguém 😔",
"Eu nunca fui bloqueado 🚫",
"Eu nunca bloqueei alguém do nada 🤣",
"Eu nunca dormi em call 📞",
"Eu nunca chorei por amor 😭",
"Eu nunca tive crush secreto 😶",
"Eu nunca falei te amo sem amar 😬",
"Eu nunca ignorei alguém que gosto 😒",
"Eu nunca usei filtro demais 🤳",
"Eu nunca menti idade 🎂",
"Eu nunca iludi alguém 😈",
"Eu nunca mandei indireta 🗣️",
"Eu nunca me fiz de difícil 😏",
"Eu nunca mandei mensagem pra pessoa errada 😬",
"Eu nunca fiz drama por atenção 🎭",
"Eu nunca tive mais de um contatinho 😏",
"Eu nunca fiquei com alguém escondido 🤫",
"Eu nunca me arrependi na hora 😳",
"Eu nunca respondi story ignorando chat 😅"
];
const pergunta = perguntas[Math.floor(Math.random() * perguntas.length)];
    // Envia reação
await lara.sendMessage(from, { react: { text: "🤔", key: m.key } });
    // Envia enquete
await lara.sendMessage(from, {
poll: {
name: `🤭 EU NUNCA...\n\n${pergunta}`,
values: ["Eu nunca 😇", "Eu já 😏"],
selectableCount: 1
}
}, { quoted: m });
} catch (error) {

await lara.sendMessage(from, {
text: "❌ Erro ao enviar enquete"
}, { quoted: m });
}
break;
}

case "caraoucoroa": {
const moeda = Math.random() < 0.5 ? "CARA 🪙" : "COROA 🪙";
await enviar(`🎲 *JOGANDO A MOEDA...*\n\nResultado: *${moeda}*`);
  break;
}

case "roletarussa": {
const morto = Math.floor(Math.random() * 6) === 0; // 1/6 chance
if (morto) {
await lara.sendMessage(from, {
text: `🔫 *CLIQUE!* 💀\n\n@${sender.split("@")[0]} perdeu na roleta russa... 😵`,
mentions: [sender]
}, { quoted: m });
} else {
await enviar(`🔫 *Click vazio* 🍀\nVocê sobreviveu... dessa vez.`);
}
break;
}

case "vdd":
case "verdade": {
const perguntas = [
"Já mandou mensagem errada para o crush?",
"Já fingiu estar ocupado só para não sair de casa?",
"Já comeu algo do lixo?",
"Já traiu alguém?",
"Já mentiu na sua altura?"
];
const p = perguntas[Math.floor(Math.random() * perguntas.length)];
await enviar(`🤔 *VERDADE*\n\n${p}\n\nResponda com honestidade! 😇`);
 break;
}

case "desafio": {
const desafios = [
"Mande o áudio mais vergonhoso que tiver",
"Fale 3 coisas que você odeia em alguém do grupo",
"Poste uma foto sua de 5 anos atrás",
"Mande um emoji e deixem adivinhar o que significa",
"Ligue para o último contato do seu telefone e diga 'eu te amo'"
];
const d = desafios[Math.floor(Math.random() * desafios.length)];
await enviar(`🔥 *DESAFIO*\n\n${d}\n\nTopa? 👀`);
break;
}

case "namoro": {
if (!isGroup) return enviar(msgs.soGrupo);
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
if (!mentioned || mentioned.length < 2) {
return enviar(`❌ Marque 2 pessoas\nEx: ${prefix}namoro @1 @2`);
}
const [p1, p2] = mentioned;
const chance = Math.floor(Math.random() * 101);
const mensagens = [
"💞 Perfeitos um para o outro!", "💔 Melhor só amizade...", 
"😍 Já pode marcar o casamento!", "🤡 Iam brigar todo dia"
];
const msg = mensagens[Math.floor(Math.random() * mensagens.length)];
await lara.sendMessage(from, {
text: `💘 *TESTE DE NAMORO* 💘\n\n@${p1.split("@")[0]} + @${p2.split("@")[0]}\n🎯 Compatibilidade: *${chance}%*\n${msg}`,
mentions: [p1, p2]
}, { quoted: m });
break;
}

case "boladecristal":
case "oraculo": {
if (!q) return enviar(`❌ Faça uma pergunta\nEx: ${prefix}boladecristal Vou passar na prova?`);
const respostas = [
"🔮 Com certeza sim.", "🔮 Melhor não contar com isso.", "🔮 Talvez... o futuro é incerto.",
"🔮 Sim, mas vai exigir esforço.", "🔮 Não agora, mais tarde.", "🔮 Nem pense nisso."
];
const resposta = respostas[Math.floor(Math.random() * respostas.length)];
await enviar(`🔮 *BOLA DE CRISTAL* 🔮\n\n❓ *Pergunta:* ${q}\n✨ *Resposta:* ${resposta}`);
break;
}

case "podio": {
if (!isGroup) return enviar(msgs.soGrupo);
const metadata = await lara.groupMetadata(from);
const membros = metadata.participants.map(p => p.id);
const selecionados = membros.sort(() => 0.5 - Math.random()).slice(0, 3);
const motivos = [
"🔥 É o cara do caos no grupo",
"😂 Só manda figurinha bizarra",
"💀 Vive offline mas tá sempre vendo",
"😏 O(a) querido(a) do admin",
"🤣 Responde com áudio de 5 minutos"
];
let texto = "🏆 *PÓDIO DO GRUPO* 🏆\n\n";
const medalhas = ["🥇", "🥈", "🥉"];
selecionados.forEach((user, i) => {
const motivo = motivos[Math.floor(Math.random() * motivos.length)];
texto += `${medalhas[i]} @${user.split("@")[0]}\n   ${motivo}\n\n`;
});
await lara.sendMessage(from, { text: texto, mentions: selecionados }, { quoted: m });
break;
}

case "casamentoforçado": {
if (!isGroup) return enviar(msgs.soGrupo);
const metadata = await lara.groupMetadata(from);
let membros = metadata.participants.map(p => p.id);
if (membros.length < 2) return enviar("❌ Grupo muito pequeno");
membros = membros.sort(() => 0.5 - Math.random());
const [pessoa1, pessoa2] = membros.slice(0, 2);
const frases = [
"💍 Agora são oficialmente casados(as)! Parabéns! 🎉",
"😈 O amor é lindo... ou não. Divórcio só daqui 90 dias.",
"🤣 Que Deus tenha misericórdia desse casal",
"💒 Já podem escolher os padrinhos do grupo"
];
const frase = frases[Math.floor(Math.random() * frases.length)];
await lara.sendMessage(from, {
text: `💒 *CASAMENTO FORÇADO* 💒\n\n@${pessoa1.split("@")[0]} 💍 @${pessoa2.split("@")[0]}\n\n${frase}`,
mentions: [pessoa1, pessoa2]
}, { quoted: m });
break;
}

case "treta": {
if (!isGroup) return enviar(msgs.soGrupo);
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
if (!mentioned || mentioned.length < 2) {
return enviar(`🤬 Marque 2 pessoas para brigar\nEx: ${prefix}treta @1 @2`);
}
const [p1, p2] = mentioned;
const motivos = [
"por causa da última figurinha do grupinho",
"quem manda mais no grupo",
"disputa por quem é mais zoeiro",
"ciúmes de reply no WhatsApp",
"um chamou o outro de mentiroso"
];
const motivo = motivos[Math.floor(Math.random() * motivos.length)];
const resultado = Math.random() > 0.5 ? `🎉 @${p1.split("@")[0]} ganhou a treta!` : `🎉 @${p2.split("@")[0]} ganhou a treta!`;
await lara.sendMessage(from, {
text: `🤬 *TRETA NO GRUPO* 🤬\n\n@${p1.split("@")[0]} x @${p2.split("@")[0]}\nMotivo: ${motivo}\n\n${resultado}`,
mentions: [p1, p2]
}, { quoted: m });
break;
}

case "mimimi": {
if (!isGroup) return enviar(msgs.soGrupo);
const metadata = await lara.groupMetadata(from);
const membros = metadata.participants.map(p => p.id);
const campeao = membros[Math.floor(Math.random() * membros.length)];
const porcentagem = Math.floor(Math.random() * 101);
await lara.sendMessage(from, {
text: `😫 *RANK MIMIMI* 😫\n\n@${campeao.split("@")[0]} é *${porcentagem}% mimimi* 🤣\nSó reclama da vida!`,
mentions: [campeao]
}, { quoted: m });
break;
}

case "fofoca": {
if (!isGroup) return enviar(msgs.soGrupo);
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
const alvo = mentioned?.[0] || sender;
const fofocas = [
`👀 falaram que @${alvo.split("@")[0]} tem um grupo secreto sem os admins`,
`😱 ouvi dizer que @${alvo.split("@")[0]} tá apaixonado(a) por alguém do zap`,
`🤫 descobriram que @${alvo.split("@")[0]} assiste vídeo de react até 3h da manhã`,
`💅 contaram que @${alvo.split("@")[0]} só usa figurinha de gatinho`,
`🔥 a fofoca é que @${alvo.split("@")[0]} respondeu "kkk" e não achou graça`
];
const fofoca = fofocas[Math.floor(Math.random() * fofocas.length)];
await lara.sendMessage(from, { text: fofoca, mentions: [alvo] }, { quoted: m });
break;
}

case "cobrar": {
if (!isGroup) return enviar(msgs.soGrupo);
const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
if (!mentioned || mentioned.length < 1) {
return enviar(`💰 Marque quem você quer cobrar\nEx: ${prefix}cobrar @user`);
}
const devedor = mentioned[0];
const motivo = ["um pastel", "uma coca", "um abraço", "um zap às 3h", "um like nas fotos"];
const valor = Math.floor(Math.random() * 50) + 1;
await lara.sendMessage(from, {
text: `💰 *COBRANÇA OFICIAL* 💰\n\n@${devedor.split("@")[0]} deve *${valor} reais* por ${motivo[Math.floor(Math.random() * motivo.length)]}!\nPague ou será banido(a) do grupo (brincadeira, mas paga aí) 😂`,
mentions: [devedor]
}, { quoted: m });
break;
}

default:
if (!isCmd) {
if (budy2.includes("prefix")) {
if (m.key.fromMe) return;
await enviar(`👻 𝐌𝐄𝐔 𝐏𝐑𝐄𝐅𝐈𝐗𝐎: ${prefix}`);
}

// ========== mesagem de eror =============
} else {
const frases = ["Ops, não entendi esse comando. Tenta de outra forma 😅", "Esse comando é novidade pra mim... Tenta ver se escreveu certo? 🤔",
"Comando desconhecido por aqui. Quer ver a lista de comandos disponíveis?"];

const indiceAleatorio = Math.floor(Math.random() * frases.length);
await enviar(frases[indiceAleatorio]);
}
break;
}

}