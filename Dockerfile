FROM node:14.21.0-alpine

RUN apk add --no-cache python3 g++ make

WORKDIR /usr/app/panel

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
