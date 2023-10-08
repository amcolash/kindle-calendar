# Use node 18
FROM node:18-alpine

# Install chomium
RUN apk add --no-cache \
  chromium imagemagick

# Create app directory
WORKDIR /usr/src/app

# For caching purposes, install deps without other changed files
COPY package.json package-lock.json ./

# The standalone chromium doesn't work properly, use system one
ENV PUPPETEER_SKIP_DOWNLOAD true

# Install deps
RUN npm ci

# Copy code
COPY ./src/ ./src
COPY index.js index.html ./

# Build the app
RUN npm run build

# Set things up
EXPOSE 8501
CMD [ "npm", "run", "start:docker" ]