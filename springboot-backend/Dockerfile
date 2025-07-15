FROM eclipse-temurin:17-jdk-alpine as build

WORKDIR /workspace/app

COPY gradle gradle
COPY gradlew .
COPY build.gradle .
COPY settings.gradle .

RUN chmod +x gradlew
RUN ./gradlew dependencies

COPY src src
RUN ./gradlew build -x test

FROM eclipse-temurin:17-jre-alpine

VOLUME /tmp

COPY --from=build /workspace/app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app.jar"] 