# Use official Node.js image as base
FROM node:latest

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port Nest.js is running on
EXPOSE 3002

# Start the Nest.js application
CMD ["npm", "run", "start:prod"]
