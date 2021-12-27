const WEBSOCKET_SERVER_ADDR = process.env.REACT_APP_WEBSOCKET_SERVER_ADDR

let ws = null

/**
 * Connects to the server that is given using env (REACT_APP_WEBSOCKET_SERVER_ADDR)
 * @returns {WebSocket}
 */
export function startWebsocket() {

    console.debug(`Trying to start a websocket connection to "${WEBSOCKET_SERVER_ADDR}"`)
    ws = new WebSocket(WEBSOCKET_SERVER_ADDR)

    ws.onmessage = function (e) {
        console.log('websocket message event:', e)
    }

    // ws.onclose = function () {
    //     console.debug('websocket "onclose"')
    //     // connection closed, discard old websocket and create a new one in 5s
    //     ws = null
    //     setTimeout(startWebsocket, WEBSOCKET_RECONNECT_INTERVAL_IN_MS)
    // }
    return ws
}

