declare module "@prisma/nextjs-monorepo-workaround-plugin" {
  export class PrismaPlugin {
    // The plugin doesn't publish types; keep it loose.
    apply(compiler: unknown): void;
  }
}
