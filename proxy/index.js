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

function byteLength(str) {
  // returns the byte length of an utf8 string
  var s = str.length;
  for (var i=str.length-1; i>=0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s+=2;
    if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
  }
  return s;
}

var http_server = net.createServer()
http_server.listen(HTTP_PORT, HTTP_HOST)
http_server.on("connection", (sock) => {
    var s = tls.connect({host: "discordapp.com", port: 443}, () => {
        sock.on("data", (data) => {
            var d = data.toString()
            s.write(d.replace("Host: localhost:4242", "Host: discordapp.com:443"))
            console.log(d.replace(/Authorization: Bot .+\r\n/g, ""))
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
        sock.write(byteLength(data.toString()) + "\r\n")
        sock.write(data)
    })

    wss.on("open", () => {console.log("READY");})

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
            console.log(data.toString())
            console.log("<< " + JSON.stringify(JSON.parse(data)))
            wss.send(JSON.stringify(JSON.parse(data)))
        }
    })
})

