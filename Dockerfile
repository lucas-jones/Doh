FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn
RUN yarn global add serve

COPY . .

RUN yarn build

EXPOSE 5000

CMD [ "serve", "-s", "build" ]