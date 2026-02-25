# ── Stage 1: Build Frontend ──────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY server/package.json ./server/

RUN npm ci

COPY frontend/ ./frontend/
RUN npm run build --prefix frontend

# ── Stage 2: Build Server ───────────────────────────────
FROM node:20-alpine AS server-builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY server/package.json ./server/

RUN npm ci

COPY server/ ./server/
RUN cd server && npx prisma generate && npm run build

# ── Stage 3: Production Runtime ─────────────────────────
FROM node:20-alpine

RUN apk add --no-cache python3 make g++ openssl

WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY frontend/package.json ./frontend/

RUN npm ci --omit=dev && apk del python3 make g++

# Copy Prisma schema + generated client (hoisted to root by npm workspaces)
COPY server/prisma/schema.prisma ./server/prisma/
COPY --from=server-builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=server-builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled server
COPY --from=server-builder /app/server/dist ./server/dist

# Copy Prisma seed + migration data
COPY server/prisma/seed.ts ./server/prisma/
COPY server/prisma/dev.db ./server/prisma/

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./public

# Copy uploads directory
COPY uploads/ ./uploads/

ENV NODE_ENV=production
ENV PORT=4081
ENV DATABASE_URL=file:./dev.db

EXPOSE 4081

CMD ["node", "server/dist/index.js"]
