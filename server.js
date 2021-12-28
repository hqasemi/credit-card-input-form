// const {Server} = require('ws');
const path = require('path');
const express = require('express');
const server = express();
const expressWs = require('express-ws')(server);
const cors = require('cors')

const CURRENCY_EXCHANGE_RATE_USD_TO_ORM = 0.39

const EXPRESS_SERVER_PORT = process.env.PORT || 3000

// Websocket events
const SERVER_HELLO = 'SERVER_HELLO';
const POST_PAYMENT_INFO = 'POST_PAYMENT_INFO';
const POST_PAYMENT_INFO_FAILURE = 'POST_PAYMENT_INFO_FAILURE';
const POST_PAYMENT_INFO_SUCCESS = 'POST_PAYMENT_INFO_SUCCESS';


//  ------------------------------------------ Server React APP ----------------------------------------------

//This will create a middleware.
//When you navigate to the root page, it would use the built react-app
server.use(express.static(path.resolve(__dirname, "./ui/build")));
server.use(cors());
server.listen(EXPRESS_SERVER_PORT, () =>
    console.log(`Example app listening on port ${EXPRESS_SERVER_PORT}!`),
);
//  ----------------------------------------------------------------------------------------------------------

console.log("Trying to run a websocket server...")
// The reference following reference didnt' work:
// https://devcenter.heroku.com/articles/node-websockets#create-a-websocket-server
//tried another way: https://stackoverflow.com/questions/68799988/cannot-connect-to-websocket-server-in-heroku

server.ws('/', function (ws, req) {
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

const convertCurrency = (data) => data.currency === "USD" ? data.amountToBePaid * CURRENCY_EXCHANGE_RATE_USD_TO_ORM : data.amountToBePaid

/**
 * Assumption:
 *    if the last 1 digit of the card is ‘5’ then the result is always failure, otherwise success.
 * @param data
 * @returns {boolean}
 */
const isRequestSuccessful = (data) => String(data.cardNumber)[15] === "5"

