// --- CONFIGURAÇÃO ---
export const CONFIG = {
    TIMEOUT_GUESS: 60 * 2, // 2 minutos para responder os palpites.
    CHECK_INTERVAL: 5000, // Checagem de inatividade a cada 5 segundos.
    MAX_HINTS: 2 // Número máximo de dicas por jogo.
};

// --- HELPER: Extrair nome de usuário ---
export const getUserName = (userId) => {
    if (!userId || typeof userId !== 'string') return 'unknown';
    return userId.split('@')[0];
};

// --- HELPER: Remover acentos para comparação ---
const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// --- HELPER: Renderizar palavra com barra de progresso (erros) e forca ---
export const renderGame = (gameData, playerName) => {
    const hangmanStages = [
        // 0 erros
        `🪢
  +---+
  |   |
      |
      |
      |
      |
  ═════`,
        // 1 erro
        `🪢
  +---+
  |   😊
      |
      |
      |
      |
  ═════`,
        // 2 erros
        `🪢
  +---+
  |   😕
      |
      |
      |
      |
  ═════`,
        // 3 erros
        `🪢
  +---+
  |   😟
     /|
      |
      |
      |
  ═════`,
        // 4 erros
        `🪢
  +---+
  |   😣
     /|\\
      |
      |
      |
  ═════`,
        // 5 erros
        `🪢
  +---+
  |   😭
     /|\\
     / 
      |
      |
  ═════`
    ];

    const errors = gameData.errors;
    const maxErrors = 6;
    const progress = Math.min(100, (errors / maxErrors) * 100);
    const filled = Math.floor(progress / 10);
    const empty = 10 - filled;
    const bar = "█".repeat(filled) + "░".repeat(empty);
    const progressDisplay = progress.toFixed(2); // Garante 2 casas decimais (ex.: 33.33)
    const wordDisplay = gameData.displayWord.split('').map((letter, i) => 
        gameData.guessedLetters.has(gameData.word[i]) ? letter : '_'
    ).join(' ');
    const usedLetters = Array.from(gameData.usedLetters).sort().join(', ');
    const hintsRemaining = CONFIG.MAX_HINTS - gameData.hintsUsed;

    return `*🪢 Jogo da Forca:*\n*—*\n• Jogador(a): @${getUserName(playerName)}\n• Erros: *${progress.toFixed(2)}%* [${bar}]\n• Dicas restantes: *${hintsRemaining}*\n*—*\n${hangmanStages[errors]}\n*—*\n🔤 *Palavra:* ${wordDisplay}\n*—*\n❌ *Letras usadas:* ${usedLetters || 'Nenhuma'}\n*—*\n🔢 *Opções disponíveis:*\n\t• Digite uma letra (ex: "a") para palpitar.\n\t• Digite a palavra completa para tentar resolver.\n\t• Digite "dica" para receber uma dica (${hintsRemaining} restantes).\n\t• Digite "0" ou "sair" para encerrar a partida.\n*—*\n• *Observação:* Caso você não responda em ${CONFIG.TIMEOUT_GUESS} segundos, o jogo será encerrado por inatividade de forma automática.\n*—*\nDigite seu palpite:`;
};

// --- CLASSE DE SESSÃO DO JOGO DA FORCA ---
export class HangmanSession {
    constructor() {
        this.word = ''; // Versão sem acentos para comparação
        this.displayWord = ''; // Versão com acentos para exibição
        this.hint = '';
        this.guessedLetters = new Set();
        this.usedLetters = new Set();
        this.errors = 0;
        this.hintsUsed = 0;
        this.isWon = false;
        this.isLost = false;
    }

