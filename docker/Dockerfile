from ubuntu:latest
run cd home && apt-get update -y \
    &&  apt-get install vim -y \
    &&  apt-get install git -y \
    &&  apt-get install npm -y \
    &&  npm install -g yarn -y \
    &&  git clone --recursive https://github.com/zpparks314/theia-plugin.git
    &&  cd theia-plugin/my-ide
    &&  yarn && yarn theia build
