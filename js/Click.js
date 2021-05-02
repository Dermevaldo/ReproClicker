function iniciar() {
	$(".ponto").text(ponto);
	$(".item1Q").text(item1);
	$(".item1C").text(item1Custo);
	$(".item1UTexto").text(Upgrade1Texto[item1U - 1]);
	$(".item2UTexto").text(Upgrade2Texto[upgrade2 - 1]);
	$(".item3UTexto").text(Upgrade3Texto[item3U - 1]);
	$(".upgrade").hide();
	$(".item2Q").text(item2);
	$(".ponto").text(ponto);
	$(".item2C").text(item2Custo);
	$(".item2UCusto").text(item2UCusto);
	$(".item3Q").text(item3);
	$(".item3C").text(item3Custo);
	$(".item3UCusto").text(item3UCusto);
	$(".item4Q").text(item4);
	$(".item4C").text(item4Custo);
	$(".item4UCusto").text(item4UCusto);
	$(".item4UTexto").text(Upgrade4Texto[item4U - 1]);
}
function trocar() {
	$(".upgrade").toggle();
	$(".recursos").toggle();
}
function clica() {
	ponto++;
	ponto += item1 * item1U + ((item3 * 4) * item3U);

	$(".ponto").text(ponto);
}
