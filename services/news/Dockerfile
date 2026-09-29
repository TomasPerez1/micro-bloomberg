
FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY services/news/package.json ./services/news/
RUN npm ci

COPY services/news ./services/news/
RUN npm run build -w news

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY services/news/package.json ./services/news/
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/services/news/dist ./services/news/dist

USER node
EXPOSE 8080

CMD ["node", "services/news/dist/main.js"]
