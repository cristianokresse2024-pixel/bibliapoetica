# -*- coding: utf-8 -*-
# Gera data/books/gn/01-17.json — Gênesis, capítulos 1 a 17
# Adaptação em português moderno, fiel aos escritos originais,
# elaborada a partir de traduções de domínio público (Almeida 1911 / Tradução Brasileira 1917).
import json, os

def V(v, text):
    return {"v": v, "text": text}

CH = {}

CH["1"] = {
  "verses": 31,
  "summary": "Deus cria tudo em seis dias: a luz, o céu, a terra, os astros, os seres vivos e, por fim, o ser humano — feito à sua imagem.",
  "sections": [
    {"title": "A criação dos céus e da terra", "start": 1},
    {"title": "O quarto dia: os astros", "start": 14},
    {"title": "O quinto e o sexto dia", "start": 20},
    {"title": "A criação do ser humano", "start": 26},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "No princípio, Deus criou os céus e a terra."),
      V(2, "A terra era sem forma e vazia; havia escuridão sobre a face do abismo, e o Espírito de Deus pairava sobre as águas."),
      V(3, "Deus disse: “Haja luz” — e houve luz."),
      V(4, "Deus viu que a luz era boa e separou a luz da escuridão."),
      V(5, "Deus chamou a luz de “dia” e a escuridão de “noite”. Houve tarde e houve manhã: o primeiro dia."),
    ]},
    {"verses": [
      V(6, "Deus disse: “Haja um firmamento no meio das águas, separando águas de águas.”"),
      V(7, "Deus fez o firmamento e separou as águas que ficaram abaixo do firmamento das que ficaram acima. E assim aconteceu."),
      V(8, "Deus chamou o firmamento de “céu”. Houve tarde e houve manhã: o segundo dia."),
    ]},
    {"verses": [
      V(9, "Deus disse: “Juntem-se as águas que estão debaixo do céu num só lugar, e apareça a parte seca.” E assim aconteceu."),
      V(10, "Deus chamou a parte seca de “terra” e o ajuntamento das águas de “mares”. E Deus viu que era bom."),
      V(11, "Deus disse: “Produza a terra vegetação: plantas que deem semente e árvores frutíferas que deem fruto com a sua semente, cada uma segundo a sua espécie.” E assim aconteceu."),
      V(12, "A terra produziu vegetação: plantas que davam semente segundo a sua espécie e árvores que davam fruto com a sua semente, segundo a sua espécie. E Deus viu que era bom."),
      V(13, "Houve tarde e houve manhã: o terceiro dia."),
    ]},
    {"verses": [
      V(14, "Deus disse: “Haja luzes no firmamento do céu para separar o dia da noite; que sirvam de sinais para marcar as estações, os dias e os anos,"),
      V(15, "e sejam luzes no firmamento do céu para iluminar a terra.” E assim aconteceu."),
      V(16, "Deus fez os dois grandes luzeiros: o maior para governar o dia e o menor para governar a noite — e também as estrelas."),
      V(17, "Deus os colocou no firmamento do céu para iluminar a terra,"),
      V(18, "para governar o dia e a noite e para separar a luz da escuridão. E Deus viu que era bom."),
      V(19, "Houve tarde e houve manhã: o quarto dia."),
    ]},
    {"verses": [
      V(20, "Deus disse: “Fervilhem as águas de seres vivos, e voem as aves sobre a terra, sob o firmamento do céu.”"),
      V(21, "Deus criou os grandes animais marinhos e todos os seres vivos que se movem e enchem as águas, cada um segundo a sua espécie; e também todas as aves, segundo a sua espécie. E Deus viu que era bom."),
      V(22, "Deus os abençoou, dizendo: “Sejam férteis, multipliquem-se e encham as águas dos mares; e que as aves se multipliquem sobre a terra.”"),
      V(23, "Houve tarde e houve manhã: o quinto dia."),
    ]},
    {"verses": [
      V(24, "Deus disse: “Produza a terra seres vivos segundo as suas espécies: animais domésticos, animais que rastejam e animais selvagens, cada um segundo a sua espécie.” E assim aconteceu."),
      V(25, "Deus fez os animais selvagens, os animais domésticos e todos os animais que rastejam pelo chão, cada um segundo a sua espécie. E Deus viu que era bom."),
    ]},
    {"verses": [
      V(26, "Deus disse: “Façamos o ser humano à nossa imagem, conforme a nossa semelhança. Ele dominará sobre os peixes do mar, as aves do céu, os animais domésticos, sobre toda a terra e sobre todos os animais que rastejam pelo chão.”"),
      V(27, "Deus criou o ser humano à sua imagem; à imagem de Deus o criou; homem e mulher ele os criou."),
      V(28, "Deus os abençoou e lhes disse: “Sejam férteis, multipliquem-se, encham a terra e dominem sobre ela. Governem sobre os peixes do mar, as aves do céu e todos os animais que se movem pela terra.”"),
      V(29, "Deus disse ainda: “Eu dou a vocês todas as plantas que dão semente, que existem sobre a terra, e todas as árvores que dão fruto com semente; isso será o alimento de vocês."),
      V(30, "E a todos os animais da terra, a todas as aves do céu e a tudo o que rasteja sobre a terra, a tudo que tem fôlego de vida, dou toda planta verde como alimento.” E assim aconteceu."),
      V(31, "Deus viu tudo o que tinha feito — e era muito bom. Houve tarde e houve manhã: o sexto dia."),
    ]},
  ],
}

CH["2"] = {
  "verses": 25,
  "summary": "Deus descansa no sétimo dia. O jardim do Éden é preparado para o ser humano, com uma ordem clara: não comer da árvore do conhecimento do bem e do mal. Depois, Deus cria a mulher.",
  "sections": [
    {"title": "O sétimo dia", "start": 1},
    {"title": "O jardim do Éden", "start": 8},
    {"title": "A criação da mulher", "start": 18},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Assim foram concluídos os céus e a terra, com tudo o que neles existe."),
      V(2, "No sétimo dia, Deus terminou a obra que tinha feito e descansou de todo o seu trabalho."),
      V(3, "Deus abençoou o sétimo dia e o separou como santo, porque nele descansou de toda a obra da criação."),
    ]},
    {"verses": [
      V(4, "Esta é a história da criação dos céus e da terra, no dia em que o Senhor Deus os fez."),
      V(5, "Ainda não havia arbusto algum no campo, e nenhuma planta tinha brotado, porque o Senhor Deus ainda não tinha feito chover sobre a terra — e não havia ninguém para cultivar o solo."),
      V(6, "Mas da terra subia uma névoa que regava toda a superfície do solo."),
      V(7, "Então o Senhor Deus formou o ser humano do pó da terra, soprou em suas narinas o fôlego de vida, e o ser humano se tornou um ser vivo."),
    ]},
    {"verses": [
      V(8, "O Senhor Deus plantou um jardim no Éden, na direção do oriente, e ali colocou o ser humano que tinha formado."),
      V(9, "O Senhor Deus fez brotar do solo todo tipo de árvore agradável aos olhos e boa para alimento; e, no meio do jardim, a árvore da vida e a árvore do conhecimento do bem e do mal."),
      V(10, "Do Éden nascia um rio que regava o jardim e, dali, se dividia em quatro braços."),
      V(11, "O nome do primeiro é Pisom: ele percorre toda a terra de Havilá, onde há ouro —"),
      V(12, "e o ouro daquela terra é puro; ali também há resina perfumada e pedra de ônix."),
      V(13, "O nome do segundo rio é Giom: ele percorre toda a terra de Cuxe."),
      V(14, "O nome do terceiro é Tigre: ele corre a leste da Assíria. E o quarto é o Eufrates."),
    ]},
    {"verses": [
      V(15, "O Senhor Deus tomou o ser humano e o colocou no jardim do Éden para cultivá-lo e guardá-lo."),
      V(16, "E o Senhor Deus deu esta ordem ao ser humano: “Você pode comer à vontade de toda árvore do jardim,"),
      V(17, "mas da árvore do conhecimento do bem e do mal não coma; porque, no dia em que dela comer, com certeza você morrerá.”"),
    ]},
    {"verses": [
      V(18, "O Senhor Deus disse: “Não é bom que o ser humano fique sozinho. Vou fazer para ele alguém que o ajude e que combine com ele.”"),
      V(19, "O Senhor Deus tinha formado da terra todos os animais do campo e todas as aves do céu, e os trouxe ao ser humano para ver que nome ele lhes daria; e o nome que o ser humano desse a cada ser vivo, esse seria o seu nome."),
      V(20, "O ser humano deu nome a todos os animais domésticos, às aves do céu e aos animais selvagens. Mas para ele não se achou ninguém que o ajudasse e que combinasse com ele."),
      V(21, "Então o Senhor Deus fez cair um sono profundo sobre o ser humano, e ele dormiu. Deus tirou uma de suas costelas e fechou a carne naquele lugar."),
      V(22, "Da costela que tinha tirado do ser humano, o Senhor Deus formou a mulher e a trouxe até ele."),
      V(23, "E o ser humano exclamou: “Agora sim! Esta é osso dos meus ossos e carne da minha carne! Ela será chamada ‘mulher’, porque do homem foi tirada.”"),
      V(24, "Por isso o homem deixa seu pai e sua mãe e se une à sua mulher, e os dois se tornam uma só carne."),
      V(25, "O homem e a mulher estavam nus, e não sentiam vergonha."),
    ]},
  ],
}

