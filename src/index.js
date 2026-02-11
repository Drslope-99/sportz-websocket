import express from "express";
import http from "http";
import { matchesRouter } from "./routes/matches.js";
import { attachWebSocket } from "./ws/server.js";

const app = express();
const PORT = Number.parseInt(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0";

const server = http.createServer(app);

// JSON middleware
app.use(express.json());

// GET route
app.get("/", (req, res) => {
  res.json({ message: "GET request received successfully" });
});

app.use("/matches", matchesRouter);

const { broadcastMatchCreated } = attachWebSocket(server);

app.locals.broadcastMatchCreated = broadcastMatchCreated;

// Start server and log URL
server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server is running on ${baseUrl}`);
  console.log(`WebSocket is running on ${baseUrl.replace("http", "ws")}/ws`);
});
