FROM node:22 as builder

WORKDIR /home/node/app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install

RUN npm run build

FROM node:22 as runner

WORKDIR /home/node/app

COPY package.json ./
COPY assets ./assets

RUN npm install --only=production

COPY --from=builder /home/node/app/dist ./dist

# Start
CMD [ "npm", "run", "prod" ]
