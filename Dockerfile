# 1. Base image
FROM node:20-alpine AS base

# Install OpenSSL (required for Prisma on Alpine)
RUN apk add --no-cache openssl

# 2. Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Install dependencies including devDependencies (needed for build)
RUN npm ci

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# 4. Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy generated prisma client (not needed for standard output, it is in node_modules)
# COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated 

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
