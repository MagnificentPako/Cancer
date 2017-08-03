const WebSocket = require("ws")
const net = require("net")

const HOST = "127.0.0.1"
const PORT = 6969

var messages = []
var socket = null

var server = net.createServer();
server.listen(PORT, HOST)
server.on("connection", (sock) => {

    var wss_relay = []

    const wss = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json")
    wss.onclose = wss.onerror = console.log

    wss.on("message", (data) => {
        console.log(">> " + data)
        sock.write(data)
        sock.write(";")
    })

    wss.on("open", () => {console.log("READY"); sock.write("c;")})

    sock.on("data", (data) => {
        if(data == ";") return
        if (wss.readyState !== WebSocket.OPEN) {
            wss_relay.push(data)
        }else{
            if(wss_relay.length > 0) {
                wss_relay.forEach((rel) => {
                    console.log("relay<< " + JSON.stringify(JSON.parse(data)))
                    wss.send(JSON.stringify(JSON.parse(data)))
                })
                wss_relay = []
            }
            console.log("<< " + JSON.stringify(JSON.parse(data)))
            wss.send(JSON.stringify(JSON.parse(data)))
        }
    })
})

