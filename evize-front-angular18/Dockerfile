# Stage 1: Compile and Build Angular codebase
FROM node:lts as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Set npm registry and disable strict SSL, then clean npm cache
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set strict-ssl false \
    && npm cache clean --force

# Install all the dependencies
RUN npm install --unsafe-perm --loglevel verbose > npm-install-log.txt || (cat npm-install-log.txt; exit 1)

# Generate the build of the application
RUN npm run build

# Expose port 4000
EXPOSE 4000

# Command to run the application
CMD ["npm", "run", "serve:ssr:evisa"]
