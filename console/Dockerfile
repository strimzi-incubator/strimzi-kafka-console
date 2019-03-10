FROM node:11

ARG rest_host=strimzi-console-server
ARG rest_port=8080
ARG listen_port=8888
ENV REST_HOST=${rest_host} REST_PORT=${rest_port} LISTEN_PORT=${listen_port}

# Create app directory
WORKDIR /usr/src/app

# copy everything in the current dir to /usr/src/app
# except whatever is excluded in .dockerignore
COPY . .

RUN yarn install

RUN yarn build

EXPOSE 8888

CMD [ "/usr/src/app/start-node.sh" ]
