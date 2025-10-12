FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY cms/package.json ./

# Install dependencies (use npm install since lock file may be out of sync)
RUN npm install --omit=dev

# Copy application code
COPY cms/ .

# Build admin panel
ENV NODE_ENV=production
RUN npm run build

# Expose port
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "start"]
