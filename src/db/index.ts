import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

config({ path: ".env" });

let db: any | undefined;

try {
  const connectionUrl = process.env.TURSO_CONNECTION_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!connectionUrl || !authToken) {
    throw new Error("CODE:999");
  }

  db = drizzle({
    connection: {
      url: connectionUrl,
      authToken: authToken,
    },
  });
} catch (error: unknown) {
  if (error instanceof Error) {
    throw new Error("CODE:998");
  } else {
    throw new Error("CODE:997");
  }
}

export { db };
