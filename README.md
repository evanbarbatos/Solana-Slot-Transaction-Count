# Solana Monorepo (NestJS + NextJS)

A minimal pnpm workspace with:
- `apps/api`: NestJS server exposing a Solana endpoint to get transaction count for a given block slot
- `apps/web`: NextJS app with an input form that calls the API and displays the count

## Monorepo Structure
- `apps/api`: NestJS service and controller
- `apps/web`: NextJS App Router UI
- `package.json`, `pnpm-workspace.yaml`: pnpm workspace configuration

## Prerequisites
- Node.js 18+
- pnpm 9+ (managed via Corepack)

## Setup
```bash
pnpm install
```

## Run
- API (NestJS):
  - `pnpm --filter @solana/api run start:dev`
  - Listens on `API_PORT` (default `3002`)
- Web (NextJS):
  - `pnpm --filter @solana/web run dev`
  - Serves on `3003`

## Environment Variables
Environment files are provided per app. Copy `.env.example` to `.env` and adjust as needed.

- API (`apps/api/.env`):
  - `API_PORT=3002` — port for the NestJS server
  - `CORS_ORIGIN=http://localhost:3000` — allowed origin for the web app (Docker defaults)
  - `SOLANA_RPC_URL=https://api.mainnet-beta.solana.com` — Solana RPC endpoint
- Web (`apps/web/.env`):
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:3002` — base URL of the API

## API
- Endpoint: `POST /solana/transaction-count`
- URL: ``${API_BASE}/solana/transaction-count`` (default `http://localhost:3002/solana/transaction-count`)
- Body:
```json
{ "block": 123 }
```
- Response:
```json
{ "slot": 123, "transactionCount": 3 }
```
- Example:
```bash
curl -X POST http://localhost:3002/solana/transaction-count \
  -H "Content-Type: application/json" \
  -d '{"block":123}'
```

## Tests
- Run API tests: `pnpm --filter @solana/api test`
  - Includes an integration test that spies on the Solana RPC (`getBlock`) and verifies the API response format

## Notes
- The API uses `@solana/web3.js` and fetches block data via `Connection.getBlock(slot)`.
- CORS is enabled and reads `CORS_ORIGIN` from the API `.env`.
- The web app reads `NEXT_PUBLIC_API_BASE_URL` and calls the API accordingly.

## Docker Deployment

### Build & Run with Docker Compose

```bash
docker compose up --build -d
```

- Web: `http://localhost:3000`
- API: `http://localhost:3002`

Environment values are configured in `docker-compose.yml`:
- API service
  - `API_PORT=3002`
  - `CORS_ORIGIN=http://localhost:3000`
  - `SOLANA_RPC_URL=https://api.mainnet-beta.solana.com`
- Web service
  - `PORT=3000`
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:3002`

### Standalone Builds
Build API image:
```bash
docker build -f apps/api/Dockerfile -t solana-api:latest .
docker run -e API_PORT=3002 -e CORS_ORIGIN=http://localhost:3000 -p 3002:3002 solana-api:latest
```

Build Web image:
```bash
docker build -f apps/web/Dockerfile -t solana-web:latest .
docker run -e PORT=3000 -e NEXT_PUBLIC_API_BASE_URL=http://localhost:3002 -p 3000:3000 solana-web:latest
```

### Production Tips
- Use a dedicated RPC URL (e.g., QuickNode, Helios, or an official endpoint) and set `SOLANA_RPC_URL`.
- Behind a reverse proxy, set `CORS_ORIGIN` to your actual public URL.
- Consider Next.js `output: 'standalone'` for slimmer images if needed.

## Author
- cuongnm (https://github.com/evanbarbatos)