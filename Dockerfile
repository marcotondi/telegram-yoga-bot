FROM node:20.11.0-alpine3.19

WORKDIR /app

ENV NODE_ENV production

ARG BOT_TOKEN
ARG BOT_NAME
ARG ADMIN_ID

COPY package.json ./
RUN npm install
COPY . .

ENV LOG_DIR /app/logs/
ENV STORAGE_DIR /app/data/

CMD ["node", "src/app.js"]

VOLUME ${LOG_DIR}
VOLUME ${STORAGE_DIR}
