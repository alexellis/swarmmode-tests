FROM alpine

RUN apk --update add nodejs

WORKDIR /root/
ADD ./package.json ./package.json

RUN npm i
ADD ./index.js ./index.js

EXPOSE 3000
CMD ["npm", "start"]
