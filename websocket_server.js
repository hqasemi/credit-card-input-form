import {WebSocketServer} from 'ws';

const wss = new WebSocketServer({port: 8081});

wss.on('connection', function connection(ws) {
    ws.on('message', function message(dataFromClient) {
        const jsonData = JSON.parse(dataFromClient)
        console.log('received: %s', jsonData.data);

        const event = jsonData.event
        const data = jsonData.data

        if (event === 'payment_info') {
            if (String(data.number)[15]==="5"){
                console.error("invalid card number")
                const serverResponse = {
                    event:event,
                    success: false,
                    data: {error: "This card number is not valid"}
                }
                console.debug(`Server Response: ${JSON.stringify(serverResponse)}`)
                ws.send(JSON.stringify(serverResponse));
                return
            }

            console.log(`Save to db: ${JSON.stringify(data)}`)
            const serverResponse = {
                event: event,
                success: true,
                data: {
                    ...data,
                    currency: "OMR",
                    amountToBePaid: convertCurrency(data)
                }
            }
            ws.send(JSON.stringify(serverResponse));
        }
    });

    ws.send('something from server');
});

const convertCurrency = (data) => data.currency === "USD"? data.amountToBePaid * 0.39 : data.amountToBePaid