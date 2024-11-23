FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# Copy the rest of the application
COPY package*.json .
COPY . .

# Install dependencies
RUN pnpm install

# Expose Vite's default port
EXPOSE 5173

# Use --host to make the server accessible outside the container
CMD ["pnpm", "run", "dev"]