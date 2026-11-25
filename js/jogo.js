// Motor do ReproClicker. Os personagens ficam em personagens.js.

var CHAVE_SAVE = "reproclicker-save-v1";
var TICKS_POR_SEGUNDO = 10;

var estado = {
	pontos: 0,
	// por id: { qtd: quantas unidades, nivel: quantos upgrades comprados }
	personagens: {}
};

// ---------- Regras ----------

function dadosDe(p) {
	if (!estado.personagens[p.id]) estado.personagens[p.id] = { qtd: 0, nivel: 0 };
	return estado.personagens[p.id];
}

function custoAtual(p) {
	return Math.round(p.custo * Math.pow(p.crescimento, dadosDe(p).qtd));
}

function multiplicador(p) {
	var nivel = dadosDe(p).nivel;
	return nivel === 0 ? 1 : p.upgrades[nivel - 1].mult;
}

function producao(p) {
	return dadosDe(p).qtd * p.valor * multiplicador(p);
}

function porClique() {
	var total = 1;
	PERSONAGENS.forEach(function (p) { if (p.tipo === "clique") total += producao(p); });
	return total;
}

function porSegundo() {
	var total = 0;
	PERSONAGENS.forEach(function (p) { if (p.tipo === "segundo") total += producao(p); });
	return total;
}

function proximoUpgrade(p) {
	return p.upgrades[dadosDe(p).nivel] || null;
}

// ---------- Ações ----------

function clicar(evento) {
	var ganho = porClique();
	estado.pontos += ganho;
	mostrarGanho(evento, ganho);
	atualizarTela();
}

function comprarPersonagem(p) {
	var custo = custoAtual(p);
	if (estado.pontos < custo) return;
	estado.pontos -= custo;
	dadosDe(p).qtd++;
	atualizarTela();
}

function comprarUpgrade(p) {
	var up = proximoUpgrade(p);
	if (!up || estado.pontos < up.custo) return;
	estado.pontos -= up.custo;
	dadosDe(p).nivel++;
	atualizarTela();
}

function trocarPainel() {
	document.querySelector(".recursos").classList.toggle("escondido");
	document.querySelector(".upgrade").classList.toggle("escondido");
}

function resetar() {
	if (!confirm("Apagar todo o progresso?")) return;
	estado = { pontos: 0, personagens: {} };
	salvar();
	atualizarTela();
}

// ---------- Save ----------

function salvar() {
	try {
		localStorage.setItem(CHAVE_SAVE, JSON.stringify(estado));
	} catch (e) {
		// navegador sem localStorage: o jogo funciona, só não salva
	}
}

function carregar() {
	try {
		var salvo = JSON.parse(localStorage.getItem(CHAVE_SAVE));
		if (salvo && typeof salvo.pontos === "number") {
			estado.pontos = salvo.pontos;
			estado.personagens = salvo.personagens || {};
		}
	} catch (e) {
		console.warn("Save inválido, começando do zero.", e);
	}
}

// ---------- Tela ----------

function formatar(n) {
	return Math.floor(n).toLocaleString("pt-BR");
}

function criarCards() {
	var recursos = document.querySelector(".recursos");
	var upgrades = document.querySelector(".upgrade");

	PERSONAGENS.forEach(function (p) {
		var card = document.createElement("div");
		card.className = "item";
		card.id = "item-" + p.id;
		card.innerHTML =
			'<img class="imagem pixel" src="' + p.sprite + '">' +
			'<div class="info">' +
				'<h3>' + p.nome + '</h3>' +
				'<p>' + p.descricao + '</p>' +
				'<p class="detalhe">+' + p.valor + (p.tipo === "clique" ? " por clique" : " por segundo") +
					' &middot; Custo: <b class="custo"></b></p>' +
			'</div>' +
			'<b class="quantidade"></b>';
		card.onclick = function () { comprarPersonagem(p); };
		recursos.appendChild(card);

		var cardUp = document.createElement("div");
		cardUp.className = "item";
		cardUp.id = "upgrade-" + p.id;
		cardUp.innerHTML =
			'<img class="imagem icone" src="" onload="this.classList.toggle(\'pixel\', this.naturalWidth < 64)">' +
			'<div class="info">' +
				'<h3>' + p.nome + ' <small class="nivel"></small></h3>' +
				'<p class="texto"></p>' +
				'<p class="detalhe">Custo: <b class="custo"></b></p>' +
			'</div>';
		cardUp.onclick = function () { comprarUpgrade(p); };
		upgrades.appendChild(cardUp);
	});
}

function atualizarTela() {
	document.querySelector(".ponto").textContent = formatar(estado.pontos);
	document.querySelector(".taxas").textContent =
		formatar(porClique()) + " por clique · " + formatar(porSegundo()) + " por segundo";

	PERSONAGENS.forEach(function (p) {
		var card = document.getElementById("item-" + p.id);
		var custo = custoAtual(p);
		card.querySelector(".custo").textContent = formatar(custo);
		card.querySelector(".quantidade").textContent = dadosDe(p).qtd;
		card.classList.toggle("caro", estado.pontos < custo);

		var cardUp = document.getElementById("upgrade-" + p.id);
		var up = proximoUpgrade(p);
		if (!up) {
			cardUp.style.display = "none";
			return;
		}
		cardUp.style.display = "";
		var icone = cardUp.querySelector(".icone");
		if (icone.getAttribute("src") !== up.icone) icone.src = up.icone;
		cardUp.querySelector(".texto").textContent = up.texto;
		cardUp.querySelector(".nivel").textContent = (dadosDe(p).nivel + 1) + "/" + p.upgrades.length;
		cardUp.querySelector(".custo").textContent = formatar(up.custo);
		cardUp.classList.toggle("caro", estado.pontos < up.custo);
	});
}

// Número "+N" que sobe a partir do clique
function mostrarGanho(evento, ganho) {
	if (!evento) return;
	var el = document.createElement("span");
	el.className = "ganho";
	el.textContent = "+" + formatar(ganho);
	el.style.left = evento.clientX + "px";
	el.style.top = evento.clientY + "px";
	document.body.appendChild(el);
	setTimeout(function () { el.remove(); }, 800);
}

// ---------- Início ----------

function iniciar() {
	carregar();
	criarCards();
	document.querySelector(".upgrade").classList.add("escondido");
	atualizarTela();

	setInterval(function () {
		estado.pontos += porSegundo() / TICKS_POR_SEGUNDO;
		atualizarTela();
	}, 1000 / TICKS_POR_SEGUNDO);

	setInterval(salvar, 5000);
	window.addEventListener("beforeunload", salvar);
}

document.addEventListener("DOMContentLoaded", iniciar);
