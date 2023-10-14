# Use node 18
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# For caching purposes, install deps without other changed files
COPY package.json package-lock.json ./

# Install deps
RUN npm ci

# Copy code
COPY index.js ./

# Set things up
EXPOSE 8501
CMD [ "npm", "run", "start:docker" ]