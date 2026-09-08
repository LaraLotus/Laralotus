// --- CONFIGURAÇÃO ---
export const CONFIG = {
    TIMEOUT_RESPONSE: 60, // 60 segundos para cada resposta
    CHECK_INTERVAL: 5000, // Checagem de inatividade a cada 5 segundos
    NUMBER_RANGE: { min: 5, max: 50 }, // Intervalo de números: 5 a 50
    RANDOM_ADD_MIN: 1, // Mínimo para o número aleatório (multiplicado por 2)
    RANDOM_ADD_MAX: 14 // Máximo para o número aleatório (multiplicado por 2)
};

// --- HELPER: Extrair nome de usuário ---
export const getUserName = (userId) => {
    if (!userId || typeof userId !== 'string') {
        return 'unknown';
    }
    const parts = userId.split('@');
    const name = parts[0]?.trim() || 'unknown';
    return name;
};

// --- HELPER: Renderizar estado do jogo ---
export const renderGame = (gameData, playerName) => {
    const progress = gameData.progresso;
    const steps = [
        `🧙🏽‍♂️ *Passo Nº1:* Pense em um número aleatório entre ${CONFIG.NUMBER_RANGE.min} e ${CONFIG.NUMBER_RANGE.max}.`,
        `🧙🏽‍♂️ *Passo Nº2:* Multiplique esse número por 2.`,
        `🧙🏽‍♂️ *Passo Nº3:* Agora adicione +${gameData.randomNumber} a este resultado.`,
        `🧙🏽‍♂️ *Passo Nº4:* Feito isso, divida o resultado por 2.`,
        `🧙🏽‍♂️ *Passo Nº5:* Agora subtraia este resultado pelo primeiro número que você pensou.`
    ];

    let currentStep;
    let message;

    if (progress < 4) {
        currentStep = steps[progress];
        message = `*🤖 Adivinhar Número:*\n*—*\n• Jogador(a): @${getUserName(playerName)}\n*—*\n${currentStep}\n*—*\n🔢 *Opções disponíveis:*\n\t• Digite "pronto" para avançar ao próximo passo.\n\t• Digite "0" ou "sair" para encerrar a partida.\n*—*\n• *Observação:* Caso você não responda em ${CONFIG.TIMEOUT_RESPONSE} segundos, o jogo será encerrado por inatividade de forma automática.\n*—*\nDigite sua resposta:`;
    } else if (progress === 4) {
        currentStep = steps[progress];
        message = `*🤖 Adivinhar Número*\n*—*\n• Jogador(a): @${getUserName(playerName)}\n*—*\n${currentStep}\n*—*\n🔢 *Opções disponíveis:*\n\t• Digite "pronto" para ver o resultado.\n\t• Digite "0" ou "sair" para encerrar a partida.\n*—*\nDigite sua resposta:`;
    } else if (progress === 5) {
        currentStep = `💫🧙🏽‍♂️ Pela minha extrema sabedoria, posso presumir que o resultado final seja igual a: ${gameData.resultado}`;
        message = `*🤖 Adivinhar Número*\n*—*\n• Jogador(a): @${getUserName(playerName)}\n*—*\n${currentStep}\n• Se eu acertei, digite *SIM*. Caso contrário, digite *NÃO*.\n*—*\nDigite sua resposta:`;
    }

    return message;
};

// --- CLASSE DE SESSÃO DO JOGO DE ADIVINHAR O NÚMERO QUE O JOGADOR ESTÁ PENSANDO ---
export class GuessMyNumberSession {
    constructor() {
        this.progresso = 0; // Passo atual (0 a 5)
        this.randomNumber = 0; // Número aleatório para o passo 3
        this.resultado = 0; // Resultado final esperado
        this.fim = false; // Indica se o jogo terminou
    }

    start() {
        this.progresso = 0;
        this.randomNumber = (Math.floor(Math.random() * (CONFIG.RANDOM_ADD_MAX - CONFIG.RANDOM_ADD_MIN + 1)) + CONFIG.RANDOM_ADD_MIN) * 2; // Número par entre 2 e 28
        this.resultado = this.randomNumber / 2; // Resultado final esperado
        this.fim = false;
    }

    respond(input, playerName) {
        input = input.trim().toLowerCase();

        // Encerrar o jogo
        if (input === '0' || ['sair', 'exit', 'fim'].includes(input)) {
            return { valid: true, won: false, message: `🚪 Jogo encerrado com sucesso! Use \`\`\`{prefix}adivinharnmr\`\`\` para novo jogo.` };
        }

        // Avança os passos com "pronto" até o passo 5
        if (input === 'pronto' && this.progresso < 4) {
            this.progresso++;
            return { valid: true, message: renderGame({ progresso: this.progresso, randomNumber: this.randomNumber, resultado: this.resultado, fim: this.fim }, playerName) };
        }

        // Transição do passo 5 para o estado final
        if (input === 'pronto' && this.progresso === 4) {
            this.progresso = 5; // Avança para o estado final
            return { valid: true, message: renderGame({ progresso: this.progresso, randomNumber: this.randomNumber, resultado: this.resultado, fim: this.fim }, playerName) };
        }

        // Valida "sim" ou "não" apenas no estado final (progresso === 5)
        if (this.progresso === 5 && (input === 'sim' || input === 'nao')) {
            const message = input === 'sim'
                ? `🧙🏽‍♂️ O grande sábio sempre tem todas as respostas ✨`
                : `🧙🏽‍♂️ Podes mentir o quanto quiser, mas nós dois sabemos a resposta...`;
            return { valid: true, won: true, message };
        }

        return { valid: false, message: `❌ Resposta inválida! Digite "pronto" para avançar ou, se solicitado, "sim" ou "não".` };
    }

