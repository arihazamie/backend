import { db } from "@/lib/database";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import * as z from "zod"

const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  })

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = userSchema.parse(body);

    // Check for existing user email & username:
    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      const message = existingUser.email === email
        ? "Email or Username already exists"
        : "Email or Username already exists";
      return NextResponse.json({ user: null, message }, { status: 409 });
    }

    // Hash password and create user:
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({ data: { username, email, password: hashPassword } });

    const {password: newUserPassword, ...rest} = newUser

    // Return success response:
    return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 });
  } catch (error) {
    // Handle errors appropriately, e.g., log specific errors and return a generic error response to the client:
    return NextResponse.json({ message: "An error occurred", error: true }, { status: 500 });
  }
}
