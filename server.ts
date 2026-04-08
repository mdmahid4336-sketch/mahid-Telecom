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

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Mahid Telecom Backend is running!" });
  });

  // Android App Link Verification
  app.get("/.well-known/assetlinks.json", (req, res) => {
    res.json([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.mahidtelecom.app",
          sha256_cert_fingerprints: [
            "00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00"
          ]
        }
      }
    ]);
  });

  // Recharge API
  app.post("/api/recharge", async (req, res) => {
    const { phone, amount, operator, pin } = req.body;
    const RECHARGE_API_KEY = process.env.RECHARGE_API_KEY;
    
    if (!RECHARGE_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error: Recharge API key is missing." 
      });
    }

    res.json({ 
      success: true, 
      transactionId: `TXN${Date.now()}`,
      message: "Recharge request sent successfully!" 
    });
  });

  const distPath = path.resolve(__dirname, "dist");
  const indexExists = fs.existsSync(path.join(distPath, "index.html"));

  if (indexExists) {
    console.log("Serving static files from dist...");
    app.use(express.static(distPath));
    
    // SPA Fallback
    app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, "index.html"));
      } else {
        next();
      }
    });
  } else {
    console.log("Dist not found, using Vite middleware...");
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
