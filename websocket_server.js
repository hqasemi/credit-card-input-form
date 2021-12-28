import {WebSocketServer} from 'ws';
import path from "path";
import express from "express";

const wss = new WebSocketServer({port: 8081});

export const SERVER_HELLO = 'SERVER_HELLO';

export const POST_PAYMENT_INFO = 'POST_PAYMENT_INFO';
export const POST_PAYMENT_INFO_FAILURE = 'POST_PAYMENT_INFO_FAILURE';
export const POST_PAYMENT_INFO_SUCCESS = 'POST_PAYMENT_INFO_SUCCESS';


wss.on('connection', function connection(ws) {
    ws.on('message', function message(dataFromClient) {
        const jsonData = JSON.parse(dataFromClient)
        console.log('received: %s', jsonData.data);

        const event = jsonData.event
        const data = jsonData.data

        if (event === POST_PAYMENT_INFO) {
            if (isRequestSuccessful(data)) {
                console.error("invalid card number")
                const serverResponse = {
                    event: POST_PAYMENT_INFO_FAILURE,
                    data: {error: "This card number is not valid"}
                }
                console.debug(`Server Response: ${JSON.stringify(serverResponse)}`)
                ws.send(JSON.stringify(serverResponse));
                return
            }

            console.log(`Save to db: ${JSON.stringify(data)}`)
            const serverResponse = {
                event: POST_PAYMENT_INFO_SUCCESS,
                data: {
                    ...data,
                    currency: "OMR",
                    amountToBePaid: convertCurrency(data)
                }
            }
            ws.send(JSON.stringify(serverResponse));
        }
    });

    ws.onopen = (event) => {
        console.debug('Server "onopen"')
        ws.send(JSON.stringify({"event": SERVER_HELLO}));
    };
});

const convertCurrency = (data) => data.currency === "USD" ? data.amountToBePaid * 0.39 : data.amountToBePaid

/**
 * Assumption:
 *    if the last 1 digit of the card is ‘5’ then the result is always failure, otherwise success.
 * @param data
 * @returns {boolean}
 */
const isRequestSuccessful = (data) => String(data.cardNumber)[15] === "5"


//  ------------------------------------------ Server React APP ----------------------------------------------
const __dirname = path.resolve();
const app = express();

//This will create a middleware.
//When you navigate to the root page, it would use the built react-app
app.use(express.static(path.resolve(__dirname, "./ui/build")));
app.listen(3001, () =>
    console.log('Example app listening on port 3000!'),
);
//  ----------------------------------------------------------------------------------------------------------
