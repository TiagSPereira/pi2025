// Função para calcular o valor corrigido
function clicar() {
	console.log('Função clicar chamada');
	var valor = document.querySelector("#valor").value;
	var vida = document.querySelector("#vida").value;

	console.log('Valor:', valor);
	console.log('Vida:', vida);

	var resultado = parseFloat(valor).toFixed(2) / parseInt(vida) - parseFloat(valor);
	document.getElementById('resultado').value = Math.abs(resultado).toFixed(2).replace(".",",");
}

// Função para verificar o valor do radio button
function getRadioValue(name) {
	const radio = document.querySelector(`input[name="${name}"]:checked`);
	return radio ? radio.id === 'repsim' : false;
}

// Função para validar campos obrigatórios
function validarCamposObrigatorios() {
	console.log('Iniciando validação dos campos...');
	
	const campos = {
		numero: 'Número do patrimônio',
		date: 'Data de entrada',
		tipo: 'Origem',
		local: 'Local',
		estado: 'Situação',
		valor: 'Valor',
		vida: 'Vida útil',
		resultado: 'Valor corrigido',
		reparo: 'Necessita reparo',
		condic: 'Condições para reparo',
		manut: 'Manutenção',
		tipo2: 'Tipo de manutenção',
		desc1: 'Descrição',
		desc2: 'Inventariante',
		desc3: 'Local descrição',
		datedev: 'Data de devolução'
	};

	const camposFaltantes = [];

	for (const [id, nome] of Object.entries(campos)) {
		const elemento = document.getElementById(id);
		console.log(`Verificando campo ${id}:`, elemento ? elemento.value : 'elemento não encontrado');
		
		if (!elemento) {
			console.error(`Elemento não encontrado: ${id}`);
			continue;
		}

		// Verifica se é um select
		if (elemento.tagName === 'SELECT') {
			if (!elemento.value) {
				console.log(`Select vazio: ${id}`);
				camposFaltantes.push(nome);
			}
		}
		// Verifica se é um input
		else if (elemento.tagName === 'INPUT') {
			if (!elemento.value.trim()) {
				console.log(`Input vazio: ${id}`);
				camposFaltantes.push(nome);
			}
		}
		// Verifica se é um textarea
		else if (elemento.tagName === 'TEXTAREA') {
			if (!elemento.value.trim()) {
				console.log(`Textarea vazio: ${id}`);
				camposFaltantes.push(nome);
			}
		}
	}

	if (camposFaltantes.length > 0) {
		console.log('Campos faltantes:', camposFaltantes);
		const mensagem = `Por favor, preencha os seguintes campos obrigatórios:\n\n${camposFaltantes.join('\n')}`;
		alert(mensagem);
		return false;
	}

	console.log('Todos os campos obrigatórios estão preenchidos');
	return true;
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
	console.log('DOM carregado, procurando formulário...');
	
	// Encontrar o formulário da seção ativo
	const formAtivo = document.getElementById('formAtivo');
	
	if (formAtivo) {
		console.log('Formulário encontrado, adicionando evento submit');
		
		// Desabilitar validação nativa do HTML5
		formAtivo.setAttribute('novalidate', '');
		
		formAtivo.addEventListener('submit', async function(event) {
			console.log('Função submit chamada');
			event.preventDefault();

			// Validar campos obrigatórios antes de prosseguir
			if (!validarCamposObrigatorios()) {
				console.log('Validação falhou, retornando...');
				return;
			}

			try {
				// Coletar dados do formulário
				const formData = {
					numero: document.getElementById('numero').value.trim(),
					dataEntrada: document.getElementById('date').value,
					origem: document.getElementById('tipo').value,
					dataDevolucao: document.getElementById('datedev').value,
					local: document.getElementById('local').value,
					situacao: document.getElementById('estado').value,
					valor: parseFloat(document.getElementById('valor').value) || 0,
					vidaUtil: parseInt(document.getElementById('vida').value) || 0,
					valorCorrigido: parseFloat(document.getElementById('resultado').value) || 0,
					necessitaReparo: getRadioValue('reparo'),
					condicoesReparo: getRadioValue('condic'),
					manutencao: getRadioValue('manut'),
					tipoManutencao: document.getElementById('tipo2').value,
					descricao: document.getElementById('desc1').value,
					inventariante: document.getElementById('desc2').value,
					localDescricao: document.getElementById('desc3').value
				};

				console.log('Dados coletados:', formData);

				// Enviar dados para o servidor
				console.log('Enviando dados para o servidor...');
				const response = await fetch('http://' + window.location.hostname + '/api/patrimonio-ativo', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(formData)
				});

				console.log('Resposta recebida:', response);
				const data = await response.json();
				console.log('Dados recebidos:', data);

				if (data.success) {
					alert('Patrimônio salvo com sucesso!');
					formAtivo.reset();
				} else {
					throw new Error(data.error || 'Erro ao salvar patrimônio');
				}
			} catch (error) {
				console.error('Erro detalhado:', error);
				alert('Erro ao salvar patrimônio: ' + error.message);
			}
		});
	} else {
		console.error('Formulário não encontrado!');
	}

	// Adicionar evento de clique ao botão calcular
	const botaoCalcular = document.querySelector('.botao');
	if (botaoCalcular) {
		console.log('Botão calcular encontrado');
		botaoCalcular.addEventListener('click', clicar);
	}
});







