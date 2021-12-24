import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8081 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    const jsonData = JSON.parse(data)
    console.log('received: %s', jsonData.data);
  });

  ws.send('something from server');
});