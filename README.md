# Cancer

## About

A proof-of-concept Discord bot written in Emojicode 0.5 using a NodeJS based
proxy for the HTTPS and WSS part.

The proxy itself is doing the smallest amount of work possible:
In the case of HTTP traffic all it does is make the connection secure.
For WSS it gets a little bit more complicated: I "re-frame" the payload
sent by the discord gateway and send it over the socket to Cancer. The same
thing happens the other way around. This way I don't have to handle reading
and writing bytes for the websockets frames, which would become rather
tedious thanks to the limited non-string writing/reading in Emojicode.

This bot is, as the introduction already said, just a proof-of-concept. It
does _NOT_ send heartbeat packets, making it unviable for actual bots.
However it encorporates some interesting concepts like converting parsed
JSON (which normally turns into ○, which is basically `any`) into classes,
allowing you to easily access data. This can be seen in `main.emojic` where
I first parse `d` into a message object, and then obtain the author's id
with `🆔👤message`. Later on I also aquire the channel id with `🏠message`.
This way answering a message can be as easy as `💬discord 🏠message 🔤Hello!🔤`.

Also keep in mind that this is from my pre-package phase. I have another
proof-of-concept bot lying around somewhere that uses a custom package
written in C++, which provides access to both HTTPS and WSS, making the
proxy obsolete. Because of that I suggest you only use this for educational
purposes.

## Usage

Running the example bot is rather easy:
First go into the `proxy` folder, run `yarn` or `nmp install`, then run the
proxy. Afterwards you compile `main.emojic`, set the `TOKEN` env var to
your bot token, and execute `main.emojib`. I suggest replacing the id on
line 21 with your bot's id though because otherwise it'll run into an
infinite reply loop and soon break the discord ratelimits.
