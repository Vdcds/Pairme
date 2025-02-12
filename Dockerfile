FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile && \
    pnpm install  prisma && \
    pnpm install prisma --save-dev

# Copy the rest of the application
COPY . .
# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
