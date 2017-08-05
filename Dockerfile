FROM phusion/baseimage

WORKDIR /cancer
COPY . .


CMD wget https://github.com/emojicode/emojicode/releases/download/v0.5/Emojicode-0.5.0-Linux-x86_64.tar.gz & tar xf Emojicode-0.5.0-Linux-x86_64.tar.gz & cp -r Emojicode-0.5.0-Linux-x86_64/packages/* /usr/local/EmojicodePackages
CMD Emojicode-0.5.0-Linux-x86_64/emojicodec src/main.emojic

CMD apt-get update & apt-get install -y wget & apt-get install -y nodejs & apt-get install -y npm
CMD curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - & echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list & sudo apt-get update && sudo apt-get install yarn
WORKDIR proxy
CMD yarn
WORKDIR /cancer


ENTRYPOINT Emojicode-0.5.0-Linux-x86_64/emojicode src/main.emojib & node proxy/index.js