import prisma from "../db/db";
import type { User } from "../generated/prisma";
import {
  createUserSchema,
  loginUserSchema,
  type CreateUserPayloadType,
  type LoginUserPayloadType,
} from "../validations/userValidations";
import jwt from "jsonwebtoken";

export class UserService {
  public static async createUser(
    payload: CreateUserPayloadType
  ): Promise<Omit<User, "password"> | null> {
    // Validate input data
    const validation = createUserSchema.safeParse(payload);

    if (!validation.success) {
      throw new Error(validation.error.errors.map((e) => e.message).join(", "));
    }

    // Destructure validated data
    const { firstName, lastName, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash the password before storing it
    const hashedPassword = await Bun.password.hash(password);

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    // Exclude the password from the returned user object
    const { password: _, ...userWithoutPassword } = newUser;

    // Return the user object without the password
    return userWithoutPassword;
  }

  public static async loginUser(
    payload: LoginUserPayloadType
  ): Promise<{ token: string }> {
    // Validate input data
    const validation = loginUserSchema.safeParse(payload);

    if (!validation.success) {
      throw new Error(validation.error.errors.map((e) => e.message).join(", "));
    }

    // Destructure validated data
    const { email, password } = validation.data;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify the password
    const isPasswordValid = await Bun.password.verify(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Generate a token using JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "24h",
        algorithm: "HS256",
      }
    );

    return { token };
  }
}
