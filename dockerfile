FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

CMD [ "node", "src/app.js" ]