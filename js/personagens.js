// Lista de personagens do ReproClicker.
// Para adicionar um personagem novo, basta adicionar um objeto nesta lista.
//
// Campos:
//   id          identificador único (usado no save, não mude depois de lançado)
//   nome        nome exibido
//   sprite      imagem do personagem (pasta chars/)
//   descricao   texto do card
//   tipo        "clique"  -> soma reprovações a cada clique no papel
//               "segundo" -> gera reprovações automaticamente por segundo
//   valor       quanto cada unidade gera (por clique ou por segundo), antes dos upgrades
//   custo       preço da primeira unidade
//   crescimento multiplicador do preço a cada compra (1.4 = +40%)
//   upgrades    lista de upgrades em ordem. Cada um multiplica a produção do personagem.
//               { icone, texto, custo, mult }
//               "mult" é o multiplicador total depois de comprar esse upgrade
//               (2 = dobro, 3 = triplo...).

var PERSONAGENS = [
	{
		id: "trap",
		nome: "Trap",
		sprite: "chars/Trap.png",
		descricao: "Trap é um reprovador nato, vai te ajudar a reprovar e te zoar de brinde.",
		tipo: "clique",
		valor: 1,
		custo: 10,
		crescimento: 1.4,
		upgrades: [
			{ icone: "chars/sword.png", custo: 100, mult: 2, texto: "Trap está em Calculo 1, as reprovações agora serão duplicadas." },
			{ icone: "chars/sword.png", custo: 1000, mult: 3, texto: "Trap tomou um fora, as reprovações dele valem o triplo." },
			{ icone: "chars/sword.png", custo: 10000, mult: 4, texto: "Trap é misógino agora, as reprovações agora valem o quadruplo." }
		]
	},
	{
		id: "beneval",
		nome: "Beneval",
		sprite: "chars/Benevaldo.gif",
		descricao: "Benevaldo é um reprovador continuo, vai reprovar enquanto perde cabelos.",
		tipo: "segundo",
		valor: 1,
		custo: 50,
		crescimento: 1.4,
		upgrades: [
			{ icone: "chars/raposinha.png", custo: 200, mult: 2, texto: "Beneval arranjou uma 'webnamorada', agora ele reprova o dobro." },
			{ icone: "chars/raposinha.png", custo: 2000, mult: 3, texto: "Benevaldo está perdendo cabelos pelo estresse, ele reprova o triplo." },
			{ icone: "chars/raposinha.png", custo: 20000, mult: 4, texto: "Beneval foi corno, agora está reprovando o quadruplo pela saudade dela." }
		]
	},
	{
		id: "drougas",
		nome: "Drougas",
		sprite: "chars/Drougas.png",
		descricao: "Mc Doguinhas sempre esteve aqui reprovando e tacando molotov de sprite nos corredores.",
		tipo: "clique",
		valor: 4,
		custo: 1000,
		crescimento: 1.4,
		upgrades: [
			{ icone: "chars/suplemento.png", custo: 5000, mult: 2, texto: "Seu streamer está fazendo rerun, agora ele reprova o dobro." },
			{ icone: "chars/suplemento.png", custo: 50000, mult: 3, texto: "Pandemia chegou e ele se tornou mudo nas aulas, está reprovando o triplo." },
			{ icone: "chars/suplemento.png", custo: 500000, mult: 4, texto: "Ele virou Zé bombinha e passou a reprovar o quadruplo." }
		]
	},
	{
		id: "peduel",
		nome: "Peduel",
		sprite: "chars/peduel.png",
		descricao: "Peduel é um rapaz que se preocupa com as crianças e acaba reprovando continuamente.",
		tipo: "segundo",
		valor: 10,
		custo: 1000,
		crescimento: 1.4,
		upgrades: [
			{ icone: "chars/bala.png", custo: 5000, mult: 2, texto: "Peduel comprou uma van escolar, agora ele reprova mais por segundo." },
			{ icone: "chars/bala.png", custo: 50000, mult: 3, texto: "Peduel viu uma garota e está sorridente, sua reprovação aumentou." },
			{ icone: "chars/bala.png", custo: 500000, mult: 4, texto: "Peduel pagou a internet da Ex, a sua reprovação chegou ao ápice." }
		]
	},
	{
		id: "burgues",
		nome: "Burguês",
		sprite: "chars/burgues.png",
		descricao: "Burguês quer ser cientista de dados e não sabe ler dados então reprova.",
		tipo: "segundo",
		valor: 24,
		custo: 3000,
		crescimento: 1.4,
		upgrades: [
			{ icone: "chars/burgues_xphone.png", custo: 15000, mult: 2, texto: "Burguês comprou o XPhone 69 Pro Max e agora reprova duas vezes mais por segundo." },
			{ icone: "chars/burgues_cupom.png", custo: 150000, mult: 3, texto: "Burguês encontrou um cupom no MalaExpress e agora não para de comprar, fazendo ele reprovar o triplo por segundo." },
			{ icone: "chars/burgues_startup.png", custo: 1500000, mult: 4, texto: "Burguês criou uma startup e agora está turistando no curso, reprovando 4 vezes mais." }
		]
	},
	{
		id: "fabio",
		nome: "Fabio",
		sprite: "chars/fabio.png",
		descricao: "Fabio é um programador irritado, acaba reprovando por reclamar de tudo.",
		tipo: "clique",
		valor: 25,
		custo: 8000,
		crescimento: 1.4,
		upgrades: [
			{ icone: "chars/fabio_espadachave.png", custo: 40000, mult: 2, texto: "Fabio pegou um jogo de 20 anos atrás que ele gosta para zerar, agora ele reprova o dobro para maratonar." },
			{ icone: "chars/fabio_carne.png", custo: 400000, mult: 3, texto: "Fabio descobriu que um jogo novo de sua coleção favorita mudou uma mecânica, ele se revolta e agora reprova o triplo em protesto." },
			{ icone: "chars/fabio_traducao.png", custo: 4000000, mult: 4, texto: "Fabio viu que seu curso está escrito em português e se recusa a continuar, agora reprova 4 vezes mais enquanto tenta traduzir tudo." }
		]
	}
];
