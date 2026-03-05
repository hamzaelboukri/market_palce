# ---------- base ----------
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---------- deps ----------
FROM base AS deps

COPY package.json package-lock.json ./

COPY packages/frontend ./packages/frontend

RUN npm ci --workspace=packages/frontend

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY packages/frontend ./packages/frontend

WORKDIR /app/packages/frontend

RUN npm run build

# ---------- runner ----------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN adduser -S -G node node || true

COPY --from=builder --chown=node:node /app/packages/frontend/.next/standalone ./ 
COPY --from=builder --chown=node:node /app/packages/frontend/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/packages/frontend/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]