CH["3"] = {
  "verses": 24,
  "summary": "A serpente engana a mulher, o casal come do fruto proibido e a vergonha, o medo e a morte entram no mundo. Deus anuncia o juízo — e a promessa de um descendente vencedor — e expulsa o casal do Éden.",
  "sections": [
    {"title": "A queda", "start": 1},
    {"title": "O julgamento", "start": 9},
    {"title": "A expulsão do Éden", "start": 21},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "A serpente era o mais astuto de todos os animais selvagens que o Senhor Deus tinha feito. Ela perguntou à mulher: “Foi assim mesmo que Deus disse: ‘Não comam de nenhuma árvore do jardim’?”"),
      V(2, "A mulher respondeu: “Podemos comer do fruto das árvores do jardim,"),
      V(3, "mas do fruto da árvore que está no meio do jardim Deus disse: ‘Não comam dele, nem toquem nele, para que não morram.’”"),
      V(4, "A serpente disse à mulher: “Com certeza vocês não morrerão!"),
      V(5, "Deus sabe que, no dia em que comerem desse fruto, os olhos de vocês se abrirão e vocês serão como Deus, conhecendo o bem e o mal.”"),
      V(6, "A mulher viu que a árvore parecia boa para comer, agradável aos olhos e desejável para se obter entendimento. Ela tomou do fruto, comeu e deu também ao marido, que estava com ela — e ele comeu."),
      V(7, "Os olhos dos dois se abriram, e eles perceberam que estavam nus. Então costuraram folhas de figueira e fizeram para si cintas."),
    ]},
    {"verses": [
      V(8, "Ao ouvirem a voz do Senhor Deus, que passeava pelo jardim na brisa do fim do dia, o homem e a mulher se esconderam da presença do Senhor Deus entre as árvores do jardim."),
      V(9, "Mas o Senhor Deus chamou o homem e perguntou: “Onde você está?”"),
      V(10, "Ele respondeu: “Ouvi a tua voz no jardim e tive medo, porque estou nu; por isso me escondi.”"),
      V(11, "Deus perguntou: “Quem disse a você que está nu? Você comeu da árvore da qual proibi você de comer?”"),
      V(12, "O homem respondeu: “A mulher que me deste por companheira me deu do fruto da árvore, e eu comi.”"),
      V(13, "O Senhor Deus perguntou à mulher: “O que foi que você fez?” Ela respondeu: “A serpente me enganou, e eu comi.”"),
    ]},
    {"verses": [
      V(14, "Então o Senhor Deus disse à serpente: “Por ter feito isso, maldita é você entre todos os animais, domésticos e selvagens! Você rastejará sobre o ventre e comerá pó todos os dias da sua vida."),
      V(15, "Porei inimizade entre você e a mulher, entre a sua descendência e a descendência dela. Ele esmagará a sua cabeça, e você ferirá o calcanhar dele.”"),
      V(16, "À mulher ele disse: “Multiplicarei as dores da sua gravidez; com sofrimento você dará à luz os filhos. O seu desejo será para o seu marido, e ele a governará.”"),
      V(17, "E ao homem disse: “Porque você deu ouvidos à sua mulher e comeu da árvore da qual ordenei que não comesse, maldita é a terra por sua causa. Com muito sofrimento você comerá dela todos os dias da sua vida."),
      V(18, "Ela lhe dará espinhos e ervas daninhas, e você comerá as plantas do campo."),
      V(19, "Com o suor do seu rosto você comerá o seu pão, até voltar à terra, pois dela você foi tirado: você é pó, e ao pó voltará.”"),
      V(20, "O homem deu à sua mulher o nome de Eva, porque ela seria a mãe de todos os viventes."),
    ]},
    {"verses": [
      V(21, "O Senhor Deus fez roupas de pele para o homem e para a mulher, e os vestiu."),
      V(22, "Então o Senhor Deus disse: “Agora o ser humano se tornou como um de nós, conhecendo o bem e o mal. É preciso que ele não estenda a mão, tome também da árvore da vida, coma e viva para sempre.”"),
      V(23, "Por isso o Senhor Deus o expulsou do jardim do Éden, para cultivar a terra da qual tinha sido tirado."),
      V(24, "Depois de expulsar o ser humano, Deus colocou a leste do jardim do Éden querubins e uma espada flamejante que se movia em todas as direções, para guardar o caminho da árvore da vida."),
    ]},
  ],
}

CH["4"] = {
  "verses": 26,
  "summary": "Caim mata seu irmão Abel por inveja, e a maldade começa a se espalhar. Apesar disso, a linhagem de Sete volta a invocar o nome do Senhor.",
  "sections": [
    {"title": "Caim e Abel", "start": 1},
    {"title": "O castigo e a descendência de Caim", "start": 9},
    {"title": "Sete: uma nova esperança", "start": 25},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "O homem se uniu a Eva, sua mulher; ela engravidou e deu à luz Caim, e disse: “Com a ajuda do Senhor, ganhei um filho!”"),
      V(2, "Depois ela deu à luz o irmão dele, Abel. Abel se tornou pastor de ovelhas, e Caim, agricultor."),
      V(3, "Tempos depois, Caim trouxe do fruto da terra uma oferta ao Senhor."),
      V(4, "Abel também trouxe uma oferta: as melhores partes dos primeiros cordeirinhos nascidos do seu rebanho. O Senhor aceitou Abel e a sua oferta,"),
      V(5, "mas não aceitou Caim e a oferta dele. Caim ficou furioso, e o seu rosto se fechou."),
      V(6, "O Senhor perguntou a Caim: “Por que você está furioso? Por que o seu rosto se fechou?"),
      V(7, "Se fizer o que é certo, não será aceito? Mas se não fizer o que é certo, o pecado está à porta, à espreita, desejando dominá-lo. Cabe a você vencê-lo.”"),
      V(8, "Caim, porém, chamou Abel, seu irmão, para irem ao campo. Quando estavam lá, Caim atacou Abel e o matou."),
    ]},
    {"verses": [
      V(9, "O Senhor perguntou a Caim: “Onde está Abel, o seu irmão?” Ele respondeu: “Não sei. Por acaso sou o guarda do meu irmão?”"),
      V(10, "Deus disse: “O que foi que você fez? Da terra, a voz do sangue do seu irmão clama a mim."),
      V(11, "Agora você é maldito, expulso da terra que abriu a boca para receber da sua mão o sangue do seu irmão."),
      V(12, "Quando você cultivar a terra, ela não lhe dará mais a sua força. Você será um fugitivo errante pelo mundo.”"),
      V(13, "Caim respondeu: “O meu castigo é pesado demais para eu suportar!"),
      V(14, "Hoje me expulsas desta terra, e terei de me esconder da tua presença. Serei um fugitivo errante pelo mundo, e qualquer um que me encontrar vai querer me matar.”"),
      V(15, "Mas o Senhor respondeu: “Não! Quem matar Caim sofrerá vingança sete vezes.” E o Senhor colocou em Caim um sinal, para que ninguém que o encontrasse o matasse."),
      V(16, "Então Caim se afastou da presença do Senhor e passou a viver na terra de Node, a leste do Éden."),
    ]},
    {"verses": [
      V(17, "Caim se uniu à sua mulher; ela engravidou e deu à luz Enoque. Caim estava construindo uma cidade e deu a ela o nome do seu filho: Enoque."),
      V(18, "Enoque foi pai de Irade; Irade foi pai de Meujael; Meujael foi pai de Metusael; e Metusael foi pai de Lameque."),
      V(19, "Lameque tomou duas mulheres: uma se chamava Ada, e a outra, Zilá."),
      V(20, "Ada deu à luz Jabal, que foi o pai dos que vivem em tendas e criam rebanhos."),
      V(21, "O irmão dele se chamava Jubal, que foi o pai de todos os que tocam harpa e flauta."),
      V(22, "Zilá deu à luz Tubalcaim, forjador de todo tipo de ferramenta de bronze e de ferro. A irmã de Tubalcaim foi Naamá."),
      V(23, "Lameque disse às suas mulheres: “Ada e Zilá, ouçam a minha voz! Mulheres de Lameque, escutem o que eu digo: matei um homem porque me feriu, e um jovem porque me machucou."),
      V(24, "Se Caim é vingado sete vezes, Lameque o será setenta e sete vezes.”"),
    ]},
    {"verses": [
      V(25, "O homem se uniu de novo à sua mulher; ela deu à luz um filho e o chamou de Sete, dizendo: “Deus me deu outro descendente no lugar de Abel, que Caim matou.”"),
      V(26, "Sete também foi pai de um filho, e o chamou de Enos. Foi nessa época que se começou a invocar o nome do Senhor."),
    ]},
  ],
}

