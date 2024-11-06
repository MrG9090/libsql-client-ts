import { createClient } from "@libsql/client";

async function example() {
    const config = {
        url: process.env.URL ?? "file:local.db",
        encryptionKey: process.env.ENCRYPTION_KEY,
    };
    const db = createClient(config);
    await db.batch(
        [
            "CREATE TABLE IF NOT EXISTS users (email TEXT)",
            "INSERT INTO users (email) VALUES ('alice@example.com')",
            "INSERT INTO users (email) VALUES ('bob@example.com')",
        ],
        "write",
    );

    await db.batch(
        [
            {
                sql: "INSERT INTO users (email) VALUES (?)",
                args: ["alice@example.com"],
            },
            ["INSERT INTO users (email) VALUES (?)", ["bob@example.com"]],
            {
                sql: "INSERT INTO users (email) VALUES (:email)",
                args: { email: "charlie@example.com" },
            },
        ],
        "write",
    );

    const rs = await db.execute("SELECT * FROM users");
    console.log(rs);
}

await example();
