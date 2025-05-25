const fs = require('fs');
const path = require('path');

function checkDirectory(dir) {
    console.log(`\nVerificando diretório: ${dir}`);
    
    try {
        const files = fs.readdirSync(dir);
        console.log('Arquivos encontrados:');
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            console.log(`- ${file} (${stats.isDirectory() ? 'diretório' : 'arquivo'})`);
        });
    } catch (error) {
        console.error(`Erro ao verificar diretório ${dir}:`, error.message);
    }
}

// Verificar diretórios principais
checkDirectory(__dirname);
checkDirectory(path.join(__dirname, 'public'));

// Verificar arquivos específicos
const requiredFiles = [
    'public/index.html',
    'public/script.js',
    'public/style.css'
];

console.log('\nVerificando arquivos necessários:');
requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    try {
        if (fs.existsSync(filePath)) {
            console.log(`✓ ${file} existe`);
        } else {
            console.log(`✗ ${file} não encontrado`);
        }
    } catch (error) {
        console.error(`Erro ao verificar ${file}:`, error.message);
    }
}); 