CH["5"] = {
  "verses": 32,
  "summary": "A lista das gerações de Adão até Noé mostra a propagação da vida — e da morte — entre os primeiros homens. No fim dela, brilha a esperança de Noé.",
  "sections": [
    {"title": "De Adão a Noé", "start": 1},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Este é o registro das gerações de Adão. Quando Deus criou o ser humano, ele o fez à semelhança de Deus."),
      V(2, "Homem e mulher ele os criou, os abençoou e, no dia em que foram criados, deu-lhes o nome de “ser humano”."),
      V(3, "Adão viveu cento e trinta anos e teve um filho à sua semelhança, conforme a sua imagem; e deu-lhe o nome de Sete."),
      V(4, "Depois do nascimento de Sete, Adão viveu mais oitocentos anos, e teve outros filhos e filhas."),
      V(5, "Adão viveu ao todo novecentos e trinta anos, e morreu."),
    ]},
    {"verses": [
      V(6, "Sete viveu cento e cinco anos e foi pai de Enos."),
      V(7, "Depois do nascimento de Enos, Sete viveu mais oitocentos e sete anos, e teve outros filhos e filhas."),
      V(8, "Sete viveu ao todo novecentos e doze anos, e morreu."),
      V(9, "Enos viveu noventa anos e foi pai de Cainã."),
      V(10, "Depois do nascimento de Cainã, Enos viveu mais oitocentos e quinze anos, e teve outros filhos e filhas."),
      V(11, "Enos viveu ao todo novecentos e cinco anos, e morreu."),
      V(12, "Cainã viveu setenta anos e foi pai de Maalalel."),
      V(13, "Depois do nascimento de Maalalel, Cainã viveu mais oitocentos e quarenta anos, e teve outros filhos e filhas."),
      V(14, "Cainã viveu ao todo novecentos e dez anos, e morreu."),
      V(15, "Maalalel viveu sessenta e cinco anos e foi pai de Jarede."),
      V(16, "Depois do nascimento de Jarede, Maalalel viveu mais oitocentos e trinta anos, e teve outros filhos e filhas."),
      V(17, "Maalalel viveu ao todo oitocentos e noventa e cinco anos, e morreu."),
      V(18, "Jarede viveu cento e sessenta e dois anos e foi pai de Enoque."),
      V(19, "Depois do nascimento de Enoque, Jarede viveu mais oitocentos anos, e teve outros filhos e filhas."),
      V(20, "Jarede viveu ao todo novecentos e sessenta e dois anos, e morreu."),
    ]},
    {"verses": [
      V(21, "Enoque viveu sessenta e cinco anos e foi pai de Matusalém."),
      V(22, "Depois do nascimento de Matusalém, Enoque andou com Deus por trezentos anos, e teve outros filhos e filhas."),
      V(23, "Enoque viveu ao todo trezentos e sessenta e cinco anos."),
      V(24, "Enoque andou com Deus; e já não estava mais, porque Deus o levou para junto de si."),
    ]},
    {"verses": [
      V(25, "Matusalém viveu cento e oitenta e sete anos e foi pai de Lameque."),
      V(26, "Depois do nascimento de Lameque, Matusalém viveu mais setecentos e oitenta e dois anos, e teve outros filhos e filhas."),
      V(27, "Matusalém viveu ao todo novecentos e sessenta e nove anos, e morreu."),
      V(28, "Lameque viveu cento e oitenta e dois anos e foi pai de um filho."),
      V(29, "E deu-lhe o nome de Noé, dizendo: “Este nos trará consolo no nosso trabalho e no esforço das nossas mãos, por causa da terra que o Senhor amaldiçoou.”"),
      V(30, "Depois do nascimento de Noé, Lameque viveu mais quinhentos e noventa e cinco anos, e teve outros filhos e filhas."),
      V(31, "Lameque viveu ao todo setecentos e setenta e sete anos, e morreu."),
      V(32, "Noé tinha quinhentos anos quando foi pai de Sem, Cam e Jafé."),
    ]},
  ],
}

CH["6"] = {
  "verses": 22,
  "summary": "A maldade humana se espalha e entristece o coração de Deus. Mas Noé encontra graça, e Deus o encarrega de construir a arca que salvará sua família e os animais.",
  "sections": [
    {"title": "A maldade do ser humano", "start": 1},
    {"title": "Deus manda construir a arca", "start": 9},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Quando os seres humanos começaram a se multiplicar sobre a terra, e lhes nasceram filhas,"),
      V(2, "os filhos de Deus viram que as filhas dos homens eram bonitas e tomaram para si mulheres entre todas as que escolheram."),
      V(3, "Então o Senhor disse: “O meu Espírito não contenderá para sempre com o ser humano, pois ele é carne; os dias dele serão cento e vinte anos.”"),
      V(4, "Naquele tempo — e também depois — havia gigantes na terra: quando os filhos de Deus se uniram às filhas dos homens, elas lhes deram filhos. Eles foram os heróis famosos da antiguidade."),
      V(5, "O Senhor viu que a maldade do ser humano tinha se multiplicado sobre a terra, e que todo desígnio do seu coração era sempre e somente o mal."),
      V(6, "O Senhor se entristeceu por ter feito o ser humano sobre a terra, e isso pesou em seu coração."),
      V(7, "E o Senhor disse: “Vou apagar da face da terra o ser humano que criei — e com ele os animais, os répteis e as aves do céu — pois me arrependo de tê-los feito.”"),
      V(8, "Mas Noé encontrou graça aos olhos do Senhor."),
    ]},
    {"verses": [
      V(9, "Esta é a história de Noé. Noé era um homem justo e íntegro em sua geração; Noé andava com Deus."),
      V(10, "Noé foi pai de três filhos: Sem, Cam e Jafé."),
      V(11, "A terra, porém, estava corrompida diante de Deus e cheia de violência."),
      V(12, "Deus olhou para a terra e viu que ela estava corrompida, pois toda a humanidade tinha corrompido o seu caminho sobre a terra."),
      V(13, "Então Deus disse a Noé: “Decidi dar fim a toda a humanidade, porque por causa dela a terra se encheu de violência. Vou destruí-los junto com a terra."),
      V(14, "Faça para você uma arca de madeira de cipreste, com compartimentos, e a revista com piche por dentro e por fora."),
      V(15, "Faça-a assim: cento e trinta e cinco metros de comprimento, vinte e dois e meio de largura e treze e meio de altura."),
      V(16, "Faça uma abertura de quarenta e cinco centímetros abaixo do teto, uma porta na lateral e três andares: inferior, médio e superior."),
      V(17, "Vou trazer o dilúvio sobre a terra, para destruir debaixo do céu toda criatura que tem fôlego de vida. Tudo o que há na terra morrerá."),
      V(18, "Mas com você eu estabeleço a minha aliança: entre na arca com os seus filhos, a sua mulher e as mulheres dos seus filhos."),
      V(19, "De cada ser vivo, de cada espécie de animal, faça entrar na arca um casal, para que sobrevivam com você: um macho e uma fêmea."),
      V(20, "De cada espécie de ave, de cada espécie de animal doméstico, de cada espécie de animal que rasteja pelo chão, virá a você um casal, para que sobrevivam."),
      V(21, "Junte também todo tipo de alimento e guarde-o com você; será o sustento para você e para eles.”"),
      V(22, "Noé fez tudo exatamente como Deus lhe tinha ordenado."),
    ]},
  ],
}

