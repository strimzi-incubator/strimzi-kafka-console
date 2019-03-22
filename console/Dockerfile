FROM node:8 as build

WORKDIR /app
# copy everything in the current dir to /app
# except whatever is excluded in .dockerignore
COPY . .

RUN yarn install 

RUN yarn build

# remove the node_modules directory to further slim down the image
RUN yarn rimraf node_modules

# we need the debug module to run the node http server
RUN npm install debug

# use a very small version of linux to run the node http server
FROM node:8-alpine

# copy our /dist /bin /lib
COPY --from=build /app /

ARG rest_host=strimzi-console-server
ARG rest_port=8080
ARG listen_port=8888
ENV REST_HOST=${rest_host} REST_PORT=${rest_port} LISTEN_PORT=${listen_port}

EXPOSE 8888

CMD [ "npm", "run-script", "docker-run" ]
