# Shared Types

Shared TypeScript types and Zod schemas for the messenger application.

## Overview

This package contains shared type definitions and validation schemas used across the messenger application's frontend and backend.

## Structure

```
src/
├── auth.ts      # Authentication types and schemas
├── message.ts   # Message types and schemas
└── thread.ts    # Thread types and schemas
```

## Usage

```typescript
import { loginSchema, type LoginInput } from "@repo/shared-types";

// Use Zod schema for validation
const validatedInput = loginSchema.parse(input);

// Use TypeScript type
const login: LoginInput = {
  username: "john",
  password: "password123"
};
```

## Available Types

### Authentication
- `LoginInput`
- `loginSchema`

### Messages
- `SendMessageInput`
- `GetMessagesInput`
- `sendMessageInputSchema`
- `getMessagesSchema`

### Threads
- `CreateThreadInput`
- `createThreadInputSchema`