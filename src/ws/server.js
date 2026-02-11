import { WebSocket, WebSocketServer } from "ws";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}

function broadCast(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      sendJson(client, payload);
    }
  }
}

export function attachWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  wss.on("connection", (socket) => {
    // Mark socket as alive
    socket.isAlive = true;

    sendJson(socket, { message: "Welcome" });

    // Listen for pong responses
    socket.on("pong", () => {
      socket.isAlive = true;
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  // Set up interval to check connections every 30 seconds
  const interval = setInterval(() => {
    wss.clients.forEach((socket) => {
      // If socket didn't respond to last ping, terminate it
      if (socket.isAlive === false) {
        return socket.terminate();
      }

      // Mark as not alive and send ping
      socket.isAlive = false;
      socket.ping();
    });
  }, 30000);

  // Clean up interval when server closes
  wss.on("close", () => {
    clearInterval(interval);
  });

  function broadcastMatchCreated(match) {
    broadCast(wss, { type: "matchCreated", data: match });
  }

  return { broadcastMatchCreated };
}
