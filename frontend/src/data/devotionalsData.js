// =============================================================================
// CATÁLOGO E AGENDAMENTO DE DEVOCIONAIS EM ÁUDIO
// -----------------------------------------------------------------------------
// O sistema internamente verifica a data/hora atual (now) e libera automaticamente
// o devocional no horário programado em `releaseAt` (sempre às 05:00 da manhã).
// =============================================================================

export const DEVOTIONALS = [
  {
    id: 'dia-01-sede-que-nada-sacia',
    title: 'A SEDE QUE NADA SACIA',
    tag: '💧 DIA 01 DE 07 | A Sede Que Nada Sacia',
    dateFormatted: 'Dia 01 de 07 • A Sede Que Nada Sacia',
    verse: '“Aquele que beber desta água tornará a ter sede; mas aquele que beber da água que eu lhe der nunca mais terá sede. Pelo contrário, a água que eu lhe der se tornará nele uma fonte de água a jorrar para a vida eterna.”',
    verseRef: 'João 4:13-14',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-01.mp3',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 21/09 ÀS 05:00 DA MANHÃ (Fuso de Brasília)
    releaseAt: '2026-09-21T05:00:00-03:00',
    reflection: 'Seja bem-vindo ao primeiro dia da nossa nova jornada de 7 dias: “A Sede Que Nada Sacia”.\n\nExiste um momento que quase todo mundo conhece, mas quase ninguém comenta: o dia seguinte à conquista. Você passou na seleção, fechou o grande negócio, comprou o que tanto queria, alcançou o relacionamento que esperava... Por algumas horas ou alguns dias, tudo parece perfeitamente encaixado. Até que, no silêncio do coração, surge aquela pergunta bem baixinho: “É só isso?”.\n\nIsso não é ingratidão e nem falta de foco. Isso se chama sede. A sede é uma das formas mais honestas que o nosso corpo tem de dizer a verdade. Ninguém precisa convencer você de que você está com sede — você simplesmente sente. O que a gente costuma errar não é a existência da sede, mas aquilo que bebemos para tentar resolvê-la.\n\nNo Evangelho de João, perto do meio-dia, Jesus cansado da viagem senta-se junto a um poço em Samaria. Uma mulher samaritana aproxima-se para tirar água. O detalhe que não podemos deixar passar é o horário: naquela cultura, as mulheres iam ao poço no início da manhã ou no fim da tarde, sempre em grupo, conversando. Ir ao meio-dia, debaixo do sol mais escaldante, era a maneira que ela encontrou de fugir dos olhares e do julgamento das pessoas. Ela não tinha sede apenas de água física; ela estava exausta de ser apontada.\n\nE Jesus faz algo surpreendente: sendo homem e judeu, dirige a palavra a uma mulher samaritana em público e pede: “Dá-me de beber”. Jesus quebra todas as barreiras religiosas e sociais numa única frase. Antes de oferecer qualquer coisa, Deus começa a conversa pedindo, colocando-se como quem precisa, e não cobrando.\n\nQuando ela reage defensivamente, Jesus revela o cerne da questão: “Quem bebe desta água voltará a ter sede, mas quem beber da água que Eu der nunca mais terá sede”. O poço em si não era mau; a água do poço supria momentaneamente a sede do corpo, mas amanhã ela teria que voltar com o mesmo balde na mão. O erro é exigir do poço aquilo que ele nunca prometeu ser.\n\nTodos nós temos os nossos poços: o trabalho, o dinheiro, o reconhecimento, a vaidade, a aprovação dos outros, os relacionamentos ou as distrações com que tentamos anestesiar a alma no fim do dia. Coisas boas, mas que jamais suportarão o peso de ter que nos completar. Quando pedimos a coisas passageiras que façam o trabalho que só pertence a Deus, vivemos voltando cansados, de balde em balde.\n\nJesus não condenou aquela mulher ao expor sua história; Ele tocou no ponto exato da sede porque somente onde a dor é exposta a graça pode curar. Como diz Eclesiastes 3:11, Deus colocou a eternidade no coração humano. Aquele vazio que você sente depois de conquistar coisas terrenas não indica que há algo quebrado em você — indica que você foi criado para algo infinitamente maior do que qualquer coisa que este mundo consiga te oferecer.',
    challenge: '📖 Missão de Leitura de Hoje:\n1. Leia João 4:1-30 com calma, observando o carinho e a verdade de Jesus ao lidar com a mulher samaritana.\n2. Leia Eclesiastes 3:11 e reflita sobre a eternidade que Deus plantou no seu coração.\n\nPergunte a si mesmo com total sinceridade:\n“Qual é o meu poço hoje? O que tenho buscado todos os dias na ilusão de que, dessa vez, será suficiente?”\n\nFaça esta oração comigo hoje:\n“Deus, Pai Todo-Poderoso, se Tu és como esse Jesus do poço, eu quero Te conhecer de verdade. Eu tenho sede de coisas que nem mesmo sei nomear. Revela-me o que tenho buscado no lugar da Tua presença. Não quero fugir dessa conversa. Sacie a minha alma com a Tua Água Viva. Em nome de Jesus, amém.”',
    callToAction: 'Compartilhe este devocional com alguém hoje! Todos nós conhecemos alguém que está cansado de carregar baldes pesados e precisa conhecer a Água da Vida que nunca acaba!',
  },
  {
    id: 'dia-49-cheios-enviados',
    title: 'CHEIOS PARA SER ENVIADOS',
    tag: '🔥 DIA 49 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 49 de 50 • Rumo ao Pentecostes',
    verse: '“Mas recebereis poder, ao descer sobre vós o Espírito Santo, e ser-me-eis testemunhas tanto em Jerusalém como em toda a Judeia e Samaria e até aos confins da terra.”',
    verseRef: 'Atos 1:8',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-49.m4a',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 18/09 ÀS 05:00 DA MANHÃ (Fuso de Brasília)
    releaseAt: '2026-09-18T05:00:00-03:00',
    reflection: 'Chegamos ao penúltimo dia da nossa jornada rumo ao Pentecostes — 49 dias caminhando, refletindo e buscando uma intimidade mais profunda com Deus. E hoje o Senhor nos confronta com uma pergunta essencial: por que queremos ser cheios do Espírito Santo? É apenas para sentir arrepios, viver momentos emocionantes ou buscar consolo pessoal? Ou existe uma missão eterna por trás de tudo isso?\n\nJesus disse aos discípulos em Atos 1:8: “Recebereis poder e sereis minhas testemunhas”. O poder de Deus tem um propósito; a presença tem uma direção; o enchimento do Espírito aponta para o envio. Deus não nos enche como um recipiente fechado para acumular bênçãos, mas para transbordar na vida de outros. Ele consola você para que saiba consolar; restaura sua vida para que sua história encoraje quem perdeu a esperança; e ensina você para que seja instrumento de salvação.\n\nSer testemunha não exige ter resposta para todos os debates teológicos ou ocupar um púlpito: ser testemunha é simplesmente dizer com verdade o que Deus fez em sua vida. E a missão começa onde você já está — na sua casa, na sua família, no seu trabalho e nas conversas do dia a dia. Antes da missão vem a capacitação; antes do envio vem o revestimento do Espírito Santo.',
    challenge: 'Faça hoje uma lista com 3 pessoas que Deus colocou perto de você (na família, no trabalho ou na vizinhança). Ore por cada uma delas e pergunte: “Senhor, como posso ser uma testemunha do Teu amor para elas?”. Se surgir uma oportunidade, compartilhe algo simples sobre o que Jesus fez na sua vida. Não espere ser perfeito: seja apenas disponível.\n\n🔥 Propósito da Jornada: “Espírito Santo, prepara o meu coração, enche a minha vida da Tua presença e capacita-me com poder para ser Tua testemunha onde eu estiver.”',
    callToAction: 'Compartilhe este devocional com alguém hoje! Amanhã chegaremos ao DIA 50 DE 50, o grande encerramento da nossa jornada rumo ao Pentecostes! Prepare o seu coração para celebrar!',
  },
  {
    id: 'dia-48-coracao-livre',
    title: 'UM CORAÇÃO LIVRE PARA RECEBER',
    tag: '🔥 DIA 48 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 48 de 50 • Rumo ao Pentecostes',
    verse: '“Antes sede uns para com os outros benignos, misericordiosos, perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo.”',
    verseRef: 'Efésios 4:32',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-48.m4a',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 17/09 ÀS 05:00 DA MANHÃ (Fuso de Brasília)
    releaseAt: '2026-09-17T05:00:00-03:00',
    reflection: 'Faltam agora apenas dois dias para chegar ao final da nossa jornada rumo ao Pentecostes. E talvez nesses últimos dias Deus queira trabalhar em lugares que a gente não costuma mostrar para ninguém.\n\nExiste algo que pode ocupar o coração silenciosamente: a mágoa. Às vezes a gente continua orando, indo à igreja e ouvindo a Palavra, mas carrega dentro de si uma conversa que nunca conseguiu esquecer, uma injustiça que ainda dói, uma decepção que ficou aberta. Hoje, Deus nos convida a olhar para isso — não para nos condenar, mas para nos libertar desse sentimento.\n\nPerdoar não significa dizer que o que aconteceu foi certo, nem significa permitir novamente que alguém ultrapasse os seus limites. Perdoar significa colocar aquela dívida nas mãos de Deus e decidir não continuar sendo prisioneiro daquilo que fizeram contra você. Um coração cheio de Deus não precisa ser governado pela mágoa: como uma casa cheia de coisas acumuladas, antes de colocar algo novo, primeiro é preciso abrir espaço e remover aquilo que impede o seu coração de viver em liberdade.',
    challenge: 'Peça hoje ao Espírito Santo para trazer à sua memória qualquer pessoa ou situação que ainda ocupa espaço doloroso no seu coração. Não tente resolver sozinho: entregue nas mãos de Deus e faça esta oração:\n“Senhor, eu entrego essa pessoa e essa situação nas Tuas mãos. Não quero mais ser governado por essa dor. Cura o meu coração e me ensina a perdoar, como também fui perdoado por Cristo. Faça-se a Tua vontade.”\n\n🔥 Propósito da Jornada: “Espírito Santo, prepara o meu coração, remove tudo aquilo que não vem de Ti e enche a minha vida da Tua graça e da Tua presença.”',
    callToAction: 'Compartilhe esse devocional com alguém hoje! Não carregue amanhã aquilo que você pode entregar para Deus hoje. Deus continua no controle!',
  },
  {
    id: 'dia-47-guardar-fe',
    title: 'VOCÊ NÃO FOI CHAMADO PARA GUARDAR A SUA FÉ',
    tag: '🔥 DIA 47 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 47 de 50 • Rumo ao Pentecostes',
    verse: '“E disse-lhes: Ide por todo o mundo, pregai o evangelho a toda criatura.”',
    verseRef: 'Marcos 16:15',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-47.m4a',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 16/09 ÀS 05:00 DA MANHÃ (Fuso de Brasília)
    releaseAt: '2026-09-16T05:00:00-03:00',
    reflection: 'Você não recebeu o evangelho para guardá-lo apenas para si mesmo.\n\nNo Dia 47 da nossa jornada rumo ao Pentecostes — faltando apenas 3 dias —, Jesus nos faz um chamado que vai além de nós mesmos: “Ide por todo o mundo e pregai o evangelho a toda criatura” (Marcos 16:15). O mesmo Jesus que diz “venha”, também diz “vai”. A presença de Deus nos acolhe, nos cura e nos fortalece, mas também nos move em direção às pessoas.\n\nTestemunhar não é saber todas as respostas teológicas ou falar de cima de um púlpito; é falar com verdade e sinceridade sobre o que Jesus tem feito na sua vida. Suas atitudes diárias precisam confirmar aquilo que a sua boca anuncia: quando você ama, perdoa, escuta sem pressa e serve com misericórdia, o Evangelho se torna visível na vida real.',
    challenge: 'Escolha uma pessoa hoje e dê 3 passos práticos:\n1. Ore por ela e apresente o nome dela a Deus em secreto;\n2. Aproxime-se com atenção sincera (envie uma mensagem, pergunte como ela está e ouça sem pressa);\n3. Compartilhe uma palavra de esperança se houver abertura no coração dela.\n\n🔥 Propósito da Jornada: “Espírito Santo, enche o meu coração da Tua presença, capacita-me com poder e faz-me disponível para ser Tua testemunha onde eu estiver.”',
    callToAction: 'Compartilhe este devocional com alguém hoje! A fé que recebemos não foi feita para ficar escondida, mas para transformar vidas!',
  },
  {
    id: 'dia-46-fome-de-deus',
    title: 'A FOME QUE FAZ VOCÊ BUSCAR MAIS A DEUS',
    tag: '🔥 DIA 46 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 46 de 50 • Rumo ao Pentecostes',
    verse: '“Bem-aventurados os que têm fome e sede de justiça, porque serão fartos.”',
    verseRef: 'Mateus 5:6',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-46.mp3',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 15/09 ÀS 05:00 DA MANHÃ (Fuso de Brasília)
    releaseAt: '2026-09-15T05:00:00-03:00',
    reflection: 'Você ainda tem fome de Deus?\n\nExiste uma profunda diferença entre conhecer a Deus e continuar desejando conhecê-Lo mais. Quem tem fome espiritual de verdade não precisa ser convencido a procurar alimento: a fome cria movimento e a sede faz buscar água. Não permita que experiências do passado se tornem substitutas da busca no presente — o que Deus fez ontem foi maravilhoso, mas hoje ainda existe mais de Deus para você.\n\nCuidado com a saturação da alma: podemos estar cercados de conteúdo cristão e ainda assim estar espiritualmente famintos. Informação sobre Deus não é o mesmo que intimidade com Deus. Quem tem fome de Deus não se contenta com migalhas, busca o próprio coração do Pai e não apenas as Suas bênçãos.',
    challenge: 'Separe hoje um tempo maior e sem pressa para estar a sós com o Senhor. Desligue as distrações, abra a Bíblia, adore e pergunte: “Senhor, o que tem diminuído a minha fome por Ti? Desperta novamente em mim uma sede profunda pela Tua presença.”\n\n🔥 Propósito da Jornada: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe essa mensagem com alguém que precisa reacender a chama e a fome pela presença do Espírito Santo!',
  },
  {
    id: 'dia-45-distracao-foco',
    title: 'NÃO DEIXE A DISTRAÇÃO ROUBAR O SEU FOCO',
    tag: '🔥 DIA 45 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 45 de 50 • Rumo ao Pentecostes',
    verse: '“Buscai, pois, em primeiro lugar o Reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas.”',
    verseRef: 'Mateus 6:33',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-45.mp3',
    // ⏰ LIBERADO HOJE (14/09) ÀS 05:00 DA MANHÃ (Fuso de Brasília)
    releaseAt: '2026-09-14T05:00:00-03:00',
    reflection: 'O que tem ocupado o primeiro lugar no seu coração?\n\nFaltam apenas 5 dias para encerrar nossa jornada rumo ao Pentecostes. Muitas vezes não abandonamos a Deus, continuamos orando e indo à igreja, mas aos poucos outras coisas vão ocupando o espaço que pertencia somente ao Senhor: trabalho, dinheiro, redes sociais, preocupações e planos.\n\nDistração não precisa ser pecado para ser perigosa. O problema acontece quando coisas legítimas roubam o lugar do essencial. Jesus disse: “Buscai, pois, em primeiro lugar o Reino de Deus”. Colocar Deus no centro não é dar a Ele apenas o tempo que sobra na agenda, mas consultá-Lo antes de decidir, falar, agir ou se preocupar. Quando Deus está no primeiro lugar, você cuida da sua vida com a confiança de que Ele cuida de você.',
    challenge: 'Faça hoje uma faxina na sua rotina: escolha algo que tem roubado excessivamente o seu foco (redes sociais, vídeos, jogos ou conversas fúteis) e estabeleça um limite claro. Use esse tempo para estar no secreto com a Palavra e declare: “Senhor, eu Te coloco novamente no primeiro lugar da minha vida.”\n\n🔥 Propósito da Jornada: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe esse devocional com alguém que precisa realinhar suas prioridades e manter o foco em Deus nesta reta final!',
  },
  {
    id: 'dia-43-disposto-a-servir',
    title: 'VOCÊ ESTÁ DISPOSTO A SERVIR?',
    tag: '🔥 DIA 43 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 43 de 50 • Rumo ao Pentecostes',
    verse: '“Pois o próprio Filho do Homem não veio para ser servido, mas para servir e dar a sua vida em resgate por muitos.”',
    verseRef: 'Marcos 10:45',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-43.mp3',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 12/09/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-09-12T05:00:00-03:00',
    reflection: 'É possível querer ser cheio do Espírito Santo e, ao mesmo tempo, querer que tudo gire ao nosso redor: queremos receber, ser abençoados e viver experiências profundas, mas Jesus nos apresenta outro caminho — o caminho do serviço. Ele, sendo o Senhor, escolheu servir, e nos ensina que o Reino de Deus não é sobre ser servido, mas sobre doar a própria vida.\n\nServir não é cumprir tarefas por obrigação: é uma expressão visível de amor. Quem serve de verdade não precisa de aplausos, reconhecimento ou elogios humanos, porque compreende que está servindo a Deus através das pessoas. O Espírito Santo nos tira do centro e nos ensina a perguntar menos “o que eu ganho com isso?” e muito mais “quem eu posso abençoar?”. O Reino de Deus avança através de gestos simples feitos com coração disponível.',
    challenge: 'Faça algo prático por alguém hoje sem contar para ninguém e sem esperar reconhecimento: uma ajuda simples, uma palavra de ânimo, uma oração ou um gesto de serviço que alivie o fardo de alguém. E diga a Deus: “Senhor, que isso seja uma expressão do Teu amor através de mim”.\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe este devocional com alguém querido. O amor de Cristo se manifesta com poder quando nos dispomos a servir!',
  },
  {
    id: 'dia-42-curar-esconder',
    title: 'DEUS QUER CURAR AQUILO QUE VOCÊ APRENDEU A ESCONDER',
    tag: '🔥 DIA 42 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 42 de 50 • Rumo ao Pentecostes',
    verse: '“Sonda-me, ó Deus, e conhece o meu coração; prova-me, e conhece os meus pensamentos. E vê se há em mim algum caminho mau, e guia-me pelo caminho eterno.”',
    verseRef: 'Salmo 139:23-24',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-42.mp3',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 11/09/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-09-11T05:00:00-03:00',
    reflection: 'Existem feridas que ninguém vê e dores que aprendemos a disfarçar. Continuamos sorrindo, servindo e dizendo que está tudo bem, mas lá dentro existe algo que ainda precisa ser tratado. Uma das partes mais profundas da preparação para o Pentecostes é permitir que Deus entre nos lugares do nosso coração que ninguém mais consegue acessar.\n\nDavi orou: “Sonda-me, ó Deus... examina-me”. Deus já conhece os nossos pensamentos, medos e feridas, e mesmo assim nos chama para perto. A correção de Deus não é rejeição: Ele não aponta a ferida para condenar, mas toca para curar e restaurar. Não transforme suas feridas do passado na sua identidade. Você pode ser sincero diante do Senhor, porque as mãos que revelam a ferida são as mesmas que sustentam a sua cura.',
    challenge: 'Tire alguns minutos sozinho com Deus hoje e faça a oração de Davi: “Senhor, sonda o meu coração e mostra o que precisa ser tratado”. Se Deus trouxer algo à sua memória — uma mágoa, um comportamento, uma culpa —, não fuja: entregue tudo aos pés de Jesus e receba o perdão e a cura do Espírito Santo.\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe este devocional com alguém. A cura de Deus começa quando temos a coragem de abrir o coração sem máscaras!',
  },
  {
    id: 'dia-41-alegria-caminho',
    title: 'NÃO PERCA A ALEGRIA NO MEIO DO CAMINHO',
    tag: '🔥 DIA 41 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 41 de 50 • Rumo ao Pentecostes',
    verse: '“Alegrai-vos sempre no Senhor; outra vez digo: alegrai-vos.”',
    verseRef: 'Filipenses 4:4',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-41.mp3',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 10/09/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-09-10T05:00:00-03:00',
    reflection: 'É mais fácil começar animado do que permanecer animado. No início de uma caminhada com Deus há expectativa e empolgação, mas com o passar do tempo chegam a rotina, as preocupações e as orações que ainda parecem sem resposta. É aí que a alegria corre o risco de desaparecer.\n\nPor isso, Paulo escreveu: “Alegrai-vos sempre no Senhor”. A alegria cristã não depende das circunstâncias e nem da ausência de problemas; ela nasce de saber quem Deus é. Ser cheio do Espírito Santo não significa nunca ter dias difíceis, mas saber que nesses dias você nunca está sozinho. A alegria é fruto do Espírito Santo (Gálatas 5:22), alimentada pela oração, pela Palavra e pela gratidão por aquilo que Deus já realizou.',
    challenge: 'Hoje, pratique 3 coisas práticas: agradeça a Deus por 3 bênçãos que você já tem, adore ao Senhor mesmo por aquilo que ainda não se concretizou, e envie uma palavra de encorajamento para alguém. Declare: “A minha alegria está no Senhor!”\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe este devocional com alguém querido que precisa renovar o ânimo e a alegria espiritual no dia de hoje!',
  },
  {
    id: 'dia-40-portas-fechadas',
    title: 'QUANDO DEUS FECHA UMA PORTA, NÃO PARE NO CAMINHO',
    tag: '🔥 DIA 40 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 40 de 50 • Rumo ao Pentecostes',
    verse: '“Eu sou a porta; se alguém entrar por mim, salvar-se-á, e entrará, e sairá, e achará pastagens.”',
    verseRef: 'João 10:9',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-40.mp3',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 09/09/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-09-09T05:00:00-03:00',
    reflection: 'Você ora, planeja, acredita... e mesmo assim a porta se fecha. Uma oportunidade que não acontece, uma resposta que não chega, um projeto interrompido. E então surge a pergunta: “Deus, por quê?”\n\nUma porta fechada não significa que Deus te abandonou. Nem toda porta aberta é a vontade de Deus, e nem tudo o que parece bom é o melhor para nós. Às vezes, o que chamamos de perda é, na verdade, livramento e proteção de Deus, que enxerga o caminho inteiro enquanto nós vemos apenas alguns passos. Não transforme uma porta fechada em paralisia espiritual. Não pare de orar, de servir e de sonhar. Jesus é a porta principal, e quando Ele conduz os nossos passos, o nosso destino está seguro.',
    challenge: 'Pense em uma porta que você tem tentado abrir à força há algum tempo. Entregue essa situação a Deus em oração e diga: “Senhor, eu não quero apenas a porta que eu desejo, quero que o Senhor me conduza pela porta certa.” Se Deus abrir, entre; se Ele fechar, continue caminhando em paz.\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe este devocional com alguém que está enfrentando frustração com planos frustrados. Deus continua no controle de cada caminho!',
  },
  {
    id: 'dia-39-usar-o-que-tem',
    title: 'DEUS QUER USAR O QUE VOCÊ JÁ TEM',
    tag: '🔥 DIA 39 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 39 de 50 • Rumo ao Pentecostes',
    verse: '“E Eliseu lhe disse: Que te hei de fazer? Dize-me que é o que tens em casa. E ela disse: Tua serva não tem nada em casa, senão uma botija de azeite.”',
    verseRef: '2 Reis 4:2',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-39.mp3',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 08/09/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-09-08T05:00:00-03:00',
    reflection: 'Ficar esperando ter mais para começar a servir a Deus é uma armadilha sutil: esperamos ter mais conhecimento, mais recursos, mais tempo ou uma vida perfeita. Enquanto focamos no que nos falta, deixamos de perceber que Deus pode começar o milagre com aquilo que já está em nossas mãos.\n\nNa história da viúva em 2 Reis 4, Eliseu não perguntou o que ela não tinha, mas sim: “Que é que tens em casa?”. Ela tinha apenas uma botija de azeite — parecia insignificante diante do tamanho da dívida, mas nas mãos do Senhor o pouco se multiplicou e foi mais que suficiente. Não espere condições perfeitas para obedecer. Deus não procura pessoas extraordinárias, Ele procura corações disponíveis.',
    challenge: 'Faça hoje uma lista de 3 coisas que Deus já colocou em suas mãos (um talento, um recurso, uma experiência ou seu próprio tempo) e pergunte: “Senhor, como posso usar isso para abençoar alguém hoje?”. Dê o primeiro passo com o que você já tem!\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe este devocional com alguém. Nas mãos certas de Deus, o pouco deixa de ser pouco e se transforma em milagre!',
  },
  {
    id: 'dia-38-pressa-aquietar',
    title: 'NÃO DEIXE A PRESSA ROUBAR O QUE DEUS ESTÁ FAZENDO',
    tag: '🔥 DIA 38 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 38 de 50 • Rumo ao Pentecostes',
    verse: '“Aquietai-vos e sabei que eu sou Deus.”',
    verseRef: 'Salmo 46:10',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-38.m4a',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 07/09/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-09-07T05:00:00-03:00',
    reflection: 'A nossa vida é cheia de barulho: notificações, preocupações, decisões e pressa. No meio disso tudo, muitas vezes queremos ouvir a voz de Deus sem parar para ficar em silêncio. Pedimos direção, mas continuamos correndo; pedimos uma resposta, mas já decidimos o que queremos fazer.\n\nNem todo silêncio é ausência de Deus. Silêncio não significa abandono: existem momentos em que Deus está trabalhando em profundidade enquanto nós esperamos uma resposta na superfície. Aquietar-se é parar de tentar controlar o incontrolável — o amanhã, o tempo e a reação dos outros nunca estiveram nas nossas mãos. No silêncio, Deus amadurece a nossa fé, alinha prioridades e nos ensina a depender Dele. Não tenha tanta pressa de sair de onde Deus ainda está trabalhando.',
    challenge: 'Hoje, separe pelo menos 10 minutos sem celular, sem música e sem distrações. Fique em silêncio diante de Deus e diga: “Senhor, estou aqui. Fala comigo e trabalha em mim.” Depois, leia Salmo 46:10 e descanse o seu coração.\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe este devocional com alguém que está enfrentando ansiedade ou pressa. Lembrar de aquietar a alma traz a paz de Deus que excede todo entendimento!',
  },
  {
    id: 'dia-37-amor-atitudes',
    title: 'QUANDO O AMOR TRANSFORMA NOSSAS ATITUDES',
    tag: '🔥 DIA 37 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 37 de 50 • Rumo ao Pentecostes',
    verse: '“Nisto todos conhecerão que sois meus discípulos, se tiverdes amor uns aos outros.”',
    verseRef: 'João 13:35',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-37.mp3',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 06/09/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-09-06T05:00:00-03:00',
    reflection: 'Do que adianta querer viver uma grande experiência com Deus, se isso não transforma a maneira como tratamos as pessoas?\n\nA presença do Espírito Santo não foi dada apenas para produzir momentos emocionantes na igreja; ela transforma o nosso coração, e uma das maiores evidências dessa transformação é o amor. Jesus ensinou que as pessoas nos reconheceriam pelo amor, não por títulos, quantidade de palavras bonitas ou tamanho de conhecimento.\n\nQuando o Espírito Santo opera em nós, mudamos o olhar: quem antes nos irritava passa a ser alvo de oração; quem nos feriu deixa de ser apenas inimigo e passa a ser alguém que necessita da graça de Deus. Amar não é apenas sentimento: é uma decisão prática de perdoar, ouvir, servir sem esperar aplausos e controlar palavras que poderiam ferir.',
    challenge: 'Escolha uma pessoa hoje e demonstre o amor de Jesus de forma prática: uma mensagem sincera, uma ligação, um pedido de perdão, um gesto de ajuda ou uma oração por alguém difícil de amar. Faça isso para a glória de Deus, sem buscar reconhecimento humano.\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe este devocional com alguém querido. O amor vivido em atitudes é o maior testemunho de que Cristo vive em nós!',
  },
  {
    id: 'dia-36-humildade',
    title: 'DEUS DÁ GRAÇA AOS HUMILDES',
    tag: '🔥 DIA 36 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 36 de 50 • Rumo ao Pentecostes',
    verse: '“Deus resiste aos soberbos, mas dá graça aos humildes.”',
    verseRef: 'Tiago 4:6',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-36.m4a',
    // ⏰ LIBERAÇÃO: 05/09/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-09-05T05:00:00-03:00',
    reflection: 'Muitas vezes o maior obstáculo para Deus não é a nossa fraqueza, é a nossa autossuficiência. É quando começamos a pensar que conseguimos sozinhos, que sabemos o que estamos fazendo e que Deus precisa agir do jeito que esperamos. Sem perceber, o coração vai ficando cheio de si mesmo.\n\nMas a Bíblia diz: Deus dá graça aos humildes. Humildade não significa pensar que você não tem valor, mas sim reconhecer: “eu preciso de Deus”. Preciso da direção Dele, da correção Dele, da graça Dele e do Seu Espírito Santo. Não importa quanta experiência tenhamos, nunca chegamos ao ponto de não precisar mais do Senhor. Um coração humilde não diz “eu já sei”, pelo contrário, pergunta: “Senhor, o que Tu queres me ensinar hoje?”',
    challenge: 'Faça uma avaliação sincera do seu coração hoje. Pergunte a Deus: “Senhor, o que existe dentro de mim que precisa diminuir para que o Senhor tenha mais espaço?” Se Ele mostrar algo, entregue a Ele, peça perdão se necessário, mude de atitude e deixe o Espírito Santo transformar a sua vida.\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe este devocional com alguém que precisa dessa mensagem hoje. A humildade abre o caminho para a graça de Deus se manifestar!',
  },
  {
    id: 'dia-34-sozinho',
    title: 'VOCÊ NÃO PRECISA FAZER TUDO SOZINHO',
    tag: '🔥 DIA 34 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 34 de 50 • Rumo ao Pentecostes',
    verseRef: 'João 15:5',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-34.m4a',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 03/09/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-09-03T05:00:00-03:00',
    reflection: 'Você tem tentado carregar tudo sozinho?\n\nNo devocional de hoje, vamos lembrar de uma verdade simples, mas poderosa: nós precisamos de Deus todos os dias. Jesus disse que, sem Ele, nada podemos fazer. Assim como um ramo precisa permanecer conectado à videira, nós precisamos permanecer conectados a Cristo.',
    challenge: 'Ouça essa mensagem até o final e pense: em qual área da sua vida você está tentando fazer sozinho aquilo que deveria estar entregando a Deus?\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe este devocional com alguém que está cansado de carregar tudo sozinho. Talvez essa pessoa precise lembrar que depender de Deus não é fraqueza... é fé.',
  },
  {
    id: 'dia-33-medo',
    title: 'DEUS NÃO TE DEU UM ESPÍRITO DE MEDO',
    tag: '🔥 DIA 33 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 33 de 50 • Rumo ao Pentecostes',
    verse: '“Pois Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.”',
    verseRef: '2 Timóteo 1:7',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-33.m4a',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 02/09/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-09-02T05:00:00-03:00',
    reflection: 'O que você faria hoje se o medo não estivesse determinando as suas decisões?\n\nNo devocional de hoje, vamos conversar sobre medo, coragem e sobre aquilo que Deus colocou dentro de nós. Talvez você esteja esperando o medo desaparecer para dar um passo... mas e se a verdadeira coragem for avançar mesmo com o coração tremendo?',
    challenge: 'Ouça essa mensagem até o final e identifique uma área da sua vida em que o medo tem te impedido de avançar. Talvez hoje seja o dia de dar o primeiro passo.\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe este devocional com alguém que está deixando o medo paralisar seus sonhos, sua fé ou aquilo que Deus colocou em seu coração. Chama essa pessoa pra continuar essa jornada com a gente!',
  },
  {
    id: 'dia-32-demorar',
    title: 'QUANDO DEUS PARECE DEMORAR',
    tag: '🔥 DIA 32 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 32 de 50 • Rumo ao Pentecostes',
    verse: '“Para tudo há uma ocasião certa; há um tempo certo para cada propósito debaixo do céu.”',
    verseRef: 'Eclesiastes 3:1',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-32.m4a',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 01/09/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-09-01T05:00:00-03:00',
    reflection: 'Você está esperando alguma resposta de Deus?\n\nTalvez você esteja orando por uma porta, uma mudança, uma promessa ou uma direção... e parece que Deus está demorando. Mas e se, enquanto você espera, Deus estiver trabalhando em você?\n\nNo devocional de hoje, vamos falar sobre o tempo de Deus e sobre como transformar a espera em um período de crescimento, preparação e confiança.',
    challenge: 'Ouça essa mensagem até o final e faça uma pergunta diferente hoje: “Senhor, o que o Senhor quer produzir em mim enquanto eu espero?”\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe este devocional com alguém que está vivendo um tempo de espera. Talvez essa pessoa precise lembrar que esperar em Deus não é tempo perdido.',
  },
  {
    id: 'dia-31-permanecer',
    title: 'PERMANEÇA, MESMO QUANDO NÃO SENTIR NADA',
    tag: '🔥 DIA 31 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 31 de 50 • Rumo ao Pentecostes',
    verse: '“Portanto, meus amados irmãos, sede firmes e constantes, sempre abundantes na obra do Senhor, sabendo que o vosso trabalho não é vão no Senhor.”',
    verseRef: '1 Coríntios 15:58',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-31.m4a',
    // ⏰ AGENDADO PARA LIBERAÇÃO AUTOMÁTICA EM 31/08/2026 ÀS 05:00 DA MANHÃ (Horário de Brasília)
    releaseAt: '2026-08-31T05:00:00-03:00',
    reflection: 'Você já teve um dia em que orou, buscou a Deus... mas não sentiu absolutamente nada?\n\nNo devocional de hoje, vamos conversar sobre permanecer. Porque a nossa fé não pode depender apenas daquilo que sentimos. Existem dias em que Deus parece tão perto e outros em que tudo parece silencioso. Mas Deus continua sendo Deus em todos eles.',
    challenge: 'Ouça essa mensagem até o final e faça essa oração: “Senhor, mesmo quando eu não sinto, eu continuo confiando. Eu escolho permanecer.”\n\n🔥 Propósito da Jornada: Durante esses 50 dias, faça diariamente esta oração: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe esse devocional com alguém que está cansado ou passando por um período de silêncio espiritual. Talvez essa pessoa esteja pensando em desistir e precise ouvir que ainda vale a pena permanecer.',
  },
  {
    id: 'dia-30-surpreender',
    title: 'VOCÊ ESTÁ DISPOSTO A DEIXAR DEUS TE SURPREENDER?',
    tag: '🔥 DIA 30 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 30 de 50 • Rumo ao Pentecostes',
    verse: '“Porque os meus pensamentos não são os vossos pensamentos, nem os vossos caminhos os meus caminhos, diz o Senhor.”',
    verseRef: 'Isaías 55:8',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-30.mp3',
    // Liberado anteriormente em 30/08/2026 às 05:00
    releaseAt: '2026-08-30T05:00:00-03:00',
    reflection: 'Você consegue confiar em Deus quando Ele não faz as coisas do jeito que você imaginou?\n\nNo devocional de hoje, vamos conversar sobre confiança. Muitas vezes a gente entrega uma situação pra Deus, mas também quer determinar como Ele deve resolver. Só que os pensamentos e os caminhos de Deus são maiores que os nossos.',
    challenge: 'Ouça essa mensagem até o final e faça essa oração: “Senhor, eu não quero mais determinar como o Senhor vai fazer. Eu confio nos Teus caminhos.”\n\n🔥 Propósito da Jornada: “Espírito Santo, prepara o meu coração e enche a minha vida da Tua presença.”',
    callToAction: 'Compartilhe esse devocional com alguém que está passando por uma situação que não saiu como esperava. Deus continua no controle!',
  },
  {
    id: 'dia-25-fogo',
    title: 'PERMANEÇA ATÉ QUE O FOGO VENHA',
    tag: '🔥 DIA 25 DE 50 | Rumo ao Pentecostes',
    dateFormatted: 'Dia 25 de 50 • Rumo ao Pentecostes',
    verse: '“Também lhes contou Jesus uma parábola, para mostrar que deviam orar sempre e nunca desanimar.”',
    verseRef: 'Lucas 18:1',
    author: 'Pr. Cristiano Kresse',
    audioFileName: 'devocional-dia-25.mp3',
    // Liberado anteriormente
    releaseAt: '2026-08-25T00:00:00-03:00',
    reflection: 'É fácil orar quando o coração está queimando. Mas o que você faz quando não sente mais nada? Quando o céu parece de bronze e a resposta parece demorar?\n\nNo Dia 25 da nossa jornada, o Espírito Santo nos chama à PERSEVERANÇA. Os discípulos não receberam o fogo no primeiro dia de oração, eles permaneceram no cenáculo até a promessa se cumprir. O fogo não cai sobre quem apenas começa, o fogo cai sobre quem permanece!',
    challenge: 'Volte hoje ao secreto e ore por pelo menos 15 minutos, MESMO QUE NÃO SINTA NADA. Não busque arrepios, busque a presença. Apenas permaneça e diga: "Senhor, estou aqui porque Te amo e confio em Ti."',
    callToAction: 'Compartilhe esse devocional com alguém que pensou em desistir essa semana. Deus ainda está trabalhando no secreto!',
  }
];

