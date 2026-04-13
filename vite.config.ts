import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { handleOrderPayload } from "./api/orderHandler";

/** Локальный POST /api/order при `vite` / `npm run server` (как у Vercel). */
function orderApiDevPlugin(): Plugin {
  return {
    name: "order-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathOnly = (req.url ?? "").split("?")[0];
        if (pathOnly !== "/api/order") {
          next();
          return;
        }

        const nodeRes = res as unknown as ServerResponse;
        const nodeReq = req as unknown as IncomingMessage;

        if (req.method === "OPTIONS") {
          nodeRes.statusCode = 204;
          nodeRes.setHeader("Access-Control-Allow-Origin", "*");
          nodeRes.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
          nodeRes.setHeader("Access-Control-Allow-Headers", "Content-Type");
          nodeRes.end();
          return;
        }

        if (req.method !== "POST") {
          nodeRes.statusCode = 405;
          nodeRes.setHeader("Content-Type", "application/json; charset=utf-8");
          nodeRes.setHeader("Access-Control-Allow-Origin", "*");
          nodeRes.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
          return;
        }

        try {
          const raw = await readRequestBody(nodeReq);
          let parsed: unknown = null;
          if (raw.length > 0) {
            try {
              parsed = JSON.parse(raw) as unknown;
            } catch {
              parsed = null;
            }
          }
          const result = await handleOrderPayload(parsed);
          nodeRes.statusCode = result.status;
          nodeRes.setHeader("Content-Type", "application/json; charset=utf-8");
          nodeRes.setHeader("Access-Control-Allow-Origin", "*");
          nodeRes.end(JSON.stringify(result.json));
        } catch (e) {
          console.error("[order-api-dev]", e);
          nodeRes.statusCode = 500;
          nodeRes.setHeader("Content-Type", "application/json; charset=utf-8");
          nodeRes.setHeader("Access-Control-Allow-Origin", "*");
          nodeRes.end(
            JSON.stringify({ ok: false, error: "Внутренняя ошибка сервера" }),
          );
        }
      });
    },
  };
}

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export default defineConfig(({ mode }) => {
  // Подхватываем .env без префикса (TELEGRAM_*), чтобы dev-middleware видел токен
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined && value !== "") {
      process.env[key] = value;
    }
  }

  return {
    base: "/the-master-retires-the-tool-goes-into-work/",
    // Вне node_modules: на Windows при перезапуске после смены config часто EPERM на rmdir node_modules/.vite/deps (антивирус / блокировка файлов).
    cacheDir: ".vite",
    plugins: [react(), orderApiDevPlugin()],
  };
});
