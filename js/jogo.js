// Motor do ReproClicker. Os personagens ficam em personagens.js.

var CHAVE_SAVE = "reproclicker-save-v1";
var TICKS_POR_SEGUNDO = 10;
var ZOOM = 2.4;

var estado = {
	pontos: 0,
	// por id: { qtd: quantas unidades, nivel: quantos upgrades comprados }
	personagens: {}
};

var abertoId = null; // personagem com a ficha aberta (zoom)

// ---------- Regras ----------

function dadosDe(p) {
	if (!estado.personagens[p.id]) estado.personagens[p.id] = { qtd: 0, nivel: 0 };
	return estado.personagens[p.id];
}

function desbloqueado(p) {
	return dadosDe(p).qtd > 0;
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

// Upgrades só podem ser comprados depois de ter o personagem
function podeComprarUpgrade(p) {
	var up = proximoUpgrade(p);
	return !!up && desbloqueado(p) && estado.pontos >= up.custo;
}

function temAlgoParaComprar(p) {
	return estado.pontos >= custoAtual(p) || podeComprarUpgrade(p);
}

// ---------- Ações ----------

function clicarSala(evento) {
	if (abertoId) { fecharFicha(); return; }   // com zoom, tocar na sala só fecha
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
	montarFicha();
	atualizarTela();
}

function comprarUpgrade(p) {
	if (!podeComprarUpgrade(p)) return;
	estado.pontos -= proximoUpgrade(p).custo;
	dadosDe(p).nivel++;
	montarFicha();
	atualizarTela();
}

function resetar() {
	if (!confirm("Apagar todo o progresso?")) return;
	estado = { pontos: 0, personagens: {} };
	salvar();
	fecharFicha();
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

// ---------- Utilidades ----------

function formatar(n) {
	return Math.floor(n).toLocaleString("pt-BR");
}

function $(seletor, raiz) {
	return (raiz || document).querySelector(seletor);
}

function porId(id) {
	return PERSONAGENS.find(function (p) { return p.id === id; });
}

function textoProducao(p, valor) {
	return "+" + formatar(valor) + (p.tipo === "clique" ? " por clique" : " por segundo");
}

// ---------- Sala de aula ----------

function montarSala() {
	var carteiras = $(".carteiras");
	PERSONAGENS.forEach(function (p) {
		var lugar = document.createElement("div");
		lugar.className = "lugar";
		lugar.id = "lugar-" + p.id;
		lugar.innerHTML =
			'<div class="aluno">' +
				'<img class="sprite" src="' + p.sprite + '" draggable="false">' +
				'<span class="alerta">!</span>' +
			'</div>' +
			'<div class="carteira">' +
				'<span class="nome"></span>' +
				'<span class="qtd"></span>' +
			'</div>';
		$(".aluno", lugar).addEventListener("click", function (e) {
			e.stopPropagation();
			abrirFicha(p);
		});
		carteiras.appendChild(lugar);
	});

	$(".sala").addEventListener("click", clicarSala);
}

// ---------- Zoom + ficha ----------

function abrirFicha(p) {
	abertoId = p.id;
	montarFicha();
	$(".ficha").classList.add("aberta");
	darZoom(p);
	atualizarTela();
}

function fecharFicha() {
	abertoId = null;
	$(".ficha").classList.remove("aberta");
	$(".sala").classList.remove("com-zoom");
	$(".sala-conteudo").style.transform = "";
}

function darZoom(p) {
	var sala = $(".sala");
	var aluno = $("#lugar-" + p.id + " .aluno");
	// centro do personagem em coordenadas do conteúdo (sem zoom)
	var cx = aluno.offsetLeft + aluno.offsetWidth / 2 + aluno.offsetParent.offsetLeft;
	var cy = aluno.offsetTop + aluno.offsetHeight / 2 + aluno.offsetParent.offsetTop;
	// espaço visível da sala acima da ficha
	var livre = sala.clientHeight - $(".ficha").offsetHeight;
	var zoom = Math.max(1.2, Math.min(ZOOM, (livre - 30) / aluno.offsetHeight));
	// onde ele deve ficar: centralizado no espaço livre
	var alvoX = sala.clientWidth / 2;
	var alvoY = livre / 2;
	var tx = alvoX - cx * zoom;
	var ty = alvoY + sala.scrollTop - cy * zoom;
	sala.classList.add("com-zoom");
	$(".sala-conteudo").style.transform = "translate(" + tx + "px," + ty + "px) scale(" + zoom + ")";
}

// Monta o conteúdo da ficha (chamado ao abrir e após compras)
function montarFicha() {
	if (!abertoId) return;
	var p = porId(abertoId);
	var d = dadosDe(p);
	var aberto = desbloqueado(p);

	var html =
		'<div class="ficha-topo">' +
			'<img class="sprite" src="' + p.sprite + '">' +
			'<div>' +
				'<h2>' + p.nome + '</h2>' +
				'<p class="ficha-info">' + textoProducao(p, p.valor * multiplicador(p)) + ' cada' +
					(aberto ? ' · Você tem ' + d.qtd : '') + '</p>' +
			'</div>' +
		'</div>' +
		'<p class="ficha-desc">' + p.descricao + '</p>' +
		'<button class="comprar" data-acao="personagem"></button>' +
		'<h3>Melhorias</h3>' +
		'<ul class="melhorias">';

	p.upgrades.forEach(function (up, i) {
		if (i < d.nivel) {
			html += '<li class="melhoria feita"><img class="icone" src="' + up.icone + '">' +
				'<p>' + up.texto + '</p><span class="selo">✔</span></li>';
		} else if (i === d.nivel) {
			html += '<li class="melhoria proxima"><img class="icone" src="' + up.icone + '">' +
				'<p>' + (aberto ? up.texto : "Desbloqueie " + p.nome + " para liberar esta melhoria.") + '</p>' +
				'<button class="comprar" data-acao="upgrade">' + formatar(up.custo) + '</button></li>';
		} else {
			html += '<li class="melhoria futura"><img class="icone" src="' + up.icone + '">' +
				'<p>??? · Libere a melhoria anterior.</p></li>';
		}
	});
	html += '</ul>';

	var conteudo = $(".ficha-conteudo");
	conteudo.innerHTML = html;
	$(".ficha").classList.toggle("bloqueado", !aberto);

	$('[data-acao="personagem"]', conteudo).addEventListener("click", function () { comprarPersonagem(p); });
	var botaoUp = $('[data-acao="upgrade"]', conteudo);
	if (botaoUp) botaoUp.addEventListener("click", function () { comprarUpgrade(p); });
}

// Atualiza só o que muda a cada tick (sem recriar a ficha)
function atualizarFicha() {
	if (!abertoId) return;
	var p = porId(abertoId);
	var conteudo = $(".ficha-conteudo");
	var botao = $('[data-acao="personagem"]', conteudo);
	var custo = custoAtual(p);
	botao.textContent = (desbloqueado(p) ? "Comprar mais um" : "Desbloquear") + " · " + formatar(custo);
	botao.disabled = estado.pontos < custo;
	var botaoUp = $('[data-acao="upgrade"]', conteudo);
	if (botaoUp) botaoUp.disabled = !podeComprarUpgrade(p);
}

// ---------- Tela ----------

function atualizarTela() {
	$(".ponto").textContent = formatar(estado.pontos);
	$(".taxas").textContent = formatar(porClique()) + " por clique · " + formatar(porSegundo()) + " por segundo";

	PERSONAGENS.forEach(function (p) {
		var lugar = document.getElementById("lugar-" + p.id);
		var aberto = desbloqueado(p);
		lugar.classList.toggle("bloqueado", !aberto);
		lugar.classList.toggle("desbloqueado", aberto);
		lugar.classList.toggle("pode", temAlgoParaComprar(p));
		$(".nome", lugar).textContent = aberto ? p.nome : "???";
		$(".qtd", lugar).textContent = "x" + dadosDe(p).qtd;
	});

	atualizarFicha();
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

// "+N" em cima de quem produz por segundo
function mostrarProducaoAutomatica() {
	PERSONAGENS.forEach(function (p) {
		if (p.tipo !== "segundo" || !desbloqueado(p)) return;
		var el = document.createElement("span");
		el.className = "ganho auto";
		el.textContent = "+" + formatar(producao(p));
		$("#lugar-" + p.id + " .aluno").appendChild(el);
		setTimeout(function () { el.remove(); }, 800);
	});
}

// ---------- Início ----------

function iniciar() {
	carregar();
	montarSala();
	atualizarTela();

	setInterval(function () {
		estado.pontos += porSegundo() / TICKS_POR_SEGUNDO;
		atualizarTela();
	}, 1000 / TICKS_POR_SEGUNDO);

	setInterval(mostrarProducaoAutomatica, 1000);
	setInterval(salvar, 5000);
	window.addEventListener("beforeunload", salvar);
	window.addEventListener("resize", function () {
		if (abertoId) darZoom(porId(abertoId));
	});
}

document.addEventListener("DOMContentLoaded", iniciar);
