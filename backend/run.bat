@echo off
echo Starting AppP2P Authentication Service...
echo.

echo Checking if MongoDB is running...
netstat -an | find "27017" >nul
if errorlevel 1 (
    echo MongoDB is not running. Starting MongoDB with Docker...
    docker-compose up -d mongodb
    echo Waiting for MongoDB to start...
    timeout /t 10 /nobreak >nul
) else (
    echo MongoDB is already running.
)

echo.
echo Starting Spring Boot application...
mvn spring-boot:run -Dspring-boot.run.profiles=dev

pause