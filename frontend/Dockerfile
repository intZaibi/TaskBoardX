#Stage 1: Builder
FROM node:22 as builder

WORKDIR /build

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build 


#Stage 2: Runner

FROM node:22 as runner

WORKDIR /app

COPY package.json package-lock.json ./

COPY --from=builder /build/.next ./.next

COPY --from=builder /build/node_modules ./node_modules

CMD ["npm", "run", "start"]

