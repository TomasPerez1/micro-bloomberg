
FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY services/international-markets/package.json ./services/international-markets/
COPY packages ./packages
RUN npm ci

COPY services/international-markets ./services/international-markets
RUN npm run build -w international-markets

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY services/international-markets/package.json ./services/international-markets/
COPY packages ./packages
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/services/international-markets/dist ./services/international-markets/dist

USER node
EXPOSE 8080

CMD ["node", "services/international-markets/dist/main.js"]

