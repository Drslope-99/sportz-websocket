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
    sendJson(socket, { message: "Welcome" });

    wss.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  function broadcastMatchCreated(match) {
    broadCast(wss, { type: "matchCreated", data: match });
  }

  return { broadcastMatchCreated };
}