CH["7"] = {
  "verses": 24,
  "summary": "Noé e sua família entram na arca com os animais, e o dilúvio cobre toda a terra. Somente os que estavam dentro da arca sobrevivem.",
  "sections": [
    {"title": "A entrada na arca", "start": 1},
    {"title": "O dilúvio", "start": 11},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "O Senhor disse a Noé: “Entre na arca com toda a sua família, porque você é o único justo que vejo nesta geração."),
      V(2, "Leve com você sete casais de cada animal puro, macho e fêmea, e um casal de cada animal impuro, macho e fêmea;"),
      V(3, "e também sete casais de cada espécie de ave, macho e fêmea, para preservar as espécies sobre toda a terra."),
      V(4, "Pois daqui a sete dias farei chover sobre a terra durante quarenta dias e quarenta noites, e apagarei da face da terra todo ser vivo que criei.”"),
      V(5, "Noé fez tudo o que o Senhor lhe ordenou."),
      V(6, "Noé tinha seiscentos anos quando o dilúvio veio sobre a terra."),
      V(7, "Noé entrou na arca com os seus filhos, a sua mulher e as mulheres dos seus filhos, para escapar das águas do dilúvio."),
      V(8, "Os animais puros e os impuros, as aves e todos os animais que rastejam pelo chão"),
      V(9, "foram até Noé e entraram na arca, em casais, macho e fêmea, como Deus tinha ordenado."),
      V(10, "E, depois dos sete dias, as águas do dilúvio vieram sobre a terra."),
    ]},
    {"verses": [
      V(11, "No ano seiscentos da vida de Noé, no décimo sétimo dia do segundo mês, todas as fontes do grande abismo se romperam, e as comportas do céu se abriram."),
      V(12, "A chuva caiu sobre a terra durante quarenta dias e quarenta noites."),
      V(13, "Naquele mesmo dia, Noé entrou na arca com seus filhos Sem, Cam e Jafé, a sua mulher e as três mulheres dos seus filhos."),
      V(14, "Com eles entraram todos os animais selvagens, todos os animais domésticos, todos os animais que rastejam pelo chão e todas as aves — tudo o que voa."),
      V(15, "Foram até Noé e entraram na arca, em casais, de toda criatura que tem fôlego de vida."),
      V(16, "Entraram macho e fêmea de cada espécie, como Deus tinha ordenado a Noé. Então o Senhor fechou a porta."),
      V(17, "O dilúvio durou quarenta dias sobre a terra. As águas subiram e levantaram a arca, que ficou acima da terra."),
      V(18, "As águas cresceram e aumentaram muito sobre a terra, e a arca flutuava sobre a superfície das águas."),
      V(19, "As águas subiram tanto que cobriram todas as montanhas altas que existiam debaixo do céu."),
      V(20, "Subiram sete metros acima dos picos mais altos."),
      V(21, "E morreram todos os seres vivos que se moviam sobre a terra: as aves, os animais domésticos, os animais selvagens, todos os animais que se arrastam pelo chão e toda a humanidade."),
      V(22, "Tudo o que tinha o fôlego do espírito de vida nas narinas, tudo o que vivia em terra seca, morreu."),
      V(23, "Deus apagou todo ser vivo que havia sobre a face da terra: desde o ser humano até os animais domésticos, os répteis e as aves do céu. Todos foram apagados da terra. Somente Noé sobreviveu, e os que estavam com ele na arca."),
      V(24, "As águas dominaram a terra durante cento e cinquenta dias."),
    ]},
  ],
}

CH["8"] = {
  "verses": 22,
  "summary": "As águas baixam, Noé solta a pomba para verificar se a terra secou e, finalmente, sai da arca e oferece um sacrifício. Deus promete nunca mais amaldiçoar a terra dessa forma.",
  "sections": [
    {"title": "O fim do dilúvio", "start": 1},
    {"title": "Noé sai da arca", "start": 15},
    {"title": "A promessa de Deus", "start": 20},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Deus se lembrou de Noé, de todos os animais selvagens e de todos os animais domésticos que estavam com ele na arca. Deus fez soprar um vento sobre a terra, e as águas começaram a baixar."),
      V(2, "As fontes do abismo e as comportas do céu se fecharam, e a chuva cessou."),
      V(3, "As águas foram recuando aos poucos de sobre a terra. Depois de cento e cinquenta dias, as águas tinham baixado,"),
      V(4, "e, no décimo sétimo dia do sétimo mês, a arca pousou sobre as montanhas de Ararate."),
      V(5, "As águas continuaram baixando até o décimo mês; e, no primeiro dia do décimo mês, apareceram os picos das montanhas."),
    ]},
    {"verses": [
      V(6, "Ao fim de quarenta dias, Noé abriu a janela que tinha feito na arca"),
      V(7, "e soltou um corvo, que ficou voando de um lado para o outro, até que as águas secassem sobre a terra."),
      V(8, "Depois soltou uma pomba, para ver se as águas já tinham baixado da superfície da terra."),
      V(9, "Mas a pomba não encontrou lugar para pousar os pés e voltou para a arca, porque as águas ainda cobriam a terra. Noé estendeu a mão, pegou a pomba e a trouxe de volta para dentro da arca."),
      V(10, "Esperou mais sete dias e soltou a pomba outra vez."),
      V(11, "Ao entardecer, a pomba voltou trazendo no bico uma folha nova de oliveira. Assim Noé soube que as águas tinham baixado sobre a terra."),
      V(12, "Esperou ainda mais sete dias e soltou a pomba de novo; desta vez, ela não voltou."),
      V(13, "No ano seiscentos e um da vida de Noé, no primeiro dia do primeiro mês, as águas tinham secado sobre a terra. Noé removeu a cobertura da arca, olhou e viu que a superfície da terra estava seca."),
      V(14, "No vigésimo sétimo dia do segundo mês, a terra já estava seca."),
    ]},
    {"verses": [
      V(15, "Então Deus disse a Noé:"),
      V(16, "“Saia da arca com a sua mulher, os seus filhos e as mulheres dos seus filhos."),
      V(17, "Traga para fora também todos os animais que estão com você: as aves, os animais domésticos e todos os animais que rastejam pelo chão. Que eles se espalhem pela terra, sejam férteis e se multipliquem.”"),
      V(18, "Noé saiu da arca com os seus filhos, a sua mulher e as mulheres dos seus filhos."),
      V(19, "E saíram também todos os animais, todos os répteis e todas as aves — tudo o que se move sobre a terra, cada espécie por si."),
    ]},
    {"verses": [
      V(20, "Noé construiu um altar ao Senhor, tomou de cada animal puro e de cada ave pura e os ofereceu como holocausto sobre o altar."),
      V(21, "O Senhor sentiu o aroma agradável e disse no seu coração: “Nunca mais amaldiçoarei a terra por causa do ser humano, pois o coração do ser humano se inclina para o mal desde a infância. E nunca mais destruirei todo ser vivo, como acabei de fazer."),
      V(22, "Enquanto a terra durar, semeadura e colheita, frio e calor, verão e inverno, dia e noite jamais cessarão.”"),
    ]},
  ],
}

