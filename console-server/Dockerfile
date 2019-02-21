FROM java:openjdk-8-alpine

ADD target/console-server.jar /

CMD ["java", "-Dvertx.cacheDirBase=/tmp", "-jar", "console-server.jar"]