import { loginSchema } from "@repo/shared-types";
import { GraphQLError } from "graphql";
import { z } from "zod";
import { generateAuthToken } from "../../utils/auth";
import { comparePasswords } from "../../utils/password";
import { MyResolvers } from "./derived-types";

export const authResolvers: MyResolvers = {
  Mutation: {
    login: async (_, { input }, context) => {
      try {
        // Validate input using Zod
        const validatedInput = loginSchema.parse(input);

        // Find user in database
        const user = await context.prisma.user.findUnique({
          where: { username: validatedInput.username },
        });

        if (!user) {
          throw new GraphQLError("Invalid credentials", {
            extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
          });
        }

        // Verify password
        const isValidPassword = await comparePasswords(
          validatedInput.password,
          user.passwordHash,
        );

        if (!isValidPassword) {
          throw new GraphQLError("Invalid credentials", {
            extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
          });
        }

        // Generate JWT token
        const token = generateAuthToken({ id: user.id });

        return {
          token,
          user,
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new GraphQLError("Validation error", {
            extensions: {
              code: "BAD_USER_INPUT",
              http: { status: 400 },
              validationErrors: error.errors,
            },
          });
        }
        throw error;
      }
    },
  },
};
