from ubuntu:latest
run chmod -R 777 /root/
run cd home && apt-get update -y &&  apt-get install -y vim git npm curl
run curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
run echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
run apt-get update -y && apt-get install -y yarn \
    && git clone --recursive https://github.com/theia-ide/theia.git \
    && cd theia && yarn && cd ../
