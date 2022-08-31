ARG NODE_VERSION=18

FROM node:${NODE_VERSION}-alpine AS app_common

# set timezone in alpine container
RUN apk add tzdata \
    && cp /usr/share/zoneinfo/Europe/Warsaw /etc/localtime \
    && echo "Europe/Warsaw" >  /etc/timezone \
    && apk del tzdata
ENV TZ="Europe/Warsaw"

EXPOSE 3000

WORKDIR /usr/src/app

# disable sending telemtry data to next.js devs :(
ENV NEXT_TELEMETRY_DISABLED 1

COPY package.json yarn.lock ./

FROM app_common AS app_dev

CMD ["yarn", "dev"]

FROM app_dev AS app_prod

RUN yarn

ENV NODE_ENV production

COPY . ./

RUN yarn build

CMD ["yarn", "start"]
