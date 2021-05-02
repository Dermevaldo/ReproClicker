var item2 = 0;
var item2Custo = 50;
var item2UCusto = 200;
var upgrade2 = 1;
function item2T() {
	if (ponto >= item2Custo) {
		item2++;
		ponto -= item2Custo;
		item2Custo += Math.round(0.40 * item2Custo);
		$(".item2Q").text(item2);
		$(".ponto").text(ponto);
		$(".item2C").text(item2Custo);
	}
}
function item2UCompra() {
	if (ponto >= item2UCusto) {
		upgrade2++;
		item2UCusto += item2Custo * 10;
		$(".ponto").text(ponto);
		$(".item2UCusto").text(item2UCusto);
		$(".item2UTexto").text(Upgrade2Texto[upgrade2 - 1]);
		if (upgrade2 > 3) {
			$(".upgrade2").hide();
		}
	}
}
