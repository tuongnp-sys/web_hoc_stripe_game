import { PrismaClient, Tier } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "demo123456";

async function upsertUser(
  email: string,
  tier: Tier,
  password: string,
  name: string
) {
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    create: { email, name, passwordHash, tier },
    update: { passwordHash, tier, name },
  });
}

async function main() {
  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD ?? "admin123456";

  await upsertUser(
    "admin@localhost",
    Tier.ADMIN,
    adminPassword,
    "Admin Demo"
  );
  await upsertUser("pro@localhost", Tier.PRO, DEMO_PASSWORD, "Pro Demo");
  await upsertUser("vip@localhost", Tier.VIP, DEMO_PASSWORD, "Vip Demo");

  console.log("Seed OK:");
  console.log("  admin@localhost /", adminPassword, "→ ADMIN");
  console.log("  pro@localhost /", DEMO_PASSWORD, "→ PRO");
  console.log("  vip@localhost /", DEMO_PASSWORD, "→ VIP");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
