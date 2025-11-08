# syntax=docker/dockerfile:1

FROM node:18-alpine AS build
WORKDIR /app

RUN corepack enable

# Copy workspace manifests first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

# Install dependencies for the workspace
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps ./apps

# Build Next app
RUN pnpm --filter @solana/web run build

# ----------- Runtime -----------
FROM node:18-alpine AS runtime
WORKDIR /app

RUN corepack enable

# Copy workspace and built artifacts
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/apps ./apps

# Install only production deps
RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:3002

# Next start via package script ensures app dir context
CMD ["pnpm", "--filter", "@solana/web", "run", "start"]