FROM node:16.1.0-alpine

WORKDIR /app

ADD . .

RUN npm i

RUN npm run build

CMD ["npm", "run", "start"]
