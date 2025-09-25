# Use Node.js official image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port 3000
EXPOSE 3000

# Command to run in development
CMD ["npm", "run", "dev"]