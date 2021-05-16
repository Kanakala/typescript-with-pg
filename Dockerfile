FROM node:14-alpine3.12
EXPOSE 3000 5432

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm ci

COPY . /home/app

RUN npm run build

RUN chmod -R 755 ./scripts/
CMD ./scripts/start.sh
