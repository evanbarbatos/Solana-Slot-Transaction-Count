# syntax=docker/dockerfile:1

FROM node:18-alpine AS build
WORKDIR /app

# Enable corepack (pnpm)
RUN corepack enable

# Copy workspace manifests first (better caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

# Install dependencies for the whole workspace
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps ./apps

# Build API
RUN pnpm --filter @solana/api run build

# ----------- Runtime -----------
FROM node:18-alpine AS runtime
WORKDIR /app

# Enable corepack
RUN corepack enable

# Copy workspace files and built artifacts
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/apps ./apps

# Install only production deps
RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
ENV API_PORT=3002
CMD ["node", "apps/api/dist/main.js"]