FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY cms/package.json cms/package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy application code
COPY cms/ .

# Build admin panel
ENV NODE_ENV=production
RUN npm run build

# Expose port
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "start"]
