import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes go here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Mahid Telecom Backend is running!" });
  });

  // This is where you would handle real recharge API calls
  app.post("/api/recharge", async (req, res) => {
    const { phone, amount, operator, pin } = req.body;
    
    // Example: Check if API key exists
    const RECHARGE_API_KEY = process.env.RECHARGE_API_KEY;
    
    if (!RECHARGE_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error: Recharge API key is missing." 
      });
    }

    // Here you would call your real telecom provider's API using RECHARGE_API_KEY
    console.log(`Processing recharge for ${phone} with amount ${amount} using API key...`);

    // For now, returning a mock success
    res.json({ 
      success: true, 
      transactionId: `TXN${Date.now()}`,
      message: "Recharge request sent successfully!" 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
