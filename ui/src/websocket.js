// let ws = null
//
//
// class WebSocketSingleton {
//     constructor() {
//         // TODO: read url from env
//         ws = new WebSocket('ws://localhost:8081')
//         // this.#ws.onmessage = function (e) {
//         //     console.log('websocket message event:', e)
//         // }
//
//         ws.onclose = function () {
//             // connection closed, discard old websocket and create a new one in 5s
//             ws = null
//             setTimeout(startWebsocket, 5000)
//         }
//     }
//
//     get ws() {
//         return ws;
//     }
//
// }
//

//
// export const websocket_obj = new WebSocketSingleton()

let ws = null

export function startWebsocket() {
    console.debug("starting a websocket connection")
    ws = new WebSocket('ws://localhost:8081')

    ws.onmessage = function (e) {
        console.log('websocket message event:', e)
    }

    ws.onclose = function () {
        // connection closed, discard old websocket and create a new one in 5s
        ws = null
        setTimeout(startWebsocket, 5000)
    }
    return ws
}

// export startWebsocket();