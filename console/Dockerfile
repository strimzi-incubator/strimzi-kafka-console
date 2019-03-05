FROM node:11

ARG rest_host=localhost
ARG rest_port=8080
ARG listen_port=8888
ENV REST_HOST=${rest_host} REST_PORT=${rest_port} LISTEN_PORT=${listen_port}

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#RUN npm install
# don't install the dev dependencies
RUN npm --errors ci --only=production

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8888

CMD [ "/usr/src/app/start-node.sh" ]
