const { Pool } = require('pg');

const pool = new Pool({
    host: 'dbpostgreeuni25.cap2o88aaoqq.us-east-1.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'univesp25',
    database: 'postgres',
    ssl: {
        rejectUnauthorized: false // Necessário para conexão com RDS
    },
    max: 20, // número máximo de clientes no pool
    idleTimeoutMillis: 30000, // tempo máximo que um cliente pode ficar inativo
    connectionTimeoutMillis: 2000, // tempo máximo para estabelecer conexão
});

// Teste de conexão
pool.on('connect', () => {
    console.log('Novo cliente conectado ao banco de dados');
});

pool.on('error', (err) => {
    console.error('Erro inesperado no cliente do pool:', err);
});

module.exports = pool; 