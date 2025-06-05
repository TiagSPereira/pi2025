const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Configuração do CORS mais permissiva para desenvolvimento
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para processar JSON
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Servir arquivos estáticos da pasta public
const publicPath = path.join(__dirname, 'public');
console.log('Diretório de arquivos estáticos:', publicPath);
app.use(express.static(publicPath));

// Conexão com o banco de dados
const db = new sqlite3.Database('./patrimonio.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados SQLite');
        createTable();
    }
});

// Criar tabela se não existir
function createTable() {
    db.run(`CREATE TABLE IF NOT EXISTS patrimonio_ativo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT NOT NULL,
        dataEntrada TEXT NOT NULL,
        origem TEXT NOT NULL,
        dataDevolucao TEXT,
        local TEXT NOT NULL,
        situacao TEXT NOT NULL,
        valor REAL NOT NULL,
        vidaUtil INTEGER NOT NULL,
        valorCorrigido REAL NOT NULL,
        necessitaReparo INTEGER NOT NULL,
        condicoesReparo INTEGER NOT NULL,
        manutencao INTEGER NOT NULL,
        tipoManutencao TEXT,
        descricao TEXT,
        inventariante TEXT,
        localDescricao TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err);
        } else {
            console.log('Tabela patrimonio_ativo criada ou já existe');
        }
    });
}

// Rota para salvar patrimônio ativo
app.post('/api/patrimonio-ativo', (req, res) => {
    console.log('Recebendo dados do patrimônio ativo:', req.body);
    
    const {
        numero,
        dataEntrada,
        origem,
        dataDevolucao,
        local,
        situacao,
        valor,
        vidaUtil,
        valorCorrigido,
        necessitaReparo,
        condicoesReparo,
        manutencao,
        tipoManutencao,
        descricao,
        inventariante,
        localDescricao
    } = req.body;

    // Validação dos campos obrigatórios
    if (!numero || !dataEntrada || !origem || !local || !situacao || !valor || !vidaUtil) {
        return res.status(400).json({
            success: false,
            error: 'Campos obrigatórios faltando: numero, dataEntrada, origem, local, situacao, valor, vidaUtil'
        });
    }

    const sql = `INSERT INTO patrimonio_ativo (
        numero, dataEntrada, origem, dataDevolucao, local, situacao,
        valor, vidaUtil, valorCorrigido, necessitaReparo, condicoesReparo,
        manutencao, tipoManutencao, descricao, inventariante, localDescricao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        numero,
        dataEntrada,
        origem,
        dataDevolucao || null,
        local,
        situacao,
        valor,
        vidaUtil,
        valorCorrigido || 0,
        necessitaReparo ? 1 : 0,
        condicoesReparo ? 1 : 0,
        manutencao ? 1 : 0,
        tipoManutencao || null,
        descricao || null,
        inventariante || null,
        localDescricao || null
    ];

    db.run(sql, values, function(err) {
        if (err) {
            console.error('Erro ao salvar patrimônio:', err);
            return res.status(500).json({
                success: false,
                error: 'Erro ao salvar patrimônio: ' + err.message
            });
        }

        console.log('Patrimônio salvo com sucesso. ID:', this.lastID);
        res.json({
            success: true,
            id: this.lastID
        });
    });
});

// Rota para obter todos os patrimônios ativos
app.get('/api/patrimonio-ativo', (req, res) => {
    db.all('SELECT * FROM patrimonio_ativo ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar patrimônios:', err);
            return res.status(500).json({
                success: false,
                error: 'Erro ao buscar patrimônios: ' + err.message
            });
        }

        res.json({
            success: true,
            data: rows
        });
    });
});

// Rota para a página principal
app.get('/', (req, res) => {
    console.log('Acessando rota principal');
    const indexPath = path.join(publicPath, 'index.html');
    console.log('Caminho do index.html:', indexPath);
    res.sendFile(indexPath);
});

// Rota de fallback para todas as outras requisições
app.get('*', (req, res) => {
    console.log('Rota não encontrada:', req.url);
    res.status(404).send('Página não encontrada');
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err);
    res.status(500).send('Erro interno do servidor');
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Diretório atual: ${__dirname}`);
    console.log(`Arquivos estáticos em: ${publicPath}`);
}); 