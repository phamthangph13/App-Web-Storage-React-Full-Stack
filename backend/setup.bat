@echo off
echo ========================================
echo   AppP2P Backend Setup Script
echo ========================================
echo.

echo Step 1: Checking Java installation...
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
) else (
    echo Java is installed.
)

echo.
echo Step 2: Checking Maven installation...
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven 3.6 or higher
    pause
    exit /b 1
) else (
    echo Maven is installed.
)

echo.
echo Step 3: Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Docker is not installed or not in PATH
    echo You can still run the application but need to install MongoDB manually
    echo.
) else (
    echo Docker is installed.
    echo Starting MongoDB with Docker...
    docker-compose up -d
    echo Waiting for MongoDB to start...
    timeout /t 15 /nobreak >nul
)

echo.
echo Step 4: Installing Maven dependencies...
mvn clean install -DskipTests
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 5: Running tests...
mvn test
if errorlevel 1 (
    echo WARNING: Some tests failed, but continuing...
)

echo.
echo ========================================
echo   Setup completed successfully!
echo ========================================
echo.
echo To start the application:
echo   1. Run: run.bat
echo   2. Or: mvn spring-boot:run -Dspring-boot.run.profiles=dev
echo.
echo API will be available at: http://localhost:8080/api
echo MongoDB Admin UI: http://localhost:8081
echo.
pause