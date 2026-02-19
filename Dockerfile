#Use the official Node.js 20 image as the base image, which is a lightweight version of Node.js optimized for production use. alpine is a minimal Linux distribution that helps reduce the image size and attack surface.
FROM node:20-alpine
#Set the working directory in the container to /app. This is where the application code will be copied and executed. It helps to keep the container organized and ensures that all commands are run in the correct context.
WORKDIR /app
#Copy the package.json and package-lock.json files to the working directory. These files contain the metadata and dependencies of the Node.js application. By copying them first, we can take advantage of Docker's caching mechanism to speed up subsequent builds, as the dependencies will only be installed if these files change.
COPY package*.json ./
#Copy the rest of the application code to the working directory. This includes all the source files, configuration files, and any other necessary resources needed to run the application.
COPY . .
#clean install the dependencies defined in package-lock.json, which ensures that the exact versions of the dependencies are installed. The --omit=dev flag is used to exclude devDependencies from being installed, which is typically done in production environments to reduce the size of the final image and improve security by not including unnecessary development tools.
RUN npm ci --omit=dev
#set the environment to production, which can be used by the application to optimize performance and disable development-specific features. This is a common practice in Node.js applications to ensure that they run efficiently in a production environment. Use NODE_ENV=development for development environments to enable features like detailed error messages and hot-reloading, which are helpful during development but can be a security risk(allowing structure information leakage to hackers) and performance issue in production.
ENV NODE_ENV=production
#Expose port 3000 to allow external access to the application. This is the port that the Node.js application will listen on for incoming requests. By exposing this port, we can map it to a port on the host machine when running the container, allowing us to access the application from outside
EXPOSE 3000
CMD ["node", "index.js"]