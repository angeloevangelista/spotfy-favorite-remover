FROM node:17.1.0 as build-env
WORKDIR /app

COPY . .

COPY package*.json ./

RUN npm install && npm run build

FROM node:17.1.0
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY --from=build-env /app/dist/ ./
ENTRYPOINT [ "node", "index.js" ]
