FROM node:18.20-alpine3.20 AS base
RUN apk add --no-cache bash
RUN npm install -g pnpm@8.6.11

WORKDIR /mcp-server

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --production --frozen-lockfile

COPY . .

ENV PORT=3010
ENV NODE_ENV=production

EXPOSE 3010

CMD ["pnpm", "run", "prod:sse"]
