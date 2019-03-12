FROM java:openjdk-8-alpine

ADD target/gesture-mock.jar /

CMD ["java", "-Dvertx.cacheDirBase=/tmp", "-jar", "gesture-mock.jar"]