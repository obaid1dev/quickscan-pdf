import { createFileRoute } from "@tanstack/react-router";

const CONTENT = "google.com, pub-1138568424665362, DIRECT, f08c47fec0942fa0\n";

export const Route = createFileRoute("/app-ads.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(CONTENT, {
          headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
        }),
    },
  },
});
