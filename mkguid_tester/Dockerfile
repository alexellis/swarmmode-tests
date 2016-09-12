FROM mhart/alpine-node:4.4
ADD package.json
RUN npm i
ADD app.js

EXPOSE 9000

CMD ["npm", "start"]