CH["9"] = {
  "verses": 29,
  "summary": "Deus faz aliança com Noé e põe o arco-íris como sinal. Mas a história também registra a embriaguez de Noé, a zombaria de Cam e a bênção sobre Sem e Jafé.",
  "sections": [
    {"title": "A aliança de Deus com Noé", "start": 1},
    {"title": "O arco-íris, sinal da aliança", "start": 8},
    {"title": "Os filhos de Noé", "start": 18},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Deus abençoou Noé e seus filhos, dizendo: “Sejam férteis, multipliquem-se e encham a terra."),
      V(2, "Todos os animais da terra, as aves do céu, os répteis e os peixes do mar terão medo e temor de vocês; todos estão entregues nas mãos de vocês."),
      V(3, "Tudo o que se move e tem vida servirá de alimento para vocês. Assim como dei a vocês as plantas verdes, agora dou tudo."),
      V(4, "Mas não comam carne com a vida, isto é, com o sangue."),
      V(5, "E do sangue de vocês, da vida de vocês, eu pedirei contas: pedirei contas de todo animal, e pedirei contas do ser humano — do irmão, pedirei contas da vida do ser humano."),
      V(6, "Quem derramar sangue humano, terá o seu sangue derramado por mãos humanas, pois o ser humano foi feito à imagem de Deus."),
      V(7, "Quanto a vocês, sejam férteis e se multipliquem; espalhem-se pela terra e dominem nela.”"),
    ]},
    {"verses": [
      V(8, "Deus disse a Noé e a seus filhos:"),
      V(9, "“Eu estabeleço a minha aliança com vocês e com os descendentes de vocês,"),
      V(10, "e com todo ser vivo que está com vocês: as aves, os animais domésticos e todos os animais selvagens que saíram da arca."),
      V(11, "Esta é a minha aliança: nunca mais toda criatura será destruída pelas águas de um dilúvio; nunca mais haverá dilúvio para destruir a terra.”"),
      V(12, "Deus continuou: “Este é o sinal da aliança que faço com vocês e com todos os seres vivos, por todas as gerações futuras:"),
      V(13, "o meu arco que coloquei nas nuvens. Ele será o sinal da aliança entre mim e a terra."),
      V(14, "Quando eu trouxer nuvens sobre a terra e o arco aparecer nas nuvens,"),
      V(15, "então me lembrarei da minha aliança com vocês e com todos os seres vivos: as águas nunca mais se tornarão um dilúvio para destruir toda criatura."),
      V(16, "Quando o arco estiver nas nuvens, eu o verei e me lembrarei da aliança eterna entre Deus e todos os seres vivos que há sobre a terra.”"),
      V(17, "E Deus disse a Noé: “Este é o sinal da aliança que estabeleço entre mim e toda criatura que vive sobre a terra.”"),
    ]},
    {"verses": [
      V(18, "Os filhos de Noé que saíram da arca foram Sem, Cam e Jafé — Cam é o pai de Canaã."),
      V(19, "Esses três foram os filhos de Noé, e a partir deles toda a terra foi povoada."),
      V(20, "Noé, que era agricultor, foi o primeiro a plantar uma vinha."),
      V(21, "Bebeu do vinho, embriagou-se e ficou nu dentro da sua tenda."),
      V(22, "Cam, o pai de Canaã, viu o pai nu e saiu para contar aos dois irmãos."),
      V(23, "Então Sem e Jafé pegaram uma capa, puseram-na sobre os próprios ombros, entraram de costas e cobriram a nudez do pai. Os rostos estavam virados para o outro lado, de modo que não viram o pai nu."),
      V(24, "Quando Noé acordou da embriaguez e soube o que o filho mais novo tinha feito,"),
      V(25, "disse: “Maldito seja Canaã! Que ele seja o escravo dos escravos dos seus irmãos.”"),
      V(26, "E acrescentou: “Bendito seja o Senhor, o Deus de Sem! E que Canaã seja o escravo de Sem."),
      V(27, "Que Deus amplie o território de Jafé; que ele habite nas tendas de Sem, e que Canaã seja o escravo dele.”"),
      V(28, "Depois do dilúvio, Noé viveu trezentos e cinquenta anos."),
      V(29, "Noé viveu ao todo novecentos e cinquenta anos, e morreu."),
    ]},
  ],
}

CH["10"] = {
  "verses": 32,
  "summary": "A tabela das nações: os descendentes dos três filhos de Noé se espalham e formam os povos da terra.",
  "sections": [
    {"title": "Os descendentes de Jafé", "start": 2},
    {"title": "Os descendentes de Cam", "start": 6},
    {"title": "Os descendentes de Sem", "start": 21},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Estes são os descendentes de Sem, Cam e Jafé, os filhos de Noé, que tiveram filhos depois do dilúvio."),
    ]},
    {"verses": [
      V(2, "Os filhos de Jafé: Gômer, Magogue, Madai, Javã, Tubal, Meseque e Tirás."),
      V(3, "Os filhos de Gômer: Asquenaz, Rifate e Togarma."),
      V(4, "Os filhos de Javã: Elisá, Társis, Quitim e Dodanim."),
      V(5, "A partir deles se espalharam os povos das ilhas e das terras costeiras, cada um na sua terra, com a sua língua, segundo as suas famílias e nações."),
    ]},
    {"verses": [
      V(6, "Os filhos de Cam: Cuxe, Mizraim, Pute e Canaã."),
      V(7, "Os filhos de Cuxe: Sebá, Havilá, Sabtá, Raamá e Sabtecá. Os filhos de Raamá: Sabá e Dedã."),
      V(8, "Cuxe também foi pai de Ninrode, que foi o primeiro homem poderoso da terra."),
      V(9, "Ele foi um grande caçador diante do Senhor; por isso se diz: “Grande caçador diante do Senhor, como Ninrode.”"),
      V(10, "O início do seu reino foi Babel, Ereque, Acade e Calné, na terra de Sinar."),
      V(11, "Daquela terra ele partiu para a Assíria, onde construiu Nínive, Reobote-Ir, Calá"),
      V(12, "e Resém, a grande cidade que fica entre Nínive e Calá."),
      V(13, "Mizraim foi pai dos luditas, dos anamitas, dos leabitas, dos naftuítas,"),
      V(14, "dos patrusitas, dos casluítas — de quem descendem os filisteus — e dos caftoritas."),
      V(15, "Canaã foi pai de Sidom, seu filho mais velho, e de Hete,"),
      V(16, "e também dos jebuseus, dos amorreus, dos girgaseus,"),
      V(17, "dos heveus, dos arqueus, dos sineus,"),
      V(18, "dos arvadeus, dos zemareus e dos hamateus. Depois as famílias dos cananeus se espalharam,"),
      V(19, "e a fronteira dos cananeus ia de Sidom, na direção de Gerar, até Gaza; e, na direção de Sodoma, Gomorra, Admá e Zeboim, até Lasa."),
      V(20, "Esses foram os descendentes de Cam, segundo as suas famílias e línguas, nas suas terras e nações."),
    ]},
    {"verses": [
      V(21, "Sem, o irmão mais velho de Jafé, também teve filhos. Sem foi o antepassado de todos os filhos de Éber."),
      V(22, "Os filhos de Sem: Elão, Assur, Arfaxade, Lude e Arã."),
      V(23, "Os filhos de Arã: Uz, Hul, Geter e Meseque."),
      V(24, "Arfaxade foi pai de Selá, e Selá foi pai de Éber."),
      V(25, "Éber teve dois filhos: um se chamava Pelegue, porque em sua época a terra foi dividida; e o irmão dele se chamava Joctã."),
      V(26, "Joctã foi pai de Almodá, Selefe, Hazarmavé, Jerá,"),
      V(27, "Hadorão, Uzal, Dicla,"),
      V(28, "Obal, Abimael, Sabá,"),
      V(29, "Ofir, Havilá e Jobabe. Todos esses foram filhos de Joctã."),
      V(30, "Eles habitavam desde Messa, na direção de Sefar, até a montanha do oriente."),
      V(31, "Esses foram os descendentes de Sem, segundo as suas famílias e línguas, nas suas terras e nações."),
      V(32, "Essas foram as famílias dos filhos de Noé, segundo as suas gerações e nações. A partir deles, as nações se espalharam pela terra depois do dilúvio."),
    ]},
  ],
}

