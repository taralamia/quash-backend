FROM node:16.13.1-alpine3.14

# Set working directory
WORKDIR /usr/src/app

# Copy necessary files first
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]

# Copy the wait script
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

# Copy source files
COPY ./src ./src

# Install dependencies
RUN npm install

# Use wait to delay app startup until postgres is reachable
CMD ["/wait", "db:5432", "--", "npm", "run", "start"]
