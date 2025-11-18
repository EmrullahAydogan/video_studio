@echo off
echo ================================
echo AI Video Studio - Setup Script
echo ================================
echo.

echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Checking Docker Compose...
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose is not installed!
    pause
    exit /b 1
)

echo.
echo Docker is ready!
echo.

echo Creating environment files...
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo Backend .env created
)

echo.
echo Building and starting containers...
echo This may take a few minutes on first run...
echo.

docker-compose up --build -d

if %errorlevel% equ 0 (
    echo.
    echo ================================
    echo SUCCESS! Application is running
    echo ================================
    echo.
    echo Frontend: http://localhost:3000
    echo Backend:  http://localhost:4000
    echo.
    echo To stop:  docker-compose down
    echo To view logs: docker-compose logs -f
    echo.
) else (
    echo.
    echo ERROR: Failed to start containers
    echo Check the error messages above
    echo.
)

pause
