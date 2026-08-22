FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM alpine:3.20 AS runtime

WORKDIR /app

COPY --from=builder /app/dist ./dist

RUN mkdir -p /frontend-dist

CMD ["sh", "-c", "rm -rf /frontend-dist/* && cp -a /app/dist/. /frontend-dist/ && tail -f /dev/null"]