FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune messenger-web --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy json files from pruned workspace
COPY --from=builder /app/out/json/ .
RUN pnpm install

# Copy source files from pruned workspace
COPY --from=builder /app/out/full/ .
RUN pnpm turbo build --filter=messenger-web...

# Development stage
FROM base AS development
WORKDIR /app
COPY --from=installer /app .
EXPOSE 5173
CMD ["pnpm", "run", "dev"]