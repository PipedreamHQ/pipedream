FROM node:22.14.0-alpine3.21

WORKDIR /app
COPY . .

# Install dependencies and build
RUN npm ci && npm run build

ENV PORT=3010
EXPOSE 3010

# Command to run the SSE server
CMD ["npm", "run", "start:sse:prod"]
