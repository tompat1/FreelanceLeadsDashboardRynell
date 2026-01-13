const fs = require("fs/promises");
const http = require("http");
const path = require("path");

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, "dist");
const STATIC_FILES = ["index.html", "styles.css", "app.js"];

const contentTypeFor = (filePath) => {
  if (filePath.endsWith(".html")) {
    return "text/html";
  }
  if (filePath.endsWith(".css")) {
    return "text/css";
  }
  if (filePath.endsWith(".js")) {
    return "application/javascript";
  }
  return "text/plain";
};

const ensureDist = async () => {
  await fs.mkdir(DIST_DIR, { recursive: true });
  await Promise.all(
    STATIC_FILES.map(async (file) => {
      await fs.copyFile(path.join(ROOT, file), path.join(DIST_DIR, file));
    })
  );
};

const createStaticServer = async ({ root, host, port }) => {
  const server = http.createServer(async (req, res) => {
    const requestUrl = req.url ? decodeURIComponent(req.url) : "/";
    const resolvedPath =
      requestUrl === "/" ? "/index.html" : requestUrl.split("?")[0];
    const filePath = path.join(root, resolvedPath);

    try {
      const data = await fs.readFile(filePath);
      res.writeHead(200, { "Content-Type": contentTypeFor(filePath) });
      res.end(data);
    } catch (error) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
  });

  await new Promise((resolve) => {
    server.listen(port, host, resolve);
  });

  return server;
};

const runFallback = async ({ command, once }) => {
  if (command === "build") {
    await ensureDist();
    return;
  }

  if (command === "preview" || command === "dev") {
    if (command === "preview") {
      await ensureDist();
    }

    const rootDir = command === "preview" ? DIST_DIR : ROOT;
    const port = command === "preview" ? 4173 : 5173;
    const server = await createStaticServer({ root: rootDir, host: "127.0.0.1", port });

    if (once) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      server.close();
    }
  }
};

const runWithVite = async ({ command, once }) => {
  const vite = await import("vite");

  if (command === "build") {
    await vite.build({ root: ROOT });
    return;
  }

  if (command === "dev") {
    const server = await vite.createServer({
      root: ROOT,
      server: { host: "127.0.0.1", port: 5173 },
    });
    await server.listen();
    return;
  }

  if (command === "preview") {
    const previewServer = await vite.preview({
      root: ROOT,
      preview: { host: "127.0.0.1", port: 4173, strictPort: true },
    });

    if (once) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (previewServer.close) {
        await previewServer.close();
      } else if (previewServer.httpServer) {
        previewServer.httpServer.close();
      }
    }
  }
};

const main = async () => {
  const [command, ...rest] = process.argv.slice(2);
  const once = rest.includes("--once");

  try {
    await runWithVite({ command, once });
  } catch (error) {
    await runFallback({ command, once });
  }
};

main();
