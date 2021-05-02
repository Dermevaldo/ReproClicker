var ponto = 0;
var bonus = 0;
var item3 = 0;
var item3U = 1;
var item3Custo = 1000;
var item3UCusto = 5000;
$(".item3UCusto").text(item3UCusto);
function item3T() {
	if (ponto >= item3Custo) {
		item3++;
		ponto -= item3Custo;
		item3Custo += Math.round(0.40 * item3Custo);
		$(".item3Q").text(item3);
		$(".ponto").text(ponto);
		$(".item3C").text(item3Custo);
	}
}
function item3UCompra() {
	if (ponto >= item3UCusto) {
		item3U++;
		item3UCusto += item3Custo * 10;
		$(".ponto").text(ponto);
		$(".item3UCusto").text(item3UCusto);
		$(".item3UTexto").text(Upgrade3Texto[item3U - 1]);
		if (item3U > 3) {
			$(".upgrade3").hide();
		}
	}
}