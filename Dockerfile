FROM node:12-slim

RUN mkdir /subscription-service
COPY . /subscription-service

WORKDIR /subscription-service

RUN npm install --only=prod
RUN npm run build

CMD [ "npm", "run", "start:prod" ]
