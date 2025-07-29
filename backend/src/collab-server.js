// Yjs WebSocket server with MongoDB persistence
const http = require('http');
const WebSocket = require('ws');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;
const { MongoClient } = require('mongodb');
const { setPersistence } = require('y-websocket/bin/utils');
const { MongoDBPersistence } = require('y-mongodb');

const port = process.env.COLLAB_PORT || 1234;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/yjs-collab';

// Set up MongoDB persistence for Yjs
const persistence = new MongoDBPersistence(mongoUrl);
setPersistence(persistence);

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  // Each document is identified by the room name in the URL
  const docName = req.url.slice(1).split('?')[0];
  setupWSConnection(ws, req, { docName });
});

server.listen(port, () => {
  console.log(`Yjs WebSocket server running on port ${port}`);
});