CH["11"] = {
  "verses": 32,
  "summary": "A torre de Babel revela a soberba humana — e Deus confunde as línguas e espalha os povos. A linhagem de Sem conduz até Abraão, o homem a quem Deus chamará.",
  "sections": [
    {"title": "A torre de Babel", "start": 1},
    {"title": "De Sem a Abraão", "start": 10},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Naquele tempo, toda a terra falava uma só língua e usava as mesmas palavras."),
      V(2, "Quando os homens migraram do oriente, encontraram uma planície na terra de Sinar e se estabeleceram ali."),
      V(3, "Disseram uns aos outros: “Vamos fazer tijolos e cozê-los no fogo.” Usaram tijolos em lugar de pedras, e piche em lugar de argamassa."),
      V(4, "E disseram: “Vamos construir uma cidade e uma torre cujo topo chegue ao céu. Assim ficaremos famosos e não seremos espalhados pela face da terra.”"),
      V(5, "O Senhor desceu para ver a cidade e a torre que os homens estavam construindo."),
      V(6, "E o Senhor disse: “Eles são um só povo e falam uma só língua; se começaram a fazer isso, nada do que planejarem lhes será impossível."),
      V(7, "Vamos descer e confundir a língua deles, para que um não entenda mais o que o outro diz.”"),
      V(8, "Assim o Senhor os espalhou dali por toda a terra, e eles pararam de construir a cidade."),
      V(9, "Por isso ela foi chamada de Babel — porque ali o Senhor confundiu a língua de toda a terra, e dali o Senhor os espalhou por toda a superfície da terra."),
    ]},
    {"verses": [
      V(10, "Este é o registro das gerações de Sem. Dois anos depois do dilúvio, quando Sem tinha cem anos, ele foi pai de Arfaxade."),
      V(11, "Depois do nascimento de Arfaxade, Sem viveu mais quinhentos anos, e teve outros filhos e filhas."),
      V(12, "Arfaxade viveu trinta e cinco anos e foi pai de Selá."),
      V(13, "Depois do nascimento de Selá, Arfaxade viveu mais quatrocentos e três anos, e teve outros filhos e filhas."),
      V(14, "Selá viveu trinta anos e foi pai de Éber."),
      V(15, "Depois do nascimento de Éber, Selá viveu mais quatrocentos e três anos, e teve outros filhos e filhas."),
      V(16, "Éber viveu trinta e quatro anos e foi pai de Pelegue."),
      V(17, "Depois do nascimento de Pelegue, Éber viveu mais quatrocentos e trinta anos, e teve outros filhos e filhas."),
      V(18, "Pelegue viveu trinta anos e foi pai de Reú."),
      V(19, "Depois do nascimento de Reú, Pelegue viveu mais duzentos e nove anos, e teve outros filhos e filhas."),
      V(20, "Reú viveu trinta e dois anos e foi pai de Serugue."),
      V(21, "Depois do nascimento de Serugue, Reú viveu mais duzentos e sete anos, e teve outros filhos e filhas."),
      V(22, "Serugue viveu trinta anos e foi pai de Naor."),
      V(23, "Depois do nascimento de Naor, Serugue viveu mais duzentos anos, e teve outros filhos e filhas."),
      V(24, "Naor viveu vinte e nove anos e foi pai de Terá."),
      V(25, "Depois do nascimento de Terá, Naor viveu mais cento e dezenove anos, e teve outros filhos e filhas."),
      V(26, "Terá viveu setenta anos e foi pai de Abrão, Naor e Harã."),
    ]},
    {"verses": [
      V(27, "Este é o registro das gerações de Terá. Terá foi pai de Abrão, Naor e Harã. E Harã foi pai de Ló."),
      V(28, "Harã morreu antes de seu pai Terá, na terra onde nasceu, em Ur dos caldeus."),
      V(29, "Abrão e Naor se casaram. A mulher de Abrão se chamava Sarai, e a mulher de Naor, Milca, filha de Harã — que foi pai de Milca e de Iscá."),
      V(30, "Sarai era estéril; não tinha filhos."),
      V(31, "Terá tomou Abrão, seu filho; Ló, filho de Harã, seu neto; e Sarai, sua nora, mulher de Abrão. E partiram juntos de Ur dos caldeus rumo à terra de Canaã. Chegaram a Harã e se estabeleceram ali."),
      V(32, "Terá viveu duzentos e cinco anos, e morreu em Harã."),
    ]},
  ],
}

CH["12"] = {
  "verses": 20,
  "summary": "Deus chama Abrão com uma promessa grandiosa: dele viria uma grande nação, e nele todas as famílias da terra seriam abençoadas. Abrão obedece e parte. No Egito, por medo, apresenta Sarai como irmã.",
  "sections": [
    {"title": "O chamado de Abrão", "start": 1},
    {"title": "Abrão no Egito", "start": 10},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "O Senhor disse a Abrão: “Saia da sua terra, do meio dos seus parentes e da casa do seu pai, e vá para a terra que eu vou lhe mostrar."),
      V(2, "Eu farei de você uma grande nação, o abençoarei e engrandecerei o seu nome; e você será uma bênção."),
      V(3, "Abençoarei os que o abençoarem e amaldiçoarei os que o amaldiçoarem; e, por meio de você, todas as famílias da terra serão abençoadas.”"),
      V(4, "Abrão partiu, como o Senhor lhe tinha ordenado, e Ló foi com ele. Abrão tinha setenta e cinco anos quando saiu de Harã."),
      V(5, "Ele levou consigo Sarai, sua mulher, Ló, seu sobrinho, todos os bens que tinham acumulado e as pessoas que tinham adquirido em Harã. Partiram rumo à terra de Canaã, e lá chegaram."),
      V(6, "Abrão atravessou a terra até o lugar de Siquém, até o carvalho de Moré. Naquele tempo, os cananeus habitavam a terra."),
      V(7, "O Senhor apareceu a Abrão e disse: “Darei esta terra à sua descendência.” Ali Abrão construiu um altar ao Senhor, que tinha aparecido a ele."),
      V(8, "De lá, Abrão foi para a região montanhosa a leste de Betel, armou a sua tenda — com Betel a oeste e Ai a leste — e construiu ali um altar ao Senhor, invocando o seu nome."),
      V(9, "Depois Abrão partiu de novo, avançando cada vez mais para o sul."),
    ]},
    {"verses": [
      V(10, "Houve fome na terra, e Abrão desceu ao Egito para morar lá por um tempo, pois a fome era severa."),
      V(11, "Quando estava chegando ao Egito, disse a Sarai, sua mulher: “Sei muito bem que você é uma mulher bonita."),
      V(12, "Quando os egípcios a virem, dirão: ‘Essa é a mulher dele’ — e vão me matar, deixando você viva."),
      V(13, "Diga, por favor, que é minha irmã, para que eu seja bem tratado por sua causa e a minha vida seja poupada.”"),
      V(14, "Quando Abrão chegou ao Egito, os egípcios viram que a mulher era muito bonita."),
      V(15, "Os oficiais do faraó a viram e a elogiaram diante dele; e a mulher foi levada para o palácio do faraó."),
      V(16, "Por causa dela, o faraó tratou bem Abrão: ele recebeu ovelhas, bois, jumentos, servos e servas, jumentas e camelos."),
      V(17, "Mas o Senhor castigou o faraó e a sua casa com pragas terríveis, por causa de Sarai, mulher de Abrão."),
      V(18, "O faraó chamou Abrão e perguntou: “O que foi que você fez comigo? Por que não me disse que ela é a sua mulher?"),
      V(19, "Por que disse: ‘É minha irmã’? Por isso eu a tomei para ser minha mulher. Agora, aqui está a sua mulher: tome-a e vá embora.”"),
      V(20, "O faraó deu ordens aos seus homens a respeito de Abrão, e eles o despediram com a mulher e com tudo o que ele possuía."),
    ]},
  ],
}

CH["13"] = {
  "verses": 18,
  "summary": "Abrão e Ló se separam para evitar conflitos; Ló escolhe as campinas férteis do Jordão. Deus renova a promessa da terra e da descendência a Abrão.",
  "sections": [
    {"title": "A separação de Abrão e Ló", "start": 1},
    {"title": "A promessa renovada", "start": 14},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Abrão saiu do Egito com a mulher, com tudo o que possuía e com Ló, e subiu para o Neguebe."),
      V(2, "Abrão era muito rico em rebanhos, prata e ouro."),
      V(3, "Ele viajou por etapas do Neguebe até Betel, até o lugar onde tinha armado a sua tenda antes, entre Betel e Ai,"),
      V(4, "no lugar do altar que tinha construído ali. E Abrão invocou o nome do Senhor."),
      V(5, "Ló, que acompanhava Abrão, também tinha rebanhos, gado e tendas."),
      V(6, "A terra não era suficiente para os dois morarem juntos, porque os bens deles eram muitos demais; já não podiam viver juntos."),
      V(7, "Surgiu uma discussão entre os pastores dos rebanhos de Abrão e os de Ló. Naquele tempo, os cananeus e os ferezeus habitavam a terra."),
      V(8, "Então Abrão disse a Ló: “Que não haja briga entre mim e você, nem entre os meus pastores e os seus, porque somos parentes."),
      V(9, "A terra inteira está diante de você. Por favor, separe-se de mim: se você for para a esquerda, eu vou para a direita; se você for para a direita, eu vou para a esquerda.”"),
      V(10, "Ló olhou e viu que toda a campina do Jordão, na direção de Zoar, era bem irrigada — como o jardim do Senhor, como a terra do Egito. Isso foi antes de o Senhor destruir Sodoma e Gomorra."),
      V(11, "Ló escolheu para si toda a campina do Jordão e partiu para o oriente. Assim os dois se separaram:"),
      V(12, "Abrão ficou na terra de Canaã, e Ló passou a morar nas cidades da campina, armando as suas tendas até Sodoma."),
      V(13, "Ora, os homens de Sodoma eram maus e pecavam muito contra o Senhor."),
    ]},
    {"verses": [
      V(14, "Depois que Ló se separou dele, o Senhor disse a Abrão: “Levante os olhos e olhe do lugar onde você está para o norte, para o sul, para o leste e para o oeste:"),
      V(15, "toda a terra que você vê eu darei a você e à sua descendência, para sempre."),
      V(16, "Tornarei a sua descendência como o pó da terra: se alguém puder contar o pó da terra, então poderá contar a sua descendência."),
      V(17, "Levante-se e percorra a terra de ponta a ponta, porque eu a darei a você.”"),
      V(18, "Então Abrão mudou as suas tendas e foi morar junto aos carvalhos de Manre, em Hebrom, e ali construiu um altar ao Senhor."),
    ]},
  ],
}

