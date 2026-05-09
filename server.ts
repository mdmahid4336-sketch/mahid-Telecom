import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  const distPath = path.resolve(process.cwd(), "dist");
  const indexExists = fs.existsSync(path.join(distPath, "index.html"));

  // API routes and middleware must come BEFORE Vite/Static
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: indexExists ? "production" : "development" });
  });

  // Android App Link Verification
  app.get("/.well-known/assetlinks.json", (req, res) => {
    res.json([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.mahidtelecom.app",
          sha256_cert_fingerprints: ["00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00"]
        }
      }
    ]);
  });

  // Catch-all but prioritizing existing files
  if (indexExists) {
    console.log("Serving from dist folder...");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.log("Using Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