    // Lista de palavras com dicas associadas (100 palavras)
    static wordHints = {
        ABELHA: { displayWord: "ABELHA", hint: "Inseto que produz mel e vive em colmeias." },
        ADIVINHAR: { displayWord: "ADIVINHAR", hint: "Descobrir algo com base em pistas." },
        ALEMANHA: { displayWord: "ALEMANHA", hint: "É um país germânico do continente europeu, conhecido por sua tecnologia e indústria." },
        AMEIXA: { displayWord: "AMEIXA", hint: "É uma fruta que possui alto valor nutritivo, rica em açúcar, sais minerais (cálcio, fósforo e ferro) e algumas vitaminas." },
        AMOR: { displayWord: "AMOR", hint: "É um sentimento mais profundo, duradouro e estável baseado numa relação de reciprocidade e cuidado." },
        ANIVERSARIO: { displayWord: "ANIVERSÁRIO", hint: "Um momento de alegria e celebração." },
        ARCOIRIS: { displayWord: "ARCOÍRIS", hint: "Fenômeno óptico com sete cores, formado após a chuva." },
        ARQUITETO: { displayWord: "ARQUITETO", hint: "Profissional que projeta edifícios e espaços." },
        ARTIFICIAL: { displayWord: "ARTIFICIAL", hint: "Imita comportamentos humanos." },
        ASTRONAUTA: { displayWord: "ASTRONAUTA", hint: "Pessoa que viaja ao espaço em missões espaciais." },
        AVIAO: { displayWord: "AVIÃO", hint: "Veículo aéreo com motor, usado para viagens longas." },
        BABILONIA: { displayWord: "BABILÔNIA", hint: "É uma cidade da Mesopotâmia, conhecida por sua riqueza e cultura." },
        BANANA: { displayWord: "BANANA", hint: "Por ser um fruto partenocárpico, não possui sementes, com exceção de uma espécie vendida no mercado indonésio, a Musa balbisiana." },
        BASQUETE: { displayWord: "BASQUETE", hint: "Esporte jogado com uma bola e cestas elevadas." },
        BIBLIOTECA: { displayWord: "BIBLIOTECA", hint: "Local onde se guardam livros para leitura e estudo." },
        BICICLETA: { displayWord: "BICICLETA", hint: "Veículo de duas rodas movido a pedal, ecológico para locomoção." },
        BOLO: { displayWord: "BOLO", hint: "Doce assado, comum em festas de aniversário." },
        BRASIL: { displayWord: "BRASIL", hint: "Maior país da América Latina, conhecido por sua diversidade cultural." },
        CACHORRO: { displayWord: "CACHORRO", hint: "Animal de estimação leal, conhecido como 'melhor amigo do homem'." },
        CAMARAO: { displayWord: "CAMARÃO", hint: "É um fruto do mar, especificando o tipo são crustáceos." },
        CAMPO: { displayWord: "CAMPO", hint: "Área aberta de terra, usada para agricultura ou esportes." },
        CASA: { displayWord: "CASA", hint: "Edifício onde as pessoas moram, com quartos e cozinha." },
        CEREJA: { displayWord: "CEREJA", hint: "Fruta pequena e vermelha, comum em sobremesas." },
        CHOCOLATE: { displayWord: "CHOCOLATE", hint: "Doce feito de cacau, popular em barras, bombons e sobremesas." },
        CIMENTO: { displayWord: "CIMENTO", hint: "É um pó fino com propriedades aglomerantes, aglutinantes ou ligantes, que se enrijece ao entrar em contato com a água." },
        COMPUTADOR: { displayWord: "COMPUTADOR", hint: "Dispositivo eletrônico para processar dados e acessar a internet." },
        DENTISTA: { displayWord: "DENTISTA", hint: "Profissional que cuida da saúde bucal, como dentes e gengivas." },
        DESENVOLVIMENTO: { displayWord: "DESENVOLVIMENTO", hint: "Criação de software ou sistemas." },
        DEUS: { displayWord: "DEUS", hint: "É uma divindade suprema, conhecido por sua onipotência e onisciência." },
        DIABO: { displayWord: "DIABO", hint: "É uma divindade maligna, conhecido por sua maldade e crueldade." },
        DINAMARCA: { displayWord: "DINAMARCA", hint: "País nórdico conhecido por seus vikings e contos de fadas." },
        ELEFANTE: { displayWord: "ELEFANTE", hint: "Maior mamífero terrestre, conhecido por sua tromba e presas de marfim." },
        ELDORADO: { displayWord: "ELDORADO", hint: "É uma cidade mítica, conhecida por seu ouro e riquezas." },
        ESCOLA: { displayWord: "ESCOLA", hint: "É um ambiente de formação e educação, geralmente frequentado por crianças e adolescentes." },
        ESPELHO: { displayWord: "ESPELHO", hint: "Objeto que reflete imagens, usado em banheiros e quartos." },
        ESTRELA: { displayWord: "ESTRELA", hint: "É um corpo celeste luminoso, conhecido por sua beleza e variedade." },
        FLORESTA: { displayWord: "FLORESTA", hint: "Grande área coberta por árvores e vegetação." },
        FLOR: { displayWord: "FLOR", hint: "Parte colorida de plantas, usada em jardins e buquês." },
        FORCA: { displayWord: "FORCA", hint: "Jogo clássico de adivinhar palavras." },
        FOTOGRAFIA: { displayWord: "FOTOGRAFIA", hint: "Arte de capturar imagens com uma câmera." },
        FRANCA: { displayWord: "FRANÇA", hint: "É um país do continente europeu, conhecido por sua moda e gastronomia." },
        GATO: { displayWord: "GATO", hint: "Animal doméstico felino, conhecido por sua agilidade e ronronar." },
        GELO: { displayWord: "GELO", hint: "Água em estado sólido, usada para resfriar bebidas." },
        GOMORRA: { displayWord: "GOMORRA", hint: "É uma cidade bíblica, conhecida por sua depravação e pecado." },
        GUATEMALA: { displayWord: "GUATEMALA", hint: "A cultura indígena domina o país, sobretudo no interior e essa composição torna o país diferente de seus vizinhos." },
        HADES: { displayWord: "HADES", hint: "Mitologia, era visto como um deus insensível, impiedoso e repugnante." },
        HIDRANTE: { displayWord: "HIDRANTE", hint: "Tem como finalidade o combate ao fogo, proteção de vidas e do patrimônio." },
        HOSPITAL: { displayWord: "HOSPITAL", hint: "Lugar onde se trata doenças e emergências médicas." },
        IDEIA: { displayWord: "IDÉIA", hint: "Pensamento ou conceito criativo que surge na mente." },
        INFERNO: { displayWord: "INFERNO", hint: "É um lugar mitológico, conhecido por seu fogo e sofrimento." },
        INTELIGENCIA: { displayWord: "INTELIGÊNCIA", hint: "Capacidade de aprender e resolver problemas." },
        IRACEMA: { displayWord: "IRACEMA", hint: "É um romance escrito em 1865, a virgem dos lábios de mel, que tinha os cabelos mais negros que a asas da graúna e mais longos que seu talhe de palmeira." },
        ITALIA: { displayWord: "ITÁLIA", hint: "É um país do continente europeu, um país românico e também é conhecido por sua arte e arquitetura." },
        JANELA: { displayWord: "JANELA", hint: "Abertura na parede para luz e ventilação." },
        JOGO: { displayWord: "JOGO", hint: "Atividade recreativa com regras." },
        JORNAL: { displayWord: "JORNAL", hint: "Publicação diária com notícias e informações." },
        JAVASCRIPT: { displayWord: "JAVASCRIPT", hint: "Linguagem usada em páginas web." },
        KAMAITACHI: { displayWord: "KAMAITACHI", hint: "É cantor e compositor Brasileiro do estado de RJ, suas músicas começaram a fazer sucesso após o lançamento de Manual do Suicidio, em 4 de janeiro de 2018." },
        LAGOA: { displayWord: "LAGOA", hint: "Corpo de água menor que um lago, cercado por terra." },
        LIMAO: { displayWord: "LIMÃO", hint: "Fruta cítrica usada em sucos e sobremesas." },
        LIVRO: { displayWord: "LIVRO", hint: "Objeto de papel com páginas que contam histórias ou ensinam conhecimentos." },
        LUBA: { displayWord: "LUBA", hint: "O criador de conteúdo produz vídeos de humor com reações, desafios e jogo, além de collabs com outros criadores de conteúdo com quem arranca muitas risadas! Atualmente o criador está com 8.8M de inscritos no aplicativo YouTube!" },
        MACEIO: { displayWord: "MACEIÓ", hint: "É uma cidade do Brasil, a capital do estado do Nordeste e conhecida por suas praias e belezas naturais." },
        MARTE: { displayWord: "MARTE", hint: "Planeta vermelho do Sistema Solar, conhecido por sua cor." },
        MEDICO: { displayWord: "MÉDICO", hint: "Profissional de saúde que diagnostica e trata doenças." },
        MONTANHA: { displayWord: "MONTANHA", hint: "Elevação natural do terreno, ideal para escaladas e trilhas." },
        MUSICA: { displayWord: "MÚSICA", hint: "Arte de combinar sons para criar melodias." },
        NAVIO: { displayWord: "NAVIO", hint: "Embarcação grande para transporte em mares." },
        NETFLIX: { displayWord: "NETFLIX", hint: "Aplicativo de Streaming, a partir de R$19,90 o plano mais básico..." },
        NUVEM: { displayWord: "NUVEM", hint: "Massa de vapor d’água visível no céu." },
        ODIO: { displayWord: "ÓDIO", hint: "É um sentimento negativo e também conhecido por sua tristeza e dor." },
        PALAVRA: { displayWord: "PALAVRA", hint: "Sequência de letras com significado." },
        PANFLETOS: { displayWord: "PANFLETOS", hint: "São objetos usados para ler e geralmente são feitos de papel." },
        PARAISO: { displayWord: "PARAÍSO", hint: "É um lugar mitológico, conhecido por sua beleza e perfeição." },
        PASTEL: { displayWord: "PASTEL", hint: "É um alimento composto por uma massa à base de farinha de trigo a que se dá a forma de um envelope." },
        PERSEFONE: { displayWord: "PERSÉFONE", hint: "Mitologia, deusa das ervas, flores, frutos e perfumes, filha de Zeus e Deméter." },
        PINTURA: { displayWord: "PINTURA", hint: "Arte de aplicar tinta em superfícies para criar imagens." },
        PISTOLA: { displayWord: "PISTOLA", hint: "Modernamente podemos conceituar como arma curta, raiada, portátil." },
        PIZZA: { displayWord: "PIZZA", hint: "Prato italiano redondo com massa, molho, queijo e recheios variados." },
        PORTUGAL: { displayWord: "PORTUGAL", hint: "É o Estado-Nação mais antigo da Europa e um dos mais antigos do mundo." },
        PRAIA: { displayWord: "PRAIA", hint: "Área de areia à beira-mar, ideal para lazer." },
        PROGRAMACAO: { displayWord: "PROGRAMAÇÃO", hint: "Escrever instruções para computadores." },
        RELAMPAGO: { displayWord: "RELÂMPAGO", hint: "Fenômeno elétrico que ilumina o céu durante tempestades." },
        SAPATO: { displayWord: "SAPATO", hint: "Calçado que protege e cobre os pés." },
        SATURNO: { displayWord: "SATURNO", hint: "É o segundo maior planeta do Sistema Solar, com 9 vezes o tamanho da Terra." },
        SAXOFONE: { displayWord: "SAXOFONE", hint: "Instrumento Musical." },
        SKATE: { displayWord: "SKATE", hint: "É constituído uma prancha, quatro rodinhas e dois eixos que prendem as rodas." },
        SOL: { displayWord: "SOL", hint: "Estrela central do Sistema Solar, fonte de luz e energia para a Terra." },
        TELEFONE: { displayWord: "TELEFONE", hint: "Aparelho para comunicação à distância por voz ou mensagens." },
        TOKYO: { displayWord: "TOKYO", hint: "Capital do Japão, famosa por sua tecnologia e templos antigos." },
        TREM: { displayWord: "TREM", hint: "Veículo que viaja sobre trilhos, transportando passageiros." },
        UNIVERSIDADE: { displayWord: "UNIVERSIDADE", hint: "Instituição de ensino superior que oferece cursos de graduação e pós." },
        VIAGEM: { displayWord: "VIAGEM", hint: "Deslocamento para outro lugar, muitas vezes por lazer." },
        VIOLAO: { displayWord: "VIOLÃO", hint: "Instrumento de cordas usado em músicas acústicas." },
        VULCANO: { displayWord: "VULCANO", hint: "É uma montanha que expele lava e gases, conhecida por sua força e destruição." },
        VULTO: { displayWord: "VULTO", hint: "Figura ou sombra indistinta vista ao longe." },
        XADREZ: { displayWord: "XADREZ", hint: "Jogo de estratégia com peças como rei e rainha." },
        YOUTUBE: { displayWord: "YOUTUBE", hint: "É um aplicativo que tem uma diversidade de vídeos e músicas." },
        ZEBRA: { displayWord: "ZEBRA", hint: "Animal africano com listras brancas e pretas." }
    };

