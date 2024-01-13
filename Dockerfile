FROM node:18-alpine AS BUILD_IMAGE

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build


FROM node:18-alpine

# create user in the docker image
USER node

# Creating a new directory for app files and setting path in the container
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

# setting working directory in the container
WORKDIR /home/node/app


COPY --from=BUILD_IMAGE --chown=node:node /app/dist ./dist
COPY --from=BUILD_IMAGE --chown=node:node /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE --chown=node:node /app/docker-entrypoint-initdb.d ./docker-entrypoint-initdb.d
COPY --from=BUILD_IMAGE --chown=node:node /app/public ./public
COPY --from=BUILD_IMAGE --chown=node:node /app/package.json ./package.json
COPY --from=BUILD_IMAGE --chown=node:node /app/.next ./.next
COPY --from=BUILD_IMAGE --chown=node:node /app/next.config.js ./next.config.js
COPY --from=BUILD_IMAGE --chown=node:node /app/headers.cjs ./headers.cjs
COPY --from=BUILD_IMAGE --chown=node:node /app/.env ./.env
COPY --from=BUILD_IMAGE --chown=node:node /app/logs ./logs
COPY --from=BUILD_IMAGE --chown=node:node /app/keys ./keys
COPY --from=BUILD_IMAGE --chown=node:node /app/uploads ./uploads
COPY --from=BUILD_IMAGE --chown=node:node /app/ssl ./ssl

# container exposed network port number
EXPOSE 8080

# command to run within the container
CMD [ "yarn", "serve" ]