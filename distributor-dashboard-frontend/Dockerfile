# Stage 1: The 'build' stage, where we compile the Angular application.
FROM node:18-alpine AS build

# Set the working directory inside the container.
WORKDIR /app

# Copy the package.json and package-lock.json files.
COPY package.json package-lock.json ./

# Install the project dependencies, ignoring peer conflicts. 
RUN npm install --legacy-peer-deps

# Copy the rest of the application's source code.
COPY . .

# Build the application for production.
RUN npm run build -- --configuration production


# Stage 2: The 'serve' stage, where we serve the compiled app using Nginx.
FROM nginx:alpine

# Copy the compiled application from the 'build' stage to Nginx's default web root.
COPY --from=build /app/dist/distributor-dashboard-frontend /usr/share/nginx/html

# Copy our custom Nginx configuration to handle SPA routing.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80, which is the default port for Nginx.
EXPOSE 80