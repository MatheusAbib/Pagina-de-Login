# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY login-auth-api/pom.xml .
COPY login-auth-api/src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/login-auth-api-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
