# Sistema de Controle de Patrimônio

## Requisitos
- Node.js 14.x ou superior
- npm 6.x ou superior

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DO_DIRETÓRIO]
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional):
```bash
export PORT=3000
```

4. Inicie o servidor:
```bash
npm start
```

## Configuração no Amazon EC2

1. Conecte-se à sua instância EC2:
```bash
ssh -i [SUA_CHAVE.pem] ec2-user@[IP_DA_INSTÂNCIA]
```

2. Instale o Node.js:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 14
```

3. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DO_DIRETÓRIO]
```

4. Instale as dependências:
```bash
npm install
```

5. Configure o PM2 para manter a aplicação rodando:
```bash
npm install -g pm2
pm2 start server.js --name "patrimonio-app"
pm2 startup
pm2 save
```

6. Configure o Nginx como proxy reverso:
```bash
sudo yum install nginx
```

7. Configure o Nginx:
```bash
sudo nano /etc/nginx/conf.d/patrimonio.conf
```

Adicione a seguinte configuração:
```nginx
server {
    listen 80;
    server_name [SEU_DOMÍNIO_OU_IP];

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. Inicie o Nginx:
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Estrutura de Diretórios
```
.
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
└── README.md
```

## Manutenção

- Para ver os logs da aplicação:
```bash
pm2 logs patrimonio-app
```

- Para reiniciar a aplicação:
```bash
pm2 restart patrimonio-app
```

- Para atualizar a aplicação:
```bash
git pull
npm install
pm2 restart patrimonio-app
```