    getResult() {
        return {
            resultado: this.resultado,
            fim: this.fim
        };
    }
}

// --- GERENCIADOR DO JOGO DE ADIVINHAR O NÚMERO QUE O JOGADOR ESTÁ PENSANDO ---
export class GuessMyNumberManager {
    constructor() {
        this.activeSessions = new Map(); // chatId => GuessMyNumberSession
        this.activeGames = new Map();    // chatId => gameData
        this.initInactivityChecker();
    }

    async startGuessMyNumber(chatId, sender) {
        if (this.hasActiveGuessMyNumber(chatId)) {
            return { win: false, message: "❌ Jogo de Adivinhar o Número já ativo neste grupo!" };
        }

        const session = new GuessMyNumberSession();
        session.start();
        this.activeSessions.set(chatId, session);

        const gameData = {
            progresso: session.progresso,
            randomNumber: session.randomNumber,
            resultado: session.resultado,
            fim: session.fim,
            timeoutAt: Math.floor(Date.now() / 1000) + CONFIG.TIMEOUT_RESPONSE,
            currentPlayer: getUserName(sender),
            chatId
        };

        this.activeGames.set(chatId, gameData);

        return { win: false, message: renderGame(gameData, gameData.currentPlayer) };
    }

    async makeGuessMyNumberMove(chatId, sender, response) {
        const session = this.activeSessions.get(chatId);
        const gameData = this.activeGames.get(chatId);

        if (!session || !gameData) {
            return { win: false, message: "❌ Nenhum jogo ativo! Use ```{prefix}adivinharnmr``` para começar." };
        }

        const now = Math.floor(Date.now() / 1000);

        if (gameData.timeoutAt <= now) {
            return this.handleInactivity(chatId);
        }

        if (getUserName(sender) !== gameData.currentPlayer) {
            return { win: false, message: `❌ Apenas @${gameData.currentPlayer} pode responder agora!` };
        }

        // Sincroniza o estado antes de chamar respond
        gameData.progresso = session.progresso;
        gameData.randomNumber = session.randomNumber;
        gameData.resultado = session.resultado;
        gameData.fim = session.fim;

        const result = session.respond(response, gameData.currentPlayer);
        if (!result.valid) {           
            return { win: false, message: result.message };
        }

        // Atualiza apenas o timeout se não for vitória
        if (!result.won) {
            gameData.timeoutAt = now + CONFIG.TIMEOUT_RESPONSE;
        }

        if (result.won) {
            this.activeSessions.delete(chatId);
            this.activeGames.delete(chatId);
            return { win: true, message: result.message };
        }

        return { win: false, message: result.message };
    }

    async endGuessMyNumberGame(chatId, sender) {
        const session = this.activeSessions.get(chatId);
        const gameData = this.activeGames.get(chatId);

        if (!session || !gameData) {
            return { win: false, message: "❌ Nenhum jogo ativo neste grupo." };
        }

        this.activeSessions.delete(chatId);
        this.activeGames.delete(chatId);

        return {
            win: false,
            message: `🚪 Jogo encerrado a mandato de @${getUserName(sender)}. Use \`\`\`{prefix}adivinharnmr\`\`\` para novo jogo.`
        };
    }

    hasActiveGuessMyNumber(chatId) {
        return this.activeGames.has(chatId);
    }

    getActiveGames() {
        return new Map(this.activeGames); // Return a copy to prevent external modification
    }

    initInactivityChecker() {
        setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            for (const [chatId, gameData] of this.activeGames.entries()) {
                if (gameData.timeoutAt && gameData.timeoutAt <= now) {
                    const inactivityJson = this.handleInactivity(chatId);
                    if (inactivityJson) {
                        console.log(`[ADIVINHAR NÚMERO] ⚠️ Inatividade no grupo ${inactivityJson.chatId}! Jogo cancelado.`);
                    }
                }
            }
        }, CONFIG.CHECK_INTERVAL);
    }

    handleInactivity(chatId) {
        const gameData = this.activeGames.get(chatId);
        if (!gameData) return null;

        const inactivityJson = {
            win: false,
            message: `⏰ Jogo encerrado por inatividade de @${gameData.currentPlayer} após ${CONFIG.TIMEOUT_RESPONSE} segundos.`,
            inactivity: true,
            chatId
        };

        this.activeSessions.delete(chatId);
        this.activeGames.delete(chatId);

        return inactivityJson;
    }
}

// --- INSTÂNCIA E EXPORTS ---
const manager = new GuessMyNumberManager();

export const start = (...args) => manager.startGuessMyNumber(...args);
export const makeMove = (...args) => manager.makeGuessMyNumberMove(...args);
export const endGame = (...args) => manager.endGuessMyNumberGame(...args);
export const hasActive = (...args) => manager.hasActiveGuessMyNumber(...args);
export const activeGames = () => manager.getActiveGames();