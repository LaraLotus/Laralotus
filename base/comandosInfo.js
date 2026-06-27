// ====== INFORMAÇÕES DOS COMANDOS ==========
export const comandosInfo = {
//============= MENUS ====================
"menu": {
desc: "Exibe o menu principal do bot com todos os comandos disponíveis.",
uso: "menu",
exemplo: "menu",
detalhes: "Mostra uma imagem personalizada e lista categorizada de comandos."
},
"menuadm": {
desc: "Exibe o menu de comandos exclusivos para administradores do grupo.",
uso: "menuadm",
exemplo: "menuadm",
detalhes: "Mostra comandos como antilink, ban, promover, etc."
},
"menudono": {
desc: "Exibe o menu de comandos exclusivos para o dono do bot.",
uso: "menudono",
exemplo: "menudono",
detalhes: "Mostra comandos de configuração global, reinicialização, etc."
},
"menulogos": {
desc: "Exibe o menu de comandos para criação de logos personalizadas.",
uso: "menulogos",
exemplo: "menulogos",
detalhes: "Lista todos os comandos de logo disponíveis."
},
"menubrincadeira": {
desc: "Exibe o menu de comandos de brincadeiras (apenas quando o modo brincadeira está ativo).",
uso: "menubrincadeira",
exemplo: "menubrincadeira",
detalhes: "Mostra comandos como ship, meme, dado, etc."
},
// === CONFIGURAÇÃO DO BOT (DONO) ============
"prefixo-bot": {
desc: "Altera o prefixo do bot (deve ser um único caractere).",
uso: "prefixo-bot [novo prefixo]",
exemplo: "prefixo-bot !",
detalhes: "Reinicie o bot após a alteração para aplicar."
},
"nome-bot": {
desc: "Altera o nome do bot exibido em alguns menus.",
uso: "nome-bot [novo nome]",
exemplo: "nome-bot LaraBot",
detalhes: "O nome é salvo no arquivo lara.json."
},
"nome-dona": {
desc: "Altera o nome da dona do bot exibido em menus.",
uso: "nome-dona [novo nome]",
exemplo: "nome-dona Ana",
detalhes: "Apenas para personalização visual."
},
"key": {
desc: "Altera a chave de API (larakey) usada nos comandos externos.",
uso: "key [nova key]",
exemplo: "key abc123",
detalhes: "Essa key é usada para acessar os serviços da API Lotus."
},
"numerodono": {
desc: "Altera o número do dono (e obtém o LID automaticamente).",
uso: "numerodono [número com DDD]",
exemplo: "numerodono 5511999999999",
detalhes: "O LID é obtido automaticamente. Reinicie o bot depois."
},
"reviver": {
desc: "Reinicia o bot e limpa a sessão (QR code).",
uso: "reviver",
exemplo: "reviver",
detalhes: "Remove a pasta auth_info_baileys e reinicia o processo."
},
"restart": {
desc: "Apelido para o comando reviver.",
uso: "restart",
exemplo: "restart",
detalhes: "Mesmo funcionamento que reviver."
},
"lara": {
desc: "Ativa ou desativa o bot em um grupo específico (para o dono).",
uso: "lara [número do grupo da lista]",
exemplo: "lara 3",
detalhes: "Use !listagp para ver a numeração dos grupos."
},
"prefixo": {
desc: "Altera o prefixo do bot (até 3 caracteres).",
uso: "prefixo [novo prefixo]",
exemplo: "prefixo /",
detalhes: "Reinicie o bot após a alteração."
},
"setprefix": {
desc: "Apelido para o comando prefixo.",
uso: "setprefix [novo prefixo]",
exemplo: "setprefix ?",
detalhes: "Mesmo funcionamento que prefixo."
},
"antipv": {
desc: "Ativa/desativa o bloqueio de mensagens privadas de números desconhecidos.",
uso: "antipv on/off",
exemplo: "antipv on",
detalhes: "Quando ativo, o bot não responde a quem não está nos contatos/grupos."
},
"escudo": {
desc: "Ativa/desativa o anti-roubo (impede promoção/demoção não autorizada).",
uso: "escudo",
exemplo: "escudo",
detalhes: "Apenas o dono do bot pode usar. Protege os administradores."
},
"dono": {
desc: "Mostra informações do dono do bot.",
uso: "dono",
exemplo: "dono",
detalhes: "Exibe nome, versão e contato do dono."
},
"seradm": {
desc: "Promove o usuário mencionado (ou quem enviou) a administrador.",
uso: "seradm [@marcar]",
exemplo: "seradm @fulano",
detalhes: "O bot precisa ser administrador no grupo."
},
    "sermembro": {
        desc: "Rebaixa o usuário mencionado (ou quem enviou) para membro comum.",
        uso: "sermembro [@marcar]",
        exemplo: "sermembro @fulano",
        detalhes: "O bot precisa ser administrador no grupo."
    },
    "ver": {
        desc: "Revela o conteúdo de uma mensagem de visualização única (foto/vídeo).",
        uso: "ver (respondendo a uma mensagem de visualização única)",
        exemplo: "ver",
        detalhes: "Funciona apenas se você responder à mensagem de visu única."
    },
    "fotomenu": {
        desc: "Altera a imagem de fundo do menu principal.",
        uso: "fotomenu (respondendo a uma imagem)",
        exemplo: "fotomenu",
        detalhes: "A imagem é enviada para upload e o link salvo em links.json."
    },
    "gerarlink": {
        desc: "Gera um link público de uma imagem, vídeo ou GIF respondido.",
        uso: "gerarlink (respondendo a uma mídia)",
        exemplo: "gerarlink",
        detalhes: "Upload via API do Lotus."
    },
    "case": {
        desc: "Lista todos os comandos disponíveis extraídos do código.",
        uso: "case",
        exemplo: "case",
        detalhes: "Mostra os nomes de todos os cases do index.js."
    },
    "cases": {
        desc: "Apelido para o comando case.",
        uso: "cases",
        exemplo: "cases",
        detalhes: "Mesma funcionalidade de case."
    },
    "listagp": {
        desc: "Lista todos os grupos onde o bot está presente, com detalhes.",
        uso: "listagp",
        exemplo: "listagp",
        detalhes: "Mostra número, criador, participantes, link e ID de cada grupo."
    },
    "sairgp": {
        desc: "Faz o bot sair de um grupo especificado pelo número da lista.",
        uso: "sairgp [número]",
        exemplo: "sairgp 3",
        detalhes: "Use !listagp para ver a numeração dos grupos."
    },
    "entrargp": {
        desc: "Faz o bot entrar em um grupo através de link de convite.",
        uso: "entrargp [link do grupo]",
        exemplo: "entrargp https://chat.whatsapp.com/abc123",
        detalhes: "Apenas o dono pode usar este comando."
    },
    "donos": {
        desc: "Adiciona um novo dono ao bot (até 3 donos).",
        uso: "donos [número]",
        exemplo: "donos 5511999999999",
        detalhes: "Apenas o dono principal pode usar."
    },
    "rmdono": {
        desc: "Remove um dono da lista de donos.",
        uso: "rmdono [número]",
        exemplo: "rmdono 5511999999999",
        detalhes: "Apenas o dono principal pode usar."
    },

    // === COMANDOS DE PROTEÇÃO ==================
    "antilink": {
        desc: "Remove quem enviar links da web (exceto links de grupos).",
        uso: "antilink",
        exemplo: "antilink",
        detalhes: "Ativa/desativa a remoção automática de links de sites. Links do próprio grupo não são removidos."
    },
    "antilinkgp": {
        desc: "Remove quem enviar links de grupos do WhatsApp.",
        uso: "antilinkgp",
        exemplo: "antilinkgp",
        detalhes: "Ativa/desativa a remoção de links de convite para grupos. Links do próprio grupo são ignorados."
    },
    "antiimg": {
        desc: "Remove quem enviar imagens no grupo.",
        uso: "antiimg",
        exemplo: "antiimg",
        detalhes: "Ativa/desativa o bloqueio de envio de imagens. Apenas administradores ficam liberados."
    },
    "antivideo": {
        desc: "Remove quem enviar vídeos no grupo.",
        uso: "antivideo",
        exemplo: "antivideo",
        detalhes: "Ativa/desativa o bloqueio de envio de vídeos."
    },
    "antipalavrao": {
desc: "Ativa ou desativa o sistema de bloqueio de palavrões no grupo.",
uso: "antipalavrao 1/0",
exemplo: "antipalavrao 1",
detalhes: "Quando ativado, o bot monitora mensagens e aplica as ações configuradas ao detectar palavras proibidas."
},

"addpalavrao": {
desc: "Adiciona uma nova palavra à lista de palavrões bloqueados.",
uso: "addpalavrao palavra",
exemplo: "addpalavrao exemplo",
detalhes: "A palavra informada será adicionada à lista de bloqueio do grupo."
},

"removerpalavrao": {
desc: "Remove uma palavra da lista de palavrões bloqueados.",
uso: "removerpalavrao palavra",
exemplo: "removerpalavrao exemplo",
detalhes: "A palavra informada será removida da lista de bloqueio do grupo."
},

"listapalavrao": {
desc: "Exibe todas as palavras cadastradas na lista de bloqueio.",
uso: "listapalavrao",
exemplo: "listapalavrao",
detalhes: "Mostra a lista completa de palavras proibidas configuradas para o grupo."
},
    "antidoc": {
        desc: "Remove quem enviar documentos no grupo.",
        uso: "antidoc",
        exemplo: "antidoc",
        detalhes: "Ativa/desativa o bloqueio de envio de documentos."
    },
    "antiloc": {
        desc: "Remove quem enviar localizações no grupo.",
        uso: "antiloc",
        exemplo: "antiloc",
        detalhes: "Ativa/desativa o bloqueio de envio de localizações."
    },
    "antisticker": {
        desc: "Remove quem enviar figurinhas no grupo.",
        uso: "antisticker",
        exemplo: "antisticker",
        detalhes: "Ativa/desativa o bloqueio de envio de figurinhas."
    },
    "anticontato": {
        desc: "Remove quem enviar contatos no grupo.",
        uso: "anticontato",
        exemplo: "anticontato",
        detalhes: "Ativa/desativa o bloqueio de envio de contatos."
    },
    "antiaudio": {
        desc: "Remove quem enviar áudios no grupo.",
        uso: "antiaudio",
        exemplo: "antiaudio",
        detalhes: "Ativa/desativa o bloqueio de envio de áudios."
    },
    "antienquete": {
        desc: "Remove quem criar enquetes no grupo.",
        uso: "antienquete",
        exemplo: "antienquete",
        detalhes: "Ativa/desativa o bloqueio de criação de enquetes."
    },
    "antistatus": {
        desc: "Remove quem enviar menção de status (@todos ou @admins) no grupo.",
        uso: "antistatus",
        exemplo: "antistatus",
        detalhes: "Ativa/desativa o bloqueio de menções de status."
    },
    "x9": {
        desc: "Avisa quando alguém entra ou sai do grupo.",
        uso: "x9",
        exemplo: "x9",
        detalhes: "Quando ativado, o bot informa quem entrou/saiu e qual administrador autorizou."
    },
    "soadm": {
        desc: "Modo apenas administradores podem usar comandos.",
        uso: "soadm",
        exemplo: "soadm",
        detalhes: "Ativa/desativa o modo onde apenas ADMs podem usar comandos no bot."
    },
    "bemvindo": {
        desc: "Ativa mensagem de boas-vindas para novos membros.",
        uso: "bemvindo",
        exemplo: "bemvindo",
        detalhes: "Ativa/desativa o sistema de boas-vindas. Use !legendabv para personalizar a mensagem."
    },
    "legendabv": {
        desc: "Personaliza a mensagem de boas-vindas.",
        uso: "legendabv [mensagem]",
        exemplo: "legendabv Bem-vindo #numerodele# ao #nomedogp#!",
        detalhes: "Variáveis: #numerodele#, #nomedogp#, #membros#"
    },
    "bv": {
        desc: "Apelido para o comando bemvindo.",
        uso: "bv",
        exemplo: "bv",
        detalhes: "Mesma funcionalidade de bemvindo."
    },
    "saida": {
        desc: "Ativa mensagem quando alguém sai do grupo.",
        uso: "saida",
        exemplo: "saida",
        detalhes: "Ativa/desativa o sistema de mensagem de saída. Use !legendasaiu para personalizar."
    },
    "legendasaiu": {
        desc: "Personaliza a mensagem de saída.",
        uso: "legendasaiu [mensagem]",
        exemplo: "legendasaiu 😢 #numerodele# saiu do #nomedogp#",
        detalhes: "Variáveis: #numerodele#, #nomedogp#, #membros#"
    },
    "autofigu": {
        desc: "Converte imagens/vídeos curtos em figurinhas automaticamente.",
        uso: "autofigu",
        exemplo: "autofigu",
        detalhes: "Quando ativado, qualquer imagem ou vídeo (até 9s) enviado vira figurinha."
    },
    "autorepo": {
        desc: "Responde automaticamente a certas palavras.",
        uso: "autorepo",
        exemplo: "autorepo",
        detalhes: "O bot responde automaticamente a palavras como 'oi', 'bom dia', 'boa noite'."
    },
    "modobrincadeira": {
        desc: "Ativa respostas engraçadas para mensagens.",
        uso: "modobrincadeira",
        exemplo: "modobrincadeira",
        detalhes: "O bot responde de forma engraçada a palavras como 'oi', 'kkk', 'te amo'."
    },
    "bemvindoimg": {
        desc: "Ativa/desativa o envio de imagem na mensagem de boas‑vindas.",
        uso: "bemvindoimg",
        exemplo: "bemvindoimg",
        detalhes: "Use !bemvindofoto para trocar a imagem."
    },
    "bemvindofoto": {
        desc: "Altera a imagem enviada na boas‑vindas (responda a uma foto).",
        uso: "bemvindofoto (respondendo imagem)",
        exemplo: "bemvindofoto",
        detalhes: "A imagem é enviada via upload e salva."
    },
    "saidafoto": {
        desc: "Altera a imagem enviada na mensagem de saída (responda uma foto).",
        uso: "saidafoto (respondendo imagem)",
        exemplo: "saidafoto",
        detalhes: "Funciona apenas quando saida ativo e bemvindoimg ativo."
    },
    "configbv": {
        desc: "Exibe as configurações atuais de boas‑vindas e saída.",
        uso: "configbv",
        exemplo: "configbv",
        detalhes: "Mostra status, imagem e mensagem personalizada."
    },
    "dados": {
        desc: "Mostra as configurações atuais do grupo.",
        uso: "dados",
        exemplo: "dados",
        detalhes: "Mostra todas as proteções ativas/desativas no grupo (antilink, antivideo, etc)."
    },

    // === COMANDOS DE ADMINISTRAÇÃO ============
    "promover": {
        desc: "Promove um membro a administrador.",
        uso: "promover @membro",
        exemplo: "promover @551199999999",
        detalhes: "Apenas administradores podem usar este comando."
    },
    "rebaixar": {
        desc: "Rebaixa um administrador a membro comum.",
        uso: "rebaixar @admin",
        exemplo: "rebaixar @551199999999",
        detalhes: "Apenas administradores podem usar este comando."
    },
    "ban": {
        desc: "Remove um membro do grupo.",
        uso: "ban @membro",
        exemplo: "ban @551199999999",
        detalhes: "Apenas administradores podem usar. O bot precisa ser admin."
    },
    "b": {
        desc: "Atalho para o comando ban.",
        uso: "b @membro",
        exemplo: "b @fulano",
        detalhes: "Mesmo funcionamento que ban."
    },
    "limpar": {
        desc: "Limpa o chat enviando mensagens vazias.",
        uso: "limpar",
        exemplo: "limpar",
        detalhes: "Apenas administradores podem usar."
    },
    "grupo": {
        desc: "Fecha ou abre o grupo.",
        uso: "grupo a/f",
        exemplo: "grupo f (fechar) / grupo a (abrir)",
        detalhes: "'f' fecha o grupo (só ADMs falam), 'a' abre para todos."
    },
    "linkgp": {
        desc: "Envia o link de convite do grupo.",
        uso: "linkgp",
        exemplo: "linkgp",
        detalhes: "Apenas administradores podem usar. O bot precisa ser admin."
    },
    "regras": {
        desc: "Mostra as informações e regras do grupo.",
        uso: "regras",
        exemplo: "regras",
        detalhes: "Mostra nome, criador, total de membros, admins, descrição e link do grupo."
    },
    "nomegp": {
        desc: "Altera o nome do grupo.",
        uso: "nomegp [novo nome]",
        exemplo: "nomegp Meu Novo Grupo",
        detalhes: "Apenas administradores podem usar. O bot precisa ser admin."
    },
    "citar": {
        desc: "Cita uma mensagem mencionando todos do grupo.",
        uso: "citar (responda uma mensagem)",
        exemplo: "citar",
        detalhes: "Apenas administradores podem usar. Marca todos do grupo."
    },
    "marcar": {
        desc: "Marca todos os membros do grupo.",
        uso: "marcar [mensagem]",
        exemplo: "marcar Atenção pessoal!",
        detalhes: "Apenas administradores podem usar. Marca todos do grupo."
    },
    "sorteio": {
        desc: "Sorteia um membro aleatório do grupo.",
        uso: "sorteio [prêmio]",
        exemplo: "sorteio 10 reais",
        detalhes: "Apenas administradores podem usar."
    },
    "deleta": {
        desc: "Apaga uma mensagem do grupo.",
        uso: "deleta (responda a mensagem)",
        exemplo: "deleta",
        detalhes: "Apenas administradores podem usar. O bot precisa ser admin."
    },
    "d": {
        desc: "Apelido para o comando deleta.",
        uso: "d (respondendo a mensagem)",
        exemplo: "d",
        detalhes: "Mesma funcionalidade de deleta."
    },
    "adms": {
        desc: "Lista todos os administradores do grupo.",
        uso: "adms",
        exemplo: "adms",
        detalhes: "Mostra todos os administradores do grupo com menção."
    },
    "admins": {
        desc: "Lista todos os administradores do grupo.",
        uso: "admins",
        exemplo: "admins",
        detalhes: "Sinônimo do comando 'adms'."
    },
    "listanegra": {
        desc: "Mostra a lista negra do grupo.",
        uso: "listanegra",
        exemplo: "listanegra",
        detalhes: "Exibe todos os usuários banidos da lista negra."
    },
    "tirardalista": {
        desc: "Remove um número da lista negra do grupo.",
        uso: "tirardalista [número]",
        exemplo: "tirardalista 551199999999",
        detalhes: "Apenas administradores podem usar."
    },

    // === RANKING E ATIVIDADE ====================
    "rankativo": {
        desc: "Mostra os 10 membros mais ativos do grupo.",
        uso: "rankativo",
        exemplo: "rankativo",
        detalhes: "Baseado no número de mensagens enviadas."
    },
    "rankinativo": {
        desc: "Mostra os 10 membros menos ativos do grupo.",
        uso: "rankinativo",
        exemplo: "rankinativo",
        detalhes: "Baseado no número de mensagens enviadas."
    },
    "checkativo": {
        desc: "Mostra estatísticas de um membro específico.",
        uso: "checkativo @membro",
        exemplo: "checkativo @551199999999",
        detalhes: "Mostra total de mensagens do usuário."
    },
    "zerarank": {
        desc: "Zera o ranking de atividade do grupo.",
        uso: "zerarank",
        exemplo: "zerarank",
        detalhes: "Apenas o dono do bot pode usar."
    },
    "eu": {
        desc: "Mostra seu perfil e estatísticas no grupo.",
        uso: "eu",
        exemplo: "eu",
        detalhes: "Mostra nome, número, mensagens, comandos, figurinhas e cargo."
    },
    "me": {
        desc: "Mostra suas informações básicas.",
        uso: "me",
        exemplo: "me",
        detalhes: "Mostra nome, número, se é dono, admin, grupo e hora."
    },

    // ==== COMANDOS DE DIVERSÃO ================
    "ship": {
        desc: "Calcula a compatibilidade entre duas pessoas.",
        uso: "ship @pessoa1 @pessoa2",
        exemplo: "ship @551199999999 @552299999999",
        detalhes: "Mostra porcentagem de compatibilidade aleatória."
    },
    "dado": {
        desc: "Joga um dado de 6 faces.",
        uso: "dado",
        exemplo: "dado",
        detalhes: "Retorna um número aleatório entre 1 e 6."
    },
    "meme": {
        desc: "Envia um meme aleatório.",
        uso: "meme",
        exemplo: "meme",
        detalhes: "Mostra um meme diferente a cada comando."
    },
    "gay": {
        desc: "Mede o nível gay de uma pessoa.",
        uso: "gay @membro",
        exemplo: "gay @551199999999",
        detalhes: "Retorna uma porcentagem aleatória."
    },
    "corno": {
        desc: "Mede o nível de corno de uma pessoa.",
        uso: "corno @membro",
        exemplo: "corno @551199999999",
        detalhes: "Retorna uma porcentagem aleatória com imagem."
    },
    "gostoso": {
        desc: "Mede o nível de gostosura de uma pessoa (versão masculina).",
        uso: "gostoso @membro",
        exemplo: "gostoso @551199999999",
        detalhes: "Retorna uma porcentagem aleatória com imagem."
    },
    "gostosa": {
        desc: "Mede o nível de gostosura de uma pessoa (versão feminina).",
        uso: "gostosa @membro",
        exemplo: "gostosa @551199999999",
        detalhes: "Retorna uma porcentagem aleatória com imagem."
    },
    "qi": {
        desc: "Mede o QI de uma pessoa.",
        uso: "qi @membro",
        exemplo: "qi @551199999999",
        detalhes: "Retorna um número aleatório entre 0 e 200."
    },
    "ppt": {
        desc: "Joga pedra, papel ou tesoura contra o bot.",
        uso: "ppt pedra/papel/tesoura",
        exemplo: "ppt pedra",
        detalhes: "O bot escolhe uma opção e mostra o resultado."
    },
    "tapa": {
        desc: "Dá um tapa em alguém.",
        uso: "tapa @membro",
        exemplo: "tapa @551199999999",
        detalhes: "Se não marcar ninguém, escolhe alguém aleatório."
    },
    "beijo": {
        desc: "Dá um beijo em alguém.",
        uso: "beijo @membro",
        exemplo: "beijo @551199999999",
        detalhes: "Se não marcar ninguém, escolhe alguém aleatório."
    },
    "eununca": {
        desc: "Cria uma enquete 'Eu nunca'.",
        uso: "eununca",
        exemplo: "eununca",
        detalhes: "Gera uma pergunta aleatória de Eu Nunca."
    },
    "top5": {
        desc: "Mostra o top 5 mais zueiros do grupo.",
        uso: "top5",
        exemplo: "top5",
        detalhes: "Escolhe 5 membros aleatórios."
    },
    "casal": {
        desc: "Sorteia um casal aleatório no grupo.",
        uso: "casal",
        exemplo: "casal",
        detalhes: "Escolhe 2 pessoas aleatórias e calcula compatibilidade."
    },
    "separar": {
        desc: "Termina um relacionamento fictício.",
        uso: "separar @pessoa1 @pessoa2",
        exemplo: "separar @551199999999 @552299999999",
        detalhes: "Cria uma história engraçada de término entre duas pessoas."
    },
    "bebado": {
        desc: "Escolhe um bêbado aleatório no grupo.",
        uso: "bebado",
        exemplo: "bebado",
        detalhes: "Escolhe um membro aleatório e mostra uma frase sobre bebedeira."
    },
    "morte": {
        desc: "Escolhe uma morte aleatória para alguém.",
        uso: "morte @membro",
        exemplo: "morte @551199999999",
        detalhes: "Mostra uma forma engraçada de morte."
    },
    "hetero": {
        desc: "Mede o nível hétero de uma pessoa.",
        uso: "hetero @membro",
        exemplo: "hetero @551199999999",
        detalhes: "Retorna uma porcentagem aleatória."
    },
    "rico": {
        desc: "Mede o nível de riqueza de uma pessoa.",
        uso: "rico @membro",
        exemplo: "rico @551199999999",
        detalhes: "Retorna uma porcentagem aleatória."
    },
    "pobre": {
        desc: "Mede o nível de pobreza de uma pessoa.",
        uso: "pobre @membro",
        exemplo: "pobre @551199999999",
        detalhes: "Retorna uma porcentagem aleatória."
    },

    // === RANKINGS DE BRINCADEIRA ==============
    "rankbebados": {
        desc: "Mostra o ranking dos mais bêbados do grupo.",
        uso: "rankbebados",
        exemplo: "rankbebados",
        detalhes: "Escolhe 5 membros aleatórios como os mais bêbados."
    },
    "rankgostoso": {
        desc: "Mostra o ranking dos mais gostosos do grupo.",
        uso: "rankgostoso",
        exemplo: "rankgostoso",
        detalhes: "Escolhe 5 membros aleatórios como os mais gostosos."
    },
    "rankgostosa": {
        desc: "Mostra o ranking das mais gostosas do grupo.",
        uso: "rankgostosa",
        exemplo: "rankgostosa",
        detalhes: "Escolhe 5 membros aleatórios como as mais gostosas."
    },
    "rankgay": {
        desc: "Mostra o ranking do estilo no grupo.",
        uso: "rankgay",
        exemplo: "rankgay",
        detalhes: "Escolhe 5 membros aleatórios com mais estilo."
    },
    "rankfeio": {
        desc: "Mostra o ranking dos mais feios do grupo.",
        uso: "rankfeio",
        exemplo: "rankfeio",
        detalhes: "Escolhe 5 membros aleatórios como os mais feios."
    },
    "ranktoxicos": {
        desc: "Mostra o ranking dos mais tóxicos do grupo.",
        uso: "ranktoxicos",
        exemplo: "ranktoxicos",
        detalhes: "Escolhe 5 membros aleatórios como os mais tóxicos."
    },
    "rankcasais": {
        desc: "Mostra os casais aleatórios do grupo.",
        uso: "rankcasais",
        exemplo: "rankcasais",
        detalhes: "Forma 5 casais aleatórios com os membros do grupo."
    },
    "rankfantasma": {
        desc: "Mostra o ranking dos membros mais sumidos.",
        uso: "rankfantasma",
        exemplo: "rankfantasma",
        detalhes: "Escolhe 5 membros aleatórios que mais somem do grupo."
    },

    // === COMANDOS DE UTILIDADE =================
    "sticker": {
        desc: "Converte imagem/vídeo em figurinha.",
        uso: "sticker (responda uma imagem/vídeo)",
        exemplo: "sticker",
        detalhes: "Vídeos com até 6 segundos viram figurinha animada."
    },
    "s": {
        desc: "Atalho para o comando sticker.",
        uso: "s (responda uma imagem/vídeo)",
        exemplo: "s",
        detalhes: "Mesmo funcionamento que sticker."
    },
    "ping": {
        desc: "Mostra velocidade e status do bot.",
        uso: "ping",
        exemplo: "ping",
        detalhes: "Mostra ping, uptime, quantidade de grupos."
    },
    "encurtar": {
        desc: "Encurta uma URL usando TinyURL.",
        uso: "encurtar [url]",
        exemplo: "encurtar https://exemplo.com",
        detalhes: "Gera um link curto para compartilhar."
    },
    "calcular": {
        desc: "Calcula expressões matemáticas.",
        uso: "calcular [expressão]",
        exemplo: "calcular 2+2",
        detalhes: "Pode usar +, -, *, /, (, )."
    },
    "calc": {
        desc: "Apelido para o comando calcular.",
        uso: "calc [expressão]",
        exemplo: "calc 10/3",
        detalhes: "Mesmo funcionamento."
    },
    "conselho": {
        desc: "Mostra um conselho aleatório.",
        uso: "conselho",
        exemplo: "conselho",
        detalhes: "Conselhos variados sobre a vida."
    },
    "conselhoamor": {
        desc: "Mostra um conselho aleatório sobre amor.",
        uso: "conselhoamor",
        exemplo: "conselhoamor",
        detalhes: "Conselhos românticos e emocionantes sobre relacionamentos."
    },
    "conselhovida": {
        desc: "Mostra um conselho aleatório sobre a vida.",
        uso: "conselhovida",
        exemplo: "conselhovida",
        detalhes: "Conselhos inspiradores e reflexivos sobre o dia a dia."
    },
    "signo": {
        desc: "Mostra informações sobre um signo.",
        uso: "signo [signo ou data]",
        exemplo: "signo leão ou signo 15/08",
        detalhes: "Mostra período, elemento, planeta, cor, amor e trabalho."
    },
    "foto": {
        desc: "Envia uma foto aleatória.",
        uso: "foto",
        exemplo: "foto",
        detalhes: "Gera uma imagem aleatória da internet."
    },
    "pergunta": {
        desc: "Responde uma pergunta com sim/não.",
        uso: "pergunta [sua pergunta]",
        exemplo: "pergunta Hoje vai chover?",
        detalhes: "Respostas aleatórias: Sim, Não, Talvez, etc."
    },
    "perfil": {
        desc: "Exibe o perfil engraçado de um membro (com classificação e piada).",
        uso: "perfil [@membro]",
        exemplo: "perfil @fulano",
        detalhes: "Mostra mensagens, comandos, figurinhas e uma classificação cômica."
    },
    "prefix": {
        desc: "Mostra o prefixo atual do bot (resposta automática).",
        uso: "prefix",
        exemplo: "prefix",
        detalhes: "Quando alguém digitar 'prefix' sozinho, o bot responde."
    },

    // === COMANDOS DE MÚSICA E DOWNLOAD ========
    "play": {
        desc: "Baixa e envia uma música do YouTube (máx 30 min).",
        uso: "play [nome da música]",
        exemplo: "play Imagine Dragons Believer",
        detalhes: "Procura no YouTube e envia em áudio."
    },
    "p": {
        desc: "Atalho para o comando play.",
        uso: "p [nome da música]",
        exemplo: "p Believer",
        detalhes: "Mesmo funcionamento que play."
    },
    "playvideo": {
        desc: "Baixa e envia um vídeo do YouTube (máx 30 min).",
        uso: "playvideo [nome do vídeo]",
        exemplo: "playvideo clipe oficial",
        detalhes: "Envia o vídeo em MP4."
    },
    "pv": {
        desc: "Atalho para o comando playvideo.",
        uso: "pv [nome do vídeo]",
        exemplo: "pv clipe",
        detalhes: "Mesmo funcionamento que playvideo."
    },
    "facebookaudio": {
        desc: "Baixa o áudio de um vídeo do Facebook.",
        uso: "facebookaudio [link do Facebook]",
        exemplo: "facebookaudio https://fb.com/...",
        detalhes: "Extrai e envia o áudio."
    },
    "facebookvideo": {
        desc: "Baixa o vídeo de um link do Facebook.",
        uso: "facebookvideo [link do Facebook]",
        exemplo: "facebookvideo https://fb.com/...",
        detalhes: "Envia o vídeo em MP4."
    },
    "kwai": {
        desc: "Baixa um vídeo do Kwai.",
        uso: "kwai [link do Kwai]",
        exemplo: "kwai https://k.kwai.com/...",
        detalhes: "Envia o vídeo sem marca d'água."
    },
    "pinterest": {
        desc: "Busca imagens aleatórias no Pinterest.",
        uso: "pinterest [tema]",
        exemplo: "pinterest gatos fofos",
        detalhes: "Retorna uma imagem aleatória sobre o tema."
    },
    "tiktokvideo": {
        desc: "Baixa um vídeo do TikTok (sem marca d'água).",
        uso: "tiktokvideo [link do TikTok]",
        exemplo: "tiktokvideo https://tiktok.com/...",
        detalhes: "Envia o vídeo em MP4."
    },
    "tiktokaudio": {
        desc: "Baixa o áudio de um vídeo do TikTok.",
        uso: "tiktokaudio [link do TikTok]",
        exemplo: "tiktokaudio https://tiktok.com/...",
        detalhes: "Extrai e envia o áudio."
    },
    "tiktok": {
        desc: "Apelido que detecta automaticamente entre vídeo ou áudio (conforme o link).",
        uso: "tiktok [link]",
        exemplo: "tiktok https://tiktok.com/...",
        detalhes: "Comportamento idêntico ao tiktokvideo."
    },
    "instagram": {
        desc: "Baixa vídeo ou carrossel do Instagram.",
        uso: "instagram [link do Instagram]",
        exemplo: "instagram https://instagram.com/...",
        detalhes: "Suporta posts, reels e carrossel."
    },
    "instaaudio": {
        desc: "Baixa o áudio de um vídeo do Instagram.",
        uso: "instaaudio [link]",
        exemplo: "instaaudio https://instagram.com/...",
        detalhes: "Extrai e envia o áudio."
    },
    "futebol": {
        desc: "Mostra os próximos jogos de um time de futebol.",
        uso: "futebol [nome do time]",
        exemplo: "futebol Flamengo",
        detalhes: "Lista até 8 próximas partidas."
    },
    "jogo": {
        desc: "Apelido para o comando futebol.",
        uso: "jogo [time]",
        exemplo: "jogo Corinthians",
        detalhes: "Mesmo funcionamento."
    },
    "clima": {
        desc: "Mostra a previsão do tempo para uma cidade.",
        uso: "clima [cidade]",
        exemplo: "clima São Paulo",
        detalhes: "Exibe temperatura, umidade, vento e máxima/mínima."
    },
    "gpt": {
        desc: "Pergunta algo ao ChatGPT (modelo GPT-3.5).",
        uso: "gpt [pergunta]",
        exemplo: "gpt Qual a capital do Brasil?",
        detalhes: "Requer chave da OpenAI configurada no lara.json."
    },
    "imagine": {
        desc: "Gera uma imagem com IA a partir de um texto (DALL-E).",
        uso: "imagine [descrição]",
        exemplo: "imagine um gato astronauta",
        detalhes: "Requer chave da OpenAI. Gera imagem 512x512."
    },
    "traduzir": {
        desc: "Traduz texto para qualquer idioma usando Google Translate.",
        uso: "traduzir [idioma] [texto]",
        exemplo: "traduzir en Olá mundo",
        detalhes: "Idiomas: pt, en, es, fr, de, it, ja, ru, zh, etc."
    },
    "emojimix": {
        desc: "Mistura dois emojis gerando uma figurinha única.",
        uso: "emojimix [emoji1+emoji2]",
        exemplo: "emojimix 😂+💀",
        detalhes: "Gera uma figurinha combinando os dois emojis."
    },
    "removerfundo": {
        desc: "Remove o fundo de uma imagem e envia como figurinha.",
        uso: "removerfundo (responda uma imagem)",
        exemplo: "removerfundo",
        detalhes: "Utiliza API de remoção de fundo e converte para sticker."
    },
    "renomear": {
        desc: "Renomeia uma figurinha ou texto para figurinha com nome personalizado.",
        uso: "renomear [texto] (responda uma figurinha ou texto)",
        exemplo: "renomear Lara (respondendo sticker)",
        detalhes: "Função importada do módulo sticker.js."
    },
    "toimg": {
        desc: "Converte uma figurinha (sticker) em imagem (JPG).",
        uso: "toimg (responda uma figurinha)",
        exemplo: "toimg",
        detalhes: "Envia a figurinha convertida para imagem."
    },
    "attp": {
        desc: "Converte texto em figurinha animada (estilo escrevendo).",
        uso: "attp [texto]",
        exemplo: "attp Olá mundo",
        detalhes: "Versão básica. Use attp2 a attp10 para variações."
    },
    "togif": {
        desc: "Converte uma figurinha animada (.webp animado) em GIF.",
        uso: "togif (responda uma figurinha animada)",
        exemplo: "togif",
        detalhes: "Transforma sticker animado em vídeo no formato GIF."
    },

    // === LOGOS DE TEXTO (GRUPO 1) ======
    "fluffy": {
        desc: "Cria logo com texto no estilo fofo.",
        uso: "fluffy [texto]",
        exemplo: "fluffy Lara",
        detalhes: "Gera imagem com texto e fundo decorativo."
    },
    "lava": {
        desc: "Cria logo com efeito de lava.",
        uso: "lava [texto]",
        exemplo: "lava Bot",
        detalhes: "Efeito incandescente."
    },
    "cool": {
        desc: "Cria logo com estilo descolado e moderno.",
        uso: "cool [texto]",
        exemplo: "cool Legal",
        detalhes: "Letras em negrito com sombra."
    },
    "comic": {
        desc: "Cria logo no estilo de histórias em quadrinhos.",
        uso: "comic [texto]",
        exemplo: "comic Bom dia",
        detalhes: "Efeito balão de HQ."
    },
    "fire": {
        desc: "Cria logo com letras em chamas.",
        uso: "fire [texto]",
        exemplo: "fire Fogo",
        detalhes: "Texto pegando fogo."
    },
    "water": {
        desc: "Cria logo com efeito de água/líquido.",
        uso: "water [texto]",
        exemplo: "water Água",
        detalhes: "Letras com aspecto aquático."
    },
    "ice": {
        desc: "Cria logo com efeito de gelo.",
        uso: "ice [texto]",
        exemplo: "ice Gelo",
        detalhes: "Letras congeladas."
    },
    "elegant": {
        desc: "Cria logo elegante, com fonte cursiva e fundo suave.",
        uso: "elegant [texto]",
        exemplo: "elegant Clássico",
        detalhes: "Estilo sofisticado."
    },
    "gold": {
        desc: "Cria logo com letras douradas e brilho.",
        uso: "gold [texto]",
        exemplo: "gold Ouro",
        detalhes: "Efeito metálico dourado."
    },
    "fortune": {
        desc: "Cria logo com tema de sorte/fortune.",
        uso: "fortune [texto]",
        exemplo: "fortune Sorte",
        detalhes: "Letras com trevos e moedas."
    },
    "blue": {
        desc: "Cria logo em tons de azul.",
        uso: "blue [texto]",
        exemplo: "blue Mar",
        detalhes: "Degradê azul."
    },
    "silver": {
        desc: "Cria logo prateada.",
        uso: "silver [texto]",
        exemplo: "silver Prata",
        detalhes: "Efeito metálico prateado."
    },
    "neon": {
        desc: "Cria logo com efeito neon vibrante.",
        uso: "neon [texto]",
        exemplo: "neon Noite",
        detalhes: "Letras brilhantes estilo luz de néon."
    },
    "retro": {
        desc: "Cria logo com estilo retrô dos anos 80.",
        uso: "retro [texto]",
        exemplo: "retro Vintage",
        detalhes: "Cores e fontes antigas."
    },
    "candy": {
        desc: "Cria logo doce, estilo bala ou pirulito.",
        uso: "candy [texto]",
        exemplo: "candy Doce",
        detalhes: "Letras coloridas listradas."
    },
    "glossy": {
        desc: "Cria logo com efeito brilhante (gloss).",
        uso: "glossy [texto]",
        exemplo: "glossy Brilho",
        detalhes: "Superfície refletiva."
    },
    "graffiti": {
        desc: "Cria logo com estilo de graffiti (pichação).",
        uso: "graffiti [texto]",
        exemplo: "graffiti Street",
        detalhes: "Letras estilizadas de rua."
    },
    "steel": {
        desc: "Cria logo com efeito de aço escovado.",
        uso: "steel [texto]",
        exemplo: "steel Metal",
        detalhes: "Aparência industrial."
    },
    "glow": {
        desc: "Cria logo com brilho ao redor das letras.",
        uso: "glow [texto]",
        exemplo: "glow Luz",
        detalhes: "Efeito de iluminação externa."
    },
    "matrix": {
        desc: "Cria logo estilo Matrix (letras verdes caindo).",
        uso: "matrix [texto]",
        exemplo: "matrix Código",
        detalhes: "Fundo preto com letras verdes."
    },
    "chrome": {
        desc: "Cria logo com efeito cromado (reflexivo).",
        uso: "chrome [texto]",
        exemplo: "chrome Carro",
        detalhes: "Superfície espelhada."
    },
    "magic": {
        desc: "Cria logo mágica com estrelas e brilho.",
        uso: "magic [texto]",
        exemplo: "magic Fantasia",
        detalhes: "Efeito de varinha mágica."
    },
    "space": {
        desc: "Cria logo com tema espacial (estrelas, galáxia).",
        uso: "space [texto]",
        exemplo: "space Universo",
        detalhes: "Fundo cósmico."
    },
    "logo3d": {
        desc: "Cria logo com efeito 3D profundo.",
        uso: "logo3d [texto]",
        exemplo: "logo3d Dimensão",
        detalhes: "Letras com sombra e profundidade."
    },
    "monster": {
        desc: "Cria logo estilo monstro (letras assustadoras).",
        uso: "monster [texto]",
        exemplo: "monster Terror",
        detalhes: "Letras com dentes e olhos."
    },

    // === LOGOS COM DOIS TEXTOS ===
    "captain": {
        desc: "Cria logo estilizada com dois textos (tipo capitão).",
        uso: "captain [texto1/texto2]",
        exemplo: "captain Lara/Bot",
        detalhes: "Use barra (/) para separar os dois textos."
    },
    "graffitiwall": {
        desc: "Cria logo estilo muro de pichação com dois textos.",
        uso: "graffitiwall [texto1/texto2]",
        exemplo: "graffitiwall Arte/Rua",
        detalhes: "Texto principal e texto secundário."
    },
    "phlogo": {
        desc: "Cria logo com efeito de logo profissional.",
        uso: "phlogo [texto1/texto2]",
        exemplo: "phlogo Tech/Studio",
        detalhes: "Fundo abstrato e letras modernas."
    },
    "blackpink": {
        desc: "Cria logo no estilo Blackpink (k-pop).",
        uso: "blackpink [texto1/texto2]",
        exemplo: "blackpink Lisa/Jennie",
        detalhes: "Cores rosa e preto."
    },
    "deadpool": {
        desc: "Cria logo com tema Deadpool (herói).",
        uso: "deadpool [texto1/texto2]",
        exemplo: "deadpool Wade/Wilson",
        detalhes: "Máscara e espadas no fundo."
    },
    "glitter": {
        desc: "Cria logo com efeito de glitter/brilho.",
        uso: "glitter [texto1/texto2]",
        exemplo: "glitter Brilha/Muito",
        detalhes: "Letras cintilantes."
    },
    "vintage3d": {
        desc: "Cria logo 3D com estilo vintage.",
        uso: "vintage3d [texto1/texto2]",
        exemplo: "vintage3d Retrô/3D",
        detalhes: "Letras antigas com profundidade."
    },

    // === COMANDOS DE INFORMAÇÃO ===
    "comando": {
        desc: "Mostra informações detalhadas sobre um comando específico.",
        uso: "comando [nome do comando]",
        exemplo: "comando antilink",
        detalhes: "Exibe descrição, como usar, exemplo e detalhes do comando."
    },
    "info": {
        desc: "Apelido para o comando 'comando'.",
        uso: "info [comando]",
        exemplo: "info antilink",
        detalhes: "Mesmo funcionamento."
    },
    "clear": {
desc: "Limpa mensagens, arquivos temporários ou dados gerados pelo bot.",
uso: "clear",
exemplo: "clear",
detalhes: "Remove registros temporários e realiza uma limpeza interna do sistema."
},

"imagine": {
desc: "Gera uma imagem utilizando inteligência artificial a partir de uma descrição.",
uso: "imagine texto",
exemplo: "imagine um dragão azul voando sobre montanhas",
detalhes: "Cria uma imagem baseada na descrição enviada pelo usuário."
},

"traduzir": {
desc: "Traduz textos para outro idioma.",
uso: "traduzir texto",
exemplo: "traduzir Olá, como você está?",
detalhes: "Detecta o idioma do texto e retorna a tradução configurada pelo sistema."
},

"receita": {
desc: "Busca receitas culinárias de diversos tipos.",
uso: "receita nome",
exemplo: "receita bolo de chocolate",
detalhes: "Exibe ingredientes e modo de preparo da receita solicitada."
},

"tabela": {
desc: "Consulta tabelas e informações organizadas pelo sistema.",
uso: "tabela consulta",
exemplo: "tabela fipe",
detalhes: "Retorna dados estruturados em formato de tabela para facilitar a visualização."
},

"renomear": {
desc: "Renomeia arquivos enviados ou itens suportados pelo bot.",
uso: "renomear novo_nome",
exemplo: "renomear documento_final",
detalhes: "Altera o nome do arquivo mantendo sua extensão original."
},

"tdsgp": {
desc: "Marca todos os participantes do grupo em uma única mensagem.",
uso: "tdsgp mensagem",
exemplo: "tdsgp Reunião hoje às 20h",
detalhes: "Menciona todos os membros do grupo junto com a mensagem informada."
},
    "img": {
        desc: "Ativa o sistema de imagens nas mensagens de entrada e saída.",
        uso: "img",
        exemplo: "img",
        detalhes: "Ativa imagens personalizadas para boas-vindas e saída."
    }
};