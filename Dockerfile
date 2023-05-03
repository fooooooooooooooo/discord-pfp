FROM node:20.0.0-alpine as build
LABEL org.opencontainers.image.source="https://github.com/fooooooooooooooo/discord-pfp"

WORKDIR /app

ENV NODE_ENV=development

COPY .yarn /app/.yarn/
COPY .yarnrc.yml yarn.lock /app/

COPY package.json /app/

COPY backend/package.json /app/backend/
COPY frontend/package.json /app/frontend/

RUN yarn install

COPY . /app/

ENV NODE_ENV=production

RUN yarn build

FROM build as run

ENV NODE_ENV=production

CMD yarn start
