FROM node:20-alpine AS base

# Install specific pnpm version
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@9.14.2 --activate

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN pnpm install -g turbo
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune messenger-web --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# Install all dependencies including devDependencies
RUN pnpm install --frozen-lockfile --prod=false
 
# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=messenger-web...

FROM base AS runner
WORKDIR /app

# Use a static file server since this is a frontend app
RUN pnpm add -g serve

COPY --from=installer /app/apps/messenger-web/dist .

# Serve the static files instead of trying to run node
CMD ["serve", "-s", ".", "-p", "5173"]
