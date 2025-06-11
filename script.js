function clicar() {

	var valor = document.querySelector("#valor").value;
	var vida = document.querySelector("#vida").value;

	var resultado = parseFloat(valor).toFixed(2) / parseInt(vida) - parseFloat(valor);

	document.getElementById('resultado').value = Math.abs(resultado).toFixed(2).replace(".",",");
};







