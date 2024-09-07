# Stage 1: Build the app
FROM node:20-alpine AS builder

# Install bash and other dependencies if needed
RUN apk add --no-cache bash

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema to generate client
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the app files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Run the app
FROM node:20-alpine

# Install bash and other dependencies if needed
RUN apk add --no-cache bash

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy only necessary files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose the port on which the app runs
EXPOSE ${APP_PORT}

# Run the web service on container startup
CMD ["./wait-for-it.sh", "db:5432", "--", "npm", "start"]