    start() {
        const words = Object.keys(HangmanSession.wordHints);
        this.word = words[Math.floor(Math.random() * words.length)];
        this.displayWord = HangmanSession.wordHints[this.word].displayWord;
        this.hint = HangmanSession.wordHints[this.word].hint;
        this.guessedLetters = new Set();
        this.usedLetters = new Set();
        this.errors = 0;
        this.hintsUsed = 0;
        this.isWon = false;
        this.isLost = false;
    }

    guess(input) {
        input = removeAccents(input.toUpperCase().trim()); // Remove acentos e converte para maiúsculas

        if (input === 'DICA') {
            if (this.hintsUsed >= CONFIG.MAX_HINTS) {
                return { valid: false, message: '❌ Sem dicas disponíveis!' };
            }
            this.hintsUsed++;
            return { valid: true, isHint: true, message: `💡 Dica: ${this.hint}` };
        }

        if (input.length === 1 && /^[A-Z]$/.test(input)) {
            // Palpite de letra
            if (this.usedLetters.has(input)) {
                return { valid: false, message: '❌ Letra já usada!' };
            }
            this.usedLetters.add(input);
            if (this.word.includes(input)) {
                this.guessedLetters.add(input);
            } else {
                this.errors++;
                return { 
                    valid: true, 
                    message: `❌ A letra "${input}" não está na palavra! Cuidado, você tem ${6 - this.errors} tentativas restantes!` 
                };
            }
        } else if (input.length > 1) {
            // Tentativa de resolver a palavra
            if (input === this.word) {
                this.isWon = true;
                return { valid: true, won: true };
            } else {
                this.errors += 2; // Penalidade por erro na palavra completa
                return { 
                    valid: true, 
                    message: `❌ Palavra "${input}" está errada! Perdeu 2 tentativas. Restam ${6 - this.errors} tentativas!` 
                };
            }
        } else {
            return { valid: false, message: '❌ Palpite inválido! Digite uma letra ou a palavra completa.' };
        }

        this.isWon = this.word.split('').every((letter, i) => 
            this.guessedLetters.has(letter) || !this.displayWord[i].match(/[A-ZÀ-Ú]/i)
        );
        this.isLost = this.errors >= 6;

        // Fornecer dica automaticamente após 3 erros, se disponível
        if (this.errors === 3 && this.hintsUsed < CONFIG.MAX_HINTS) {
            this.hintsUsed++;
            return { valid: true, isHint: true, message: `💡 Dica automática (3 erros): ${this.hint}` };
        }

        return { valid: true };
    }