/**
 * Retorna as URLs de áudio com fallback resiliente para .m4a, .mp3 e .wav em CDN e local
 */
export function getDevotionalAudioUrls(audioFileName) {
  if (!audioFileName) return [];
  const baseName = audioFileName.replace(/\.(mp3|wav|m4a)$/i, '');
  const match = audioFileName.match(/\.(mp3|wav|m4a)$/i);
  const preferredExt = match ? match[0].toLowerCase() : '.m4a';
  const allExts = [preferredExt, '.m4a', '.mp3', '.wav'];
  const extensions = [...new Set(allExts)];

  const urls = [];
  for (const ext of extensions) {
    urls.push(`./audio/devocionais/${baseName}${ext}`);
    urls.push(`/audio/devocionais/${baseName}${ext}`);
    urls.push(`https://cdn.jsdelivr.net/gh/cristianokresse2024-pixel/bibliapoetica@main/audio/devocionais/${baseName}${ext}`);
    urls.push(`https://raw.githubusercontent.com/cristianokresse2024-pixel/bibliapoetica/main/audio/devocionais/${baseName}${ext}`);
  }
  return urls;
}

/**
 * Retorna apenas os devocionais que já atingiram o horário de liberação (releaseAt <= now).
 * Ordenados do mais recente para o mais antigo.
 */