CH["14"] = {
  "verses": 24,
  "summary": "Quatro reis invadem a região e levam Ló prisioneiro. Abrão reúne seus homens, resgata Ló e é abençoado por Melquisedeque, rei e sacerdote de Salém.",
  "sections": [
    {"title": "A guerra dos reis", "start": 1},
    {"title": "Abrão resgata Ló", "start": 13},
    {"title": "Melquisedeque abençoa Abrão", "start": 17},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Naquele tempo, Anrafel, rei de Sinar, Arioque, rei de Elasar, Quedorlaomer, rei de Elão, e Tidal, rei de Goim,"),
      V(2, "entraram em guerra contra Bera, rei de Sodoma, Birsa, rei de Gomorra, Sinabe, rei de Admá, Semeber, rei de Zeboim, e o rei de Bela, que é Zoar."),
      V(3, "Todos esses últimos se juntaram no vale de Sidim, que é o mar Salgado."),
      V(4, "Durante doze anos eles tinham servido a Quedorlaomer, mas no décimo terceiro ano se rebelaram."),
      V(5, "No décimo quarto ano, Quedorlaomer veio com os reis que estavam com ele e derrotou os refains em Asterote-Carnaim, os zuzins em Hã, os emins em Savé-Quiriataim"),
      V(6, "e os horeus nos montes de Seir, até El-Parã, que fica perto do deserto."),
      V(7, "Depois voltaram e foram a En-Mispate, que é Cades, e conquistaram todo o território dos amalequitas e também dos amorreus que moravam em Hazazom-Tamar."),
      V(8, "Então os reis de Sodoma, Gomorra, Admá, Zeboim e Bela, que é Zoar, saíram e se prepararam para a batalha no vale de Sidim,"),
      V(9, "contra Quedorlaomer, rei de Elão, Tidal, rei de Goim, Anrafel, rei de Sinar, e Arioque, rei de Elasar: quatro reis contra cinco."),
      V(10, "O vale de Sidim estava cheio de poços de piche; quando os reis de Sodoma e Gomorra fugiram, muitos caíram neles, e os que sobraram fugiram para os montes."),
      V(11, "Os vencedores levaram todos os bens de Sodoma e Gomorra e todo o seu mantimento, e foram embora."),
      V(12, "Levaram também Ló, sobrinho de Abrão, que morava em Sodoma, com tudo o que ele possuía."),
    ]},
    {"verses": [
      V(13, "Um dos sobreviventes veio contar tudo a Abrão, o hebreu, que morava junto aos carvalhos de Manre, o amorreu, irmão de Escol e de Aner, aliados de Abrão."),
      V(14, "Quando Abrão soube que o seu parente tinha sido levado prisioneiro, reuniu os trezentos e dezoito homens treinados que tinham nascido em sua casa e saiu em perseguição até Dã."),
      V(15, "Durante a noite, dividiu os seus homens em grupos, atacou os inimigos e os perseguiu até Hobá, ao norte de Damasco."),
      V(16, "Recuperou todos os bens e trouxe de volta Ló, seu parente, com tudo o que ele possuía, e também as mulheres e o povo."),
    ]},
    {"verses": [
      V(17, "Quando Abrão voltava, depois de derrotar Quedorlaomer e os reis que estavam com ele, o rei de Sodoma saiu ao seu encontro no vale de Savé, que é o vale do Rei."),
      V(18, "Melquisedeque, rei de Salém, trouxe pão e vinho — ele era sacerdote do Deus Altíssimo —"),
      V(19, "e abençoou Abrão, dizendo: “Bendito seja Abrão pelo Deus Altíssimo, criador dos céus e da terra!"),
      V(20, "E bendito seja o Deus Altíssimo, que entregou os seus inimigos nas suas mãos!” E Abrão lhe deu o dízimo de tudo."),
      V(21, "O rei de Sodoma disse a Abrão: “Dê-me as pessoas, e fique com os bens.”"),
      V(22, "Mas Abrão respondeu ao rei de Sodoma: “Levantei a minha mão ao Senhor, o Deus Altíssimo, criador dos céus e da terra,"),
      V(23, "jurando que não pegarei nada do que é seu — nem um fio, nem uma correia de sandália — para que você nunca diga: ‘Eu enriqueci Abrão’."),
      V(24, "Não quero nada para mim, exceto o que os meus homens já comeram e a parte dos que foram comigo: Aner, Escol e Manre. Que eles recebam a parte deles.”"),
    ]},
  ],
}

CH["15"] = {
  "verses": 21,
  "summary": "Deus promete a Abrão um herdeiro e uma descendência incontável. Abrão crê — e isso lhe é contado como justiça. A promessa é selada com uma aliança solene.",
  "sections": [
    {"title": "A promessa de um herdeiro", "start": 1},
    {"title": "A aliança de Deus com Abrão", "start": 7},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Depois desses acontecimentos, a palavra do Senhor veio a Abrão numa visão: “Não tenha medo, Abrão. Eu sou o seu escudo; a sua recompensa será muito grande.”"),
      V(2, "Mas Abrão respondeu: “Senhor Deus, o que me darás, se continuo sem filhos? O herdeiro da minha casa é Eliézer de Damasco.”"),
      V(3, "E acrescentou: “Não me deste descendência; por isso, um servo nascido na minha casa será o meu herdeiro.”"),
      V(4, "Então a palavra do Senhor veio a ele: “Não será esse o seu herdeiro. Um filho que sair do seu próprio corpo é que será o seu herdeiro.”"),
      V(5, "Deus o levou para fora e disse: “Olhe para o céu e conte as estrelas, se puder contá-las. Assim será a sua descendência.”"),
      V(6, "Abrão confiou no Senhor, e isso lhe foi contado como justiça."),
    ]},
    {"verses": [
      V(7, "O Senhor também lhe disse: “Eu sou o Senhor, que tirei você de Ur dos caldeus para lhe dar esta terra como herança.”"),
      V(8, "Abrão perguntou: “Senhor Deus, como saberei que vou herdá-la?”"),
      V(9, "O Senhor respondeu: “Traga-me uma novilha de três anos, uma cabra de três anos, um carneiro de três anos, uma rolinha e um pombinho.”"),
      V(10, "Abrão trouxe todos esses animais, cortou-os ao meio e colocou as metades umas em frente às outras; as aves, porém, não cortou."),
      V(11, "Aves de rapina desciam sobre os cadáveres, mas Abrão as afugentava."),
      V(12, "Ao pôr do sol, um sono profundo caiu sobre Abrão, e um terror grande e escuro o dominou."),
      V(13, "Então o Senhor lhe disse: “Saiba com certeza que a sua descendência será estrangeira numa terra que não é sua, será escravizada e oprimida por quatrocentos anos."),
      V(14, "Mas eu julgarei a nação à qual eles servirão; e, depois disso, sairão com muitos bens."),
      V(15, "Quanto a você, irá em paz para junto dos seus antepassados e será sepultado numa boa velhice."),
      V(16, "Na quarta geração, a sua descendência voltará para cá, porque a maldade dos amorreus ainda não atingiu a sua medida.”"),
      V(17, "Quando o sol se pôs e veio a escuridão, um braseiro fumegante e uma tocha acesa passaram entre as metades dos animais."),
      V(18, "Naquele dia, o Senhor fez aliança com Abrão, dizendo: “À sua descendência dou esta terra, desde o rio do Egito até o grande rio, o Eufrates:"),
      V(19, "a terra dos queneus, dos quenezeus, dos cadmoneus,"),
      V(20, "dos heteus, dos ferezeus, dos refains,"),
      V(21, "dos amorreus, dos cananeus, dos girgaseus e dos jebuseus.”"),
    ]},
  ],
}

