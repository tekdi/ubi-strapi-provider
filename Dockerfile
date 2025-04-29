FROM node:18-alpine3.18 as builder

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git python3 make g++

# Create temp directory for build
WORKDIR /tmp/app

# Copy package files
COPY strapi/package*.json ./

# Install dependencies with native build support
RUN npm install --build-from-source

# Start fresh from a new image
FROM node:18-alpine3.18

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache vips-dev python3 make g++

# Create app directory
WORKDIR /opt/app

# Create necessary directories and set permissions
RUN mkdir -p /opt/app/node_modules /home/node/.npm /home/node/.config && \
    chown -R node:node /opt/app /home/node

# Copy node_modules from builder
COPY --from=builder --chown=node:node /tmp/app/node_modules ./node_modules

# Copy package files
COPY --chown=node:node strapi/package*.json ./

# Copy application files
COPY --chown=node:node strapi/ .

# Switch to node user
USER node

# Set environment variables
ENV PATH=/opt/app/node_modules/.bin:$PATH
ENV NODE_ENV=production
ENV STRAPI_TELEMETRY_DISABLED=true
ENV SWC_PLATFORM="linux"
ENV SWC_ARCH="x64"

# Build the application
RUN NODE_ENV=production npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
