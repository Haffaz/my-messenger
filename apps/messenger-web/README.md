# Messenger Web

React-based web client for the messenger application with real-time chat capabilities.

## Features

- Real-time messaging with GraphQL subscriptions
- Thread-based conversations
- JWT authentication
- Responsive design with TailwindCSS
- Type-safe GraphQL operations

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm package manager
- Running messenger-api instance

### Development

```bash
# Install dependencies
pnpm install

# Generate GraphQL types
pnpm codegen

# Start development server
pnpm dev
```

## Project Structure

```
src/
├── components/     # React components
│   ├── chat/      # Chat-related components
│   └── thread/    # Thread-related components
├── contexts/      # React contexts
├── graphql/       # GraphQL operations and types
└── utils/         # Utility functions
```

## Available Scripts

- `pnpm build`: Build for production
- `pnpm dev`: Start development server
- `pnpm codegen`: Generate GraphQL types
- `pnpm preview`: Preview production build

## Docker

Build and run the web client in a container:

```bash
docker build -t messenger-web .
docker run -p 5173:5173 messenger-web
```
