
function calcular() {

	var num3 = document.getElementById('num3').value;
	var num4 = document.getElementById('num4').value;

	var resultadoIII = parseFloat(num3).toFixed(2) / parseInt(num4) - parseFloat(num3);
	document.getElementById('resultadoIII').value = Math.abs(resultadoIII).toFixed(2).replace(".",",");
}