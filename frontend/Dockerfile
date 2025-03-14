FROM node:22-alpine as development

WORKDIR /millerdev/frontend/src/app

COPY package*.json ./

RUN npm install -g @angular/cli
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4200