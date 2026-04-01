import http from 'http';
import { Server as SocketServer } from 'socket.io';
import app from './app';
import db from './config/db';
import env from './config/env';
import { initSocket } from './socket/chat.socket';

const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: { origin: env.FRONTEND_URL, methods: ['GET', 'POST'] },
});

initSocket(io);

const start = async () => {
  await db.connect();
  server.listen(env.PORT, () => {
    console.log(`🚀 Folio backend running on port ${env.PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
