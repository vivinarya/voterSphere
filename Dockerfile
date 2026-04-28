FROM node:18-slim

WORKDIR /usr/src/app

# Copy root package files
COPY package*.json ./

# Copy client folder and build it first
COPY client ./client
RUN cd client && npm install && npm run build

# Copy the rest of the backend source code
COPY src ./src

# Install backend dependencies (production only)
RUN npm install --production

EXPOSE 8080

CMD [ "npm", "start" ]