export function getReleasedDevotionals() {
  const nowTs = Date.now();
  return DEVOTIONALS.filter((d) => {
    if (!d.releaseAt) return true;
    const releaseTs = new Date(d.releaseAt).getTime();
    return releaseTs <= nowTs;
  }).sort((a, b) => new Date(b.releaseAt).getTime() - new Date(a.releaseAt).getTime());
}

/**
 * Retorna o Devocional Ativo de Hoje (o mais recente já liberado)
 */
export function getActiveDevotional() {
  const list = getReleasedDevotionals();
  return list[0] || DEVOTIONALS[DEVOTIONALS.length - 1] || null;
}

/**
 * Retorna apenas o devocional do dia anterior (ontem) já liberado,
 * permitindo que quem perdeu o dia anterior ainda consiga ouvir.
 */
export function getPastDevotionals() {
  const list = getReleasedDevotionals();
  // Retorna estritamente apenas 1 devocional anterior (o dia de ontem)
  return list.slice(1, 2);
}

/**
 * Retorna os devocionais futuros programados para liberação
 */
export function getUpcomingDevotionals() {
  const now = new Date();
  return DEVOTIONALS.filter((d) => {
    if (!d.releaseAt) return false;
    return new Date(d.releaseAt) > now;
  }).sort((a, b) => new Date(a.releaseAt) - new Date(b.releaseAt));
}

