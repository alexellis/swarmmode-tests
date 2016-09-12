FROM mhart/alpine-node:4.4
ADD ./package.json ./package.json
RUN npm i
ADD ./app.js ./app.js

EXPOSE 9000

RUN apk --update add curl

HEALTHCHECK CMD curl --fail -s localhost:9000/guid || exit 1

CMD ["npm", "start"]