CH["16"] = {
  "verses": 16,
  "summary": "Sarai, impaciente, entrega sua serva Agar a Abrão. Agar engravida e é maltratada, foge — e Deus a encontra no deserto, prometendo um futuro ao filho que ela carrega: Ismael.",
  "sections": [
    {"title": "Agar e Ismael", "start": 1},
    {"title": "Deus encontra Agar no deserto", "start": 7},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Sarai, mulher de Abrão, não lhe tinha dado filhos. Mas ela tinha uma serva egípcia chamada Agar."),
      V(2, "Sarai disse a Abrão: “O Senhor me impediu de ter filhos. Por favor, deite-se com a minha serva; talvez eu possa ter filhos por meio dela.” Abrão concordou com a proposta de Sarai."),
      V(3, "Então Sarai, mulher de Abrão, tomou Agar, a egípcia, sua serva — dez anos depois de Abrão ter chegado à terra de Canaã — e a entregou a Abrão, seu marido, como mulher."),
      V(4, "Ele se deitou com Agar, e ela engravidou. Quando percebeu que estava grávida, começou a desprezar a sua senhora."),
      V(5, "Sarai disse a Abrão: “A ofensa que estou sofrendo é culpa sua! Entreguei a minha serva nos seus braços e, agora que ela viu que está grávida, me despreza. Que o Senhor julgue entre mim e você.”"),
      V(6, "Abrão respondeu: “A sua serva está nas suas mãos; faça com ela o que achar melhor.” Sarai passou a maltratá-la, e Agar fugiu."),
    ]},
    {"verses": [
      V(7, "O Anjo do Senhor a encontrou junto a uma fonte no deserto, no caminho de Sur,"),
      V(8, "e perguntou: “Agar, serva de Sarai, de onde você vem e para onde vai?” Ela respondeu: “Estou fugindo de Sarai, a minha senhora.”"),
      V(9, "O Anjo do Senhor lhe disse: “Volte para a sua senhora e humilhe-se diante dela.”"),
      V(10, "E acrescentou: “Multiplicarei tanto a sua descendência, que ninguém poderá contá-la.”"),
      V(11, "O Anjo do Senhor continuou: “Você está grávida e dará à luz um filho, a quem chamará Ismael, porque o Senhor ouviu a sua aflição."),
      V(12, "Ele será como um jumento selvagem: a sua mão será contra todos, e a mão de todos contra ele; e viverá em hostilidade contra todos os seus irmãos.”"),
      V(13, "Então Agar deu este nome ao Senhor, que tinha falado com ela: “Tu és o Deus que me vê”. Pois ela disse: “Será que eu não vi aquele que me vê?”"),
      V(14, "Por isso aquele poço foi chamado de Beer-Laai-Roi — “poço daquele que vive e me vê” — e fica entre Cades e Berede."),
      V(15, "Agar deu um filho a Abrão, e Abrão o chamou de Ismael."),
      V(16, "Abrão tinha oitenta e seis anos quando Agar lhe deu Ismael."),
    ]},
  ],
}

CH["17"] = {
  "verses": 27,
  "summary": "Deus muda os nomes de Abrão e Sarai para Abraão e Sara, institui a circuncisão como sinal da aliança e promete que Sara dará à luz Isaque. Abraão obedece no mesmo dia.",
  "sections": [
    {"title": "A aliança e os novos nomes", "start": 1},
    {"title": "A promessa de Isaque", "start": 15},
    {"title": "A circuncisão", "start": 22},
  ],
  "paragraphs": [
    {"verses": [
      V(1, "Quando Abrão tinha noventa e nove anos, o Senhor apareceu a ele e disse: “Eu sou o Deus Todo-Poderoso. Ande na minha presença e seja íntegro."),
      V(2, "Farei uma aliança entre mim e você, e multiplicarei muito a sua descendência.”"),
      V(3, "Abrão prostrou-se com o rosto em terra, e Deus lhe disse:"),
      V(4, "“Quanto a mim, esta é a minha aliança com você: você será pai de muitas nações."),
      V(5, "Não será mais chamado Abrão; o seu nome será Abraão, porque eu o constituí pai de muitas nações."),
      V(6, "Eu o tornarei muito fértil: de você sairão nações e reis."),
      V(7, "Estabelecerei a minha aliança entre mim e você, e com a sua descendência depois de você, de geração em geração — uma aliança eterna, para ser o seu Deus e o Deus da sua descendência."),
      V(8, "Darei a você e à sua descendência a terra onde você agora mora como estrangeiro, toda a terra de Canaã, como propriedade eterna; e serei o Deus deles.”"),
    ]},
    {"verses": [
      V(9, "Deus continuou: “De sua parte, guarde a minha aliança, você e a sua descendência, de geração em geração."),
      V(10, "Esta é a minha aliança com vocês, que vocês e a sua descendência deverão guardar: todo homem entre vocês será circuncidado."),
      V(11, "Vocês circuncidarão a pele do prepúcio, e isso será o sinal da aliança entre mim e vocês."),
      V(12, "Da sua parte, todo menino de oito dias será circuncidado, de geração em geração, tanto o nascido em casa quanto o comprado de estrangeiros que não forem da sua descendência."),
      V(13, "Serão circuncidados tanto o nascido em casa quanto o comprado; a minha aliança estará na carne de vocês como aliança eterna."),
      V(14, "O homem incircunciso, que não tiver circuncidado a pele do seu prepúcio, será eliminado do meio do seu povo, porque quebrou a minha aliança.”"),
    ]},
    {"verses": [
      V(15, "Deus também disse a Abraão: “Quanto a Sarai, sua mulher, não a chame mais de Sarai; o nome dela será Sara."),
      V(16, "Eu a abençoarei e, por meio dela, darei a você um filho. Sim, eu a abençoarei: ela será mãe de nações, e dela sairão reis de povos.”"),
      V(17, "Abraão prostrou-se com o rosto em terra, riu e pensou: “Pode um homem de cem anos ser pai? E Sara, com noventa anos, pode dar à luz?”"),
      V(18, "Então Abraão disse a Deus: “Quem dera Ismael pudesse viver sob a tua bênção!”"),
      V(19, "Mas Deus respondeu: “Sara, a sua mulher, dará à luz um filho, e você o chamará de Isaque. Com ele eu estabelecerei a minha aliança, uma aliança eterna para a sua descendência."),
      V(20, "Quanto a Ismael, eu o ouvi: eu o abençoarei, o tornarei fértil e multiplicarei muito a sua descendência. Ele será pai de doze príncipes, e dele farei uma grande nação."),
      V(21, "Mas a minha aliança eu estabelecerei com Isaque, que Sara dará à luz a você, neste mesmo tempo, no ano que vem.”"),
      V(22, "Quando Deus terminou de falar com Abraão, subiu e o deixou."),
    ]},
    {"verses": [
      V(23, "Naquele mesmo dia, Abraão tomou Ismael, seu filho, todos os nascidos em sua casa e todos os que tinha comprado — todos os homens da casa — e circuncidou a pele do prepúcio de todos, como Deus lhe tinha ordenado."),
      V(24, "Abraão tinha noventa e nove anos quando foi circuncidado,"),
      V(25, "e Ismael, seu filho, tinha treze anos."),
      V(26, "No mesmo dia foram circuncidados Abraão e Ismael, seu filho."),
      V(27, "E com ele foram circuncidados todos os homens da sua casa, tanto os nascidos em casa quanto os comprados de estrangeiros."),
    ]},
  ],
}

out = os.path.join(os.path.dirname(__file__), "..", "data", "books", "gn", "01-17.json")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w", encoding="utf-8") as f:
    json.dump({"book": "gn", "chapters": CH}, f, ensure_ascii=False, indent=2)

total = sum(ch["verses"] for ch in CH.values())
print(f"Parte 1 OK: capítulos 1-17, {total} versículos -> {out}")
