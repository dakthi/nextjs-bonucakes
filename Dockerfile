FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY payload/package*.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY payload/ ./
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 payload
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
RUN mkdir -p uploads && chown -R payload:nodejs uploads
USER payload
EXPOSE 3000
ENV PORT=3000
CMD ["node", "dist/server.js"]
