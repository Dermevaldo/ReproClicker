var ponto=0;
var bonus = 0;
var item1=0;
var item1U=1;
var item1Custo=10;
var item1UCusto=100;
$(".item1UCusto").text(item1UCusto);
function item1T(){
if (ponto>=item1Custo) 
{
	item1++;
	ponto-=item1Custo;
	item1Custo+=Math.round(1.40*item1Custo);
	$(".item1Q").text(item1);
	$(".ponto").text(ponto);
	$(".item1C").text(item1Custo);	
}}
 function item1UCompra(){
 if (ponto>=item1UCusto) {
 		item1U++;
 		item1UCusto+=item1Custo*10;
	$(".ponto").text(ponto);
	$(".item1UCusto").text(item1UCusto);
	$(".item1UTexto").text(Upgrade1Texto[item1U-1]);
	if (item1U>3) {
		$(".upgrade1").hide();
	}
 	}	
 }