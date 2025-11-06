// worker.js

import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/ws', async (c) => {
  if (c.req.header('Upgrade') !== 'websocket') {
    return c.text('Upgrade header is missing', 400);
  }

  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();

  server.addEventListener('message', (event) => {
    console.log('Received:', event.data);
    server.send(`response: ${event.data}`);
  });

  server.addEventListener('close', () => {
    console.log('WebSocket closed');
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
});

export default app;