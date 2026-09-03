/**
 * Cursor's preview tabs open a WebSocket to /_next/hmr (and the old
 * /_next/webpack-hmr path). Next.js 16 accepts that upgrade even in
 * `next start` and never completes the handshake, so the tab spinner
 * never finishes. This proxy closes those upgrades immediately.
 */
import http from "node:http";
import { spawn } from "node:child_process";

const PUBLIC_PORT = Number(process.env.PORT ?? 43173);
const INTERNAL_PORT = Number(process.env.INTERNAL_PORT ?? PUBLIC_PORT + 1);

function isHmr(url = "") {
  return url.startsWith("/_next/hmr") || url.startsWith("/_next/webpack-hmr");
}

const child = spawn(
  "npx",
  [
    "next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(INTERNAL_PORT),
  ],
  { stdio: "inherit", cwd: process.cwd() },
);

const server = http.createServer((req, res) => {
  if (isHmr(req.url)) {
    res.writeHead(404, { Connection: "close" });
    res.end();
    return;
  }

  const proxyReq = http.request(
    {
      hostname: "127.0.0.1",
      port: INTERNAL_PORT,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: `127.0.0.1:${INTERNAL_PORT}` },
    },
    (proxyRes) => {
      const headers = { ...proxyRes.headers, connection: "close" };
      delete headers["keep-alive"];
      res.writeHead(proxyRes.statusCode ?? 502, headers);
      proxyRes.pipe(res);
    },
  );
  proxyReq.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(502, { Connection: "close" });
    }
    res.end("Bad gateway");
  });
  req.pipe(proxyReq);
});

server.on("upgrade", (req, socket) => {
  socket.write("HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n");
  socket.destroy();
});

function waitForNext() {
  const probe = http.get(`http://127.0.0.1:${INTERNAL_PORT}/`, (res) => {
    res.resume();
    server.listen(PUBLIC_PORT, "0.0.0.0", () => {
      console.log(
        `Preview proxy http://0.0.0.0:${PUBLIC_PORT} -> 127.0.0.1:${INTERNAL_PORT}`,
      );
    });
  });
  probe.on("error", () => {
    setTimeout(waitForNext, 150);
  });
}

waitForNext();

function shutdown() {
  server.close();
  child.kill("SIGTERM");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
child.on("exit", (code) => {
  server.close();
  process.exit(code ?? 1);
});
