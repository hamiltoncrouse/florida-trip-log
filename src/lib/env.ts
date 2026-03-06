import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Florida Trip"),
});

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;

const isServer = typeof window === "undefined";

let serverEnv: ServerEnv;

if (isServer) {
  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid server environment variables", result.error.flatten().fieldErrors);
    // During build, DATABASE_URL might not be there yet, but we need it for Prisma
    serverEnv = { DATABASE_URL: process.env.DATABASE_URL || "" } as ServerEnv;
  } else {
    serverEnv = result.data;
  }
} else {
  serverEnv = {} as ServerEnv;
}

export { serverEnv };
export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});
