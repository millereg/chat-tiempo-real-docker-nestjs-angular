# Etapa de desarrollo
FROM node:22-alpine AS development

WORKDIR /millerdev/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000


################
## PRODUCCIÓN ##
################

FROM node:22-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /millerdev/src/app

COPY --from=development /millerdev/src/app/ .

EXPOSE 8080

CMD ["node", "dist/main"]  # Asegúrate de que este es el archivo correcto