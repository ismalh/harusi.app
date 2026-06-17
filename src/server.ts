async function getServerEntry() {
  const m = await import("@tanstack/react-start/server-entry");
  return (m.default ?? m) as { fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response };
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const handler = await getServerEntry();
    return handler.fetch(request, env, ctx);
  },
};