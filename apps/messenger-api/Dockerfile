FROM oven/bun:1 AS base

WORKDIR /app

COPY package*.json .
COPY . .

RUN bun install

EXPOSE 3000

CMD ["bun", "run", "dev"]
