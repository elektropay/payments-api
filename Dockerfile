FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm run docs

EXPOSE 3000

CMD [ "node", "bin/server.js"]
