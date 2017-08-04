const WebSocket = require("ws")
const net = require("net")
const tls = require("tls")
require("longjohn")

const WSS_HOST = "127.0.0.1"
const WSS_PORT = 6969

const HTTP_HOST = "127.0.0.1"
const HTTP_PORT = 4242

var messages = []
var socket = null

var http_server = net.createServer()
http_server.listen(HTTP_PORT, HTTP_HOST)
http_server.on("connection", (sock) => {
    var s = tls.connect({host: "discordapp.com", port: 443}, () => {
        sock.on("data", (data) => {
            var d = data.toString()
            s.write(d.replace("Host: localhost:4242", "Host: discordapp.com:443"))
            console.log(d.replace("Authorization: Bot MzAxNjc5NzI3NTQwNjk5MTM2.DGZsiA.9ZGj7p-FLOm33_PmNQdSQQCxqeo\r\n", ""))
        })
        s.on("data", (data) => {
            sock.write(data)
            console.log(data.toString())
        })
        s.on("error", () => {})
        sock.on("error", () => {})
    })
    sock.onclose = sock.onerror = console.log
    s.onclose = s.onerror = console.log
})

var wss_server = net.createServer()
wss_server.listen(WSS_PORT, WSS_HOST)
wss_server.on("connection", (sock) => {

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
                    //console.log("relay<< " + JSON.stringify(JSON.parse(data)))
                    wss.send(JSON.stringify(JSON.parse(data)))
                })
                wss_relay = []
            }
            //console.log("<< " + JSON.stringify(JSON.parse(data)))
            wss.send(JSON.stringify(JSON.parse(data)))
        }
    })
})

