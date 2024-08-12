# Use node 20
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Build client
COPY ./kindle/package.json ./kindle/package-lock.json ./kindle/
RUN npm --prefix="./kindle" ci

COPY ./kindle/ ./kindle/
RUN npm --prefix="./kindle" run build --ignore-scripts && rm -rf ./kindle/node_modules/ ./kindle/public/ ./kindle/src/ ./kindle/scripts/

# For caching purposes, install deps without other changed files
COPY ./server/package.json ./server/package-lock.json ./

# Install deps
RUN npm ci

# Copy code
COPY ./server/index.js ./

# Set things up
EXPOSE 8501
EXPOSE 8502
CMD [ "npm", "run", "start:docker" ]