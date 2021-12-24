import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:8081/');

ws.on('open', function open() {
  const data = JSON.stringify({
    message:"message_type",
    data:{name: "Ali"}
  })
  ws.send(data);
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});