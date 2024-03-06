# Use a versão oficial do Node.js 21 como imagem base
FROM node:21

# Cria o diretório do aplicativo e ajusta as permissões
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Define o diretório de trabalho
WORKDIR /home/node/app

# Copia os arquivos package.json e, se existir, package-lock.json
COPY package*.json ./

# Define o usuário 'node' como usuário atual
USER node

# Copia todos os arquivos do diretório atual para o diretório de trabalho no container
COPY --chown=node:node . .

# Instala as dependências do projeto, incluindo Puppeteer
RUN npm install

# Volta para o usuário root para instalar o Chrome e a fonte Times New Roman
USER root

# Adiciona o repositório do Chrome, atualiza o APT e instala o Google Chrome
# RUN apt-get update && apt-get install -y wget gnupg \
#     && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
#     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#     && apt-get update \
#     && apt-get install -y google-chrome-stable
# RUN ln -s /usr/bin/google-chrome-stable /opt/google/chrome/google-chrome
# Instala as dependências necessárias e configura o debconf para aceitar o EULA
# RUN apt-get install -y cabextract xfonts-utils \
#     && echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections

# Baixa e instala o ttf-mscorefonts-installer


# Limpa arquivos desnecessários e cache do APT para reduzir o tamanho da imagem
RUN apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Muda de volta para o usuário 'node'
USER node

# Define o comando padrão para iniciar o aplicativo
CMD ["node", "index.js"]

# Expõe a porta 4789
EXPOSE 3000
