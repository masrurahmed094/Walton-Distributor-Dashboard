# =============================================================
# Dockerfile (Multi-Stage)
# =============================================================

# --- Stage 1: Build the application using Maven ---
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file to download dependencies
COPY pom.xml .

# Download all dependencies
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Package the application, skipping the tests
RUN mvn package -DskipTests


# --- Stage 2: Create the final, lightweight image ---
FROM openjdk:17-slim

# Set the working directory
WORKDIR /app

# Copy the built .jar file from the 'builder' stage
COPY --from=builder /app/target/sales-dashboard-backend-1.0.0.jar app.jar

# Expose the port the application runs on
EXPOSE 8081

# Set the command to run the application
ENTRYPOINT ["java","-jar","app.jar"]