    getResult() {
        return {
            word: this.word,
            displayWord: this.displayWord, // Versão com acentos para exibição
            won: this.isWon,
            lost: this.isLost
        };
    }
}

// --- GERENCIADOR DO JOGO DA FORCA ---
export class HangmanManager {
    constructor() {
        this.activeSessions = new Map(); // chatId => HangmanSession
        this.activeGames = new Map();    // chatId => gameData
        this.inactiveQueue = [];         // JSONs de inatividade
        this.initInactivityChecker();
    }

    async startHangman(chatId, sender) {
        if (this.hasActiveHangman(chatId)) {
            return { win: false, message: "❌ Jogo da Forca já ativo neste grupo!" };
        }

        const session = new HangmanSession();
        session.start();
        this.activeSessions.set(chatId, session);

        const gameData = {
            word: session.word,
            displayWord: session.displayWord, // Adiciona a palavra com acentos
            guessedLetters: session.guessedLetters,
            usedLetters: session.usedLetters,
            errors: session.errors,
            hintsUsed: session.hintsUsed,
            timeoutAt: Math.floor(Date.now() / 1000) + CONFIG.TIMEOUT_GUESS,
            currentPlayer: getUserName(sender),
            chatId
        };

        this.activeGames.set(chatId, gameData);

        return { win: false, message: renderGame(gameData, sender) };
    }

