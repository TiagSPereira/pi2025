const pool = require('./db');

const createTable = async () => {
    const client = await pool.connect();
    try {
        console.log('Criando tabela patrimonio_ativo...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS patrimonio_ativo (
                id SERIAL PRIMARY KEY,
                numero VARCHAR(9),
                data_entrada DATE,
                origem VARCHAR(50),
                data_devolucao DATE,
                local VARCHAR(50),
                situacao VARCHAR(50),
                valor DECIMAL(10,2),
                vida_util INTEGER,
                valor_corrigido DECIMAL(10,2),
                necessita_reparo BOOLEAN,
                condicoes_reparo BOOLEAN,
                manutencao BOOLEAN,
                tipo_manutencao VARCHAR(50),
                descricao TEXT,
                inventariante TEXT,
                local_descricao TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabela patrimonio_ativo criada ou já existente');
    } catch (error) {
        console.error('Erro ao criar tabela:', error);
        throw error;
    } finally {
        client.release();
    }
};

const salvarPatrimonioAtivo = async (dados) => {
    const client = await pool.connect();
    try {
        // Validar dados obrigatórios
        const camposObrigatorios = ['numero', 'dataEntrada', 'origem', 'local', 'situacao', 'valor', 'vidaUtil'];
        const camposFaltantes = camposObrigatorios.filter(campo => !dados[campo]);
        
        if (camposFaltantes.length > 0) {
            throw new Error(`Campos obrigatórios faltando: ${camposFaltantes.join(', ')}`);
        }

        // Converter valores para os tipos corretos
        const valores = {
            numero: dados.numero,
            dataEntrada: dados.dataEntrada || null,
            origem: dados.origem,
            dataDevolucao: dados.dataDevolucao || null,
            local: dados.local,
            situacao: dados.situacao,
            valor: parseFloat(dados.valor) || 0,
            vidaUtil: parseInt(dados.vidaUtil) || 0,
            valorCorrigido: parseFloat(dados.valorCorrigido) || 0,
            necessitaReparo: dados.necessitaReparo || false,
            condicoesReparo: dados.condicoesReparo || false,
            manutencao: dados.manutencao || false,
            tipoManutencao: dados.tipoManutencao || null,
            descricao: dados.descricao || null,
            inventariante: dados.inventariante || null,
            localDescricao: dados.localDescricao || null
        };

        console.log('Valores a serem salvos:', valores);

        const query = `
            INSERT INTO patrimonio_ativo (
                numero, data_entrada, origem, data_devolucao, local, 
                situacao, valor, vida_util, valor_corrigido, 
                necessita_reparo, condicoes_reparo, manutencao, 
                tipo_manutencao, descricao, inventariante, local_descricao
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *;
        `;

        const result = await client.query(query, [
            valores.numero,
            valores.dataEntrada,
            valores.origem,
            valores.dataDevolucao,
            valores.local,
            valores.situacao,
            valores.valor,
            valores.vidaUtil,
            valores.valorCorrigido,
            valores.necessitaReparo,
            valores.condicoesReparo,
            valores.manutencao,
            valores.tipoManutencao,
            valores.descricao,
            valores.inventariante,
            valores.localDescricao
        ]);

        console.log('Dados salvos com sucesso:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao salvar patrimônio:', error);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    createTable,
    salvarPatrimonioAtivo
}; 