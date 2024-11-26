# Turborepo Messenger

A modern monorepo setup for a real-time messaging application built with React and GraphQL.

## Project Structure

### Applications

#### `messenger-web` (Frontend)
- React application built with:
  - Vite
  - Apollo Client
  - TailwindCSS
  - Real-time WebSocket subscriptions
  - TypeScript

#### `messenger-api` (Backend)
- GraphQL API server built with:
  - Apollo Server
  - Prisma (PostgreSQL)
  - WebSocket subscriptions
  - JWT authentication

### Shared Packages
- `@repo/shared-types`: Shared TypeScript types and Zod schemas for:
  - Authentication
  - Messages
  - Threads

## Quick Start

```sh
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all applications
pnpm build
```

## Features

### Frontend
- Real-time chat interface
- Thread-based conversations
- User authentication
- Responsive design
- Type-safe GraphQL operations

### Backend
- GraphQL API with subscriptions
- JWT-based authentication
- PostgreSQL database with Prisma
- Type-safe resolvers
- Shared validation schemas

## Tech Stack

### Frontend
- **Framework**: [React](https://react.dev)
- **Build Tool**: [Vite](https://vitejs.dev)
- **GraphQL Client**: [Apollo Client](https://www.apollographql.com/docs/react/)
- **Styling**: [TailwindCSS](https://tailwindcss.com)

### Backend
- **API Framework**: [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Real-time**: GraphQL Subscriptions with WebSocket

### Shared
- **Build System**: [Turborepo](https://turbo.build/repo)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Code Quality**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io)

## Development

### Environment Setup

1. Create a PostgreSQL database
2. Copy `.env.example` to `.env` in the messenger-api directory
3. Update the DATABASE_URL in `.env`
4. Run database migrations:
```sh
cd apps/messenger-api
pnpm prisma migrate dev
```

### Running the Applications

```sh
# Start all applications in development mode
pnpm dev

# Start specific applications
pnpm --filter messenger-web dev
pnpm --filter messenger-api dev
```

## Documentation

- [Frontend Documentation](apps/messenger-web/README.md)
- [Backend Documentation](apps/messenger-api/README.md)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [Prisma Docs](https://www.prisma.io/docs)