    async makeHangmanMove(chatId, sender, guess) {
        const session = this.activeSessions.get(chatId);
        const gameData = this.activeGames.get(chatId);

        if (!session || !gameData) {
            return { win: false, message: "❌ Nenhum jogo ativo! Use ```{prefix}forca```." };
        }

        const now = Math.floor(Date.now() / 1000);

        if (gameData.timeoutAt <= now) {
            return this.handleInactivity(chatId);
        }

        if (guess === "0" || ["sair", "exit", "fim"].includes(guess.toLowerCase())) {
            return this.endHangmanGame(chatId, sender);
        }

        const result = session.guess(guess);
        if (!result.valid) {
            return { win: false, message: result.message };
        }

        gameData.word = session.word;
        gameData.displayWord = session.displayWord;
        gameData.guessedLetters = session.guessedLetters;
        gameData.usedLetters = session.usedLetters;
        gameData.errors = session.errors;
        gameData.hintsUsed = session.hintsUsed;
        gameData.timeoutAt = now + CONFIG.TIMEOUT_GUESS;

        if (result.isHint) {
            return { win: false, message: `${result.message}\n\n${renderGame(gameData, sender)}` };
        }

        if (session.isWon) {
            const result = session.getResult();
            this.activeSessions.delete(chatId);
            this.activeGames.delete(chatId);

            return {
                win: true,
                startNewGame: true,
                message: `🎉 Parabéns, @${getUserName(sender)}! Você ganhou!\n🎯 Palavra: ${result.displayWord}`
            };
        }

        if (session.isLost) {
            const result = session.getResult();
            this.activeSessions.delete(chatId);
            this.activeGames.delete(chatId);

            return {
                win: false,
                message: `💀 Perdeu, @${getUserName(sender)}!\n🎯 Palavra: ${result.displayWord}`
            };
        }

        return { win: false, message: `${result.message || ''}\n\n${renderGame(gameData, sender)}` };
    }

