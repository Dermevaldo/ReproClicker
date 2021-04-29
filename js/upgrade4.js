var ponto=0;
var bonus = 0;
var item4=0;
var item4U=1;
var item4Custo=1000;
var item4UCusto=5000;
$(".item4UCusto").text(item4UCusto);
function item4T(){
if (ponto>=item4Custo) 
{
	item4++;
	ponto-=item4Custo;
	item4Custo+=Math.round(0.40*item4Custo);
	$(".item4Q").text(item4);
	$(".ponto").text(ponto);
	$(".item4C").text(item4Custo);	
}}
 function item4UCompra(){
 if (ponto>=item4UCusto) {
 		item4U++;
 		item4UCusto+=item4Custo*10;
	$(".ponto").text(ponto);
	$(".item4UCusto").text(item4UCusto);
	$(".item4UTexto").text(Upgrade4Texto[item4U-1]);
	if (item4U>3) {
		$(".upgrade4").hide();
	}
 	}	
 }