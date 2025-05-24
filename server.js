const express = require('express');
const cors = require('cors');
const path = require('path');
const { createTable, salvarPatrimonioAtivo } = require('./patrimonioAtivo');

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Criar tabela ao iniciar o servidor
createTable().catch(error => {
    console.error('Erro ao criar tabela:', error);
});

// Rota para salvar patrimônio ativo
app.post('/api/patrimonio-ativo', async (req, res) => {
    try {
        console.log('Recebendo dados:', req.body);
        
        // Validar dados recebidos
        if (!req.body) {
            throw new Error('Dados não recebidos');
        }

        const resultado = await salvarPatrimonioAtivo(req.body);
        console.log('Dados salvos com sucesso:', resultado);
        
        res.json({ success: true, data: resultado });
    } catch (error) {
        console.error('Erro detalhado ao salvar:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao salvar patrimônio',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 