    async endHangmanGame(chatId, sender) {
        const session = this.activeSessions.get(chatId);
        const gameData = this.activeGames.get(chatId);

        if (!session || !gameData) {
            return { win: false, message: "❌ Nenhum jogo ativo neste grupo." };
        }

        this.activeSessions.delete(chatId);
        this.activeGames.delete(chatId);

        return {
            win: false,
            message: `🚪 *JOGO ENCERRADO!* 🎮\nO jogo da forca acaba de ser encerrado pelo: *@${getUserName(sender)}*.\n• Para iniciar um novo jogo, use o comando: \`\`\`{prefix}forca\`\`\`.`
        };
    }

    hasActiveHangman(chatId) {
        return this.activeGames.has(chatId);
    }

    getActiveGames() {
        return this.activeGames;
    }

    // --- LOOP DE INATIVIDADE (gera JSON e loga automaticamente) ---
    initInactivityChecker() {
        setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            for (const [chatId, gameData] of this.activeGames.entries()) {
                if (gameData.timeoutAt && gameData.timeoutAt <= now) {
                    const inactivityJson = this.handleInactivity(chatId);
                    if (inactivityJson) {
                        return console.log(`[FORCA] ⚠️ Inatividade no grupo ${inactivityJson?.chatId}! Jogo cancelado.`);
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
            message: `⏰ Jogo encerrado por inatividade de @${gameData.currentPlayer} após 2 minutos.`,
            inactivity: true,
            chatId
        };

        this.activeSessions.delete(chatId);
        this.activeGames.delete(chatId);

        return inactivityJson;
    }
}

// --- INSTÂNCIA E EXPORTS ---
const manager = new HangmanManager();

export const start = (...args) => manager.startHangman(...args);
export const makeMove = (...args) => manager.makeHangmanMove(...args);
export const endGame = (...args) => manager.endHangmanGame(...args);
export const hasActive = (...args) => manager.hasActiveHangman(...args);
export const activeGames = () => manager.activeGames;