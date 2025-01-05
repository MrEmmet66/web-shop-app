FROM node:23-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 5000

RUN npx prisma migrate dev --name init

CMD ["node", "dist/main"]