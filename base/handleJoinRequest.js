
function getMention(jid) {
    if (!jid) return "";
    return `@${jid.split("@")[0]}`;
}

/**
 * Manipula eventos relacionados às solicitações de entrada em grupos.
 *
 * @param {import("@whiskeysockets/baileys").WASocket} sock
 * @param {object} msg / info
 * @param {object} dataGp - configurações
 * @returns {Promise<void>}
 */
async function handleJoinRequest(sock, msg, dataGp) {
    try {
        const stubType = msg?.messageStubType;
        const params = msg?.messageStubParameters || [];
        const groupId = normalizeJid(msg?.key?.remoteJid);

        if (!groupId) return;
        
        switch (stubType) {
        
            /**
             * stubType: 172
             * Indica uma solicitação de entrada em um grupo.
             * O evento é gerado quando um usuário solicita permissão para participar,
             * ou quando ela é rejeitada/revogada.
             */
            case 172: {
                const participant = normalizeJid(params[0]);
                const action = params[1];
                const author = normalizeJid(msg?.key?.participant);

                if (!participant) return;
                
                /* Solicitação foi criada... */
                if (action === "created") {
                    await sock.sendMessage(
                        groupId,
                        {
                            text: `🕵‍♀️🤖 *NOVA SOLICITAÇÃO:*\n\nO(a) ${getMention(participant)} acabou de solicitar entrada no grupo.`,
                            mentions: [participant]
                        }
                    );

                    console.log(
                        `[JOIN REQUEST] 🕐 Solicitação criada: ${participant}`
                    );

                    return;
                }
                
                /* Solicitação rejeitada. */
                if (action === "rejected") {
                    const mentions = [participant];
                    if (author) mentions.push(author);

                    await sock.sendMessage(
                        groupId,
                        {
                            text: `🕵‍♀️❌️ *SOLICITAÇÃO REJEITADA:*\n\nO(a) ${getMention(participant)} teve a solicitação para ingressar no grupo rejeitada por ${author ? getMention(author) : "um adm"}.`,
                            mentions
                        }
                    );

                    console.log(
                        `[JOIN REQUEST] ❌ ${participant} teve a entrada no grupo rejeitada por ${author || "N/A"}`
                    );

                    return;
                }
                
                /* Solicitação revogada. */
                if (action === "revoked") {
                    await sock.sendMessage(
                        groupId,
                        {
                            text: `🕵‍♀️↩️ *SOLICITAÇÃO REVOGADA:*\n\nA solicitação de ${getMention(participant)} foi revogada.`,
                            mentions: [participant]
                        }
                    );

                    console.log(
                        `[JOIN REQUEST] ↩️ A solicitação de ${participant} foi revogada.`
                    );

                    return;
                }

                break;
            }
        }
    } catch (error) {
        console.error(
            "[JOIN REQUEST] Erro:",
            error
        );
    }
}

export default handleJoinRequest;

export {
    handleJoinRequest
};
