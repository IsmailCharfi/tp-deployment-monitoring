FROM node:18

WORKDIR /app

COPY back-end/package*.json ./

RUN npm install

COPY back-end/ .

CMD ["npm", "start"]
