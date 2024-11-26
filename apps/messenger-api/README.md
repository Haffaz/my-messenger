# Messenger API

GraphQL API server for the messenger application with real-time messaging capabilities.

## Features

- GraphQL API with Apollo Server
- Real-time messaging with WebSocket subscriptions
- JWT-based authentication
- PostgreSQL database with Prisma ORM
- Type-safe resolvers and schemas

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- pnpm package manager

### Environment Setup

1. Create a `.env` file:
```bash
cp .env.example .env
```

2. Update the following variables in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/messenger"
JWT_SECRET="your-secret-key"
```

### Development

```bash
# Install dependencies
pnpm install

# Generate Prisma client and GraphQL types
pnpm codegen

# Run database migrations
pnpm prisma migrate dev

# Seed the database
pnpm prisma db seed

# Start development server
pnpm dev
```

## API Structure

### GraphQL Schema
- `auth`: User authentication and authorization
- `messages`: Message creation and queries
- `threads`: Conversation threads management

### Database Schema
- `users`: User accounts and authentication
- `messages`: Chat messages
- `threads`: Conversation threads
- `threadParticipants`: Thread membership

## Available Scripts

- `pnpm build`: Build the application
- `pnpm dev`: Start development server
- `pnpm codegen`: Generate GraphQL types
- `pnpm start`: Start production server

## Docker

Build and run the API in a container:

```bash
docker build -t messenger-api .
docker run -p 4000:4000 messenger-api
``` 