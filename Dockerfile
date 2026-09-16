# Imagem base
FROM node:18.17.0

# Criação do diretório de trabalho
WORKDIR /usr/src/app

RUN npm install -g npm
RUN npm install -g pm2
RUN pm2 install pm2-logrotate

# Instalação das dependências
COPY package*.json ./
RUN npm install --only=production

# Copia o código fonte
COPY ormconfig.js dist/ ./
COPY src/modules modules
COPY src/shared shared

# Define a porta que a aplicação vai escutar
EXPOSE 3357

# Comando para executar a aplicação
CMD ["node", "server.js"]