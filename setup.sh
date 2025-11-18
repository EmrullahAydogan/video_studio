#!/bin/bash

echo "================================"
echo "AI Video Studio - Setup Script"
echo "================================"
echo ""

# Check Docker
echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed!"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check Docker Compose
echo "Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "ERROR: Docker Compose is not installed!"
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
fi

echo ""
echo "Docker is ready!"
echo ""

# Create env files
echo "Creating environment files..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "Backend .env created"
fi

echo ""
echo "Building and starting containers..."
echo "This may take a few minutes on first run..."
echo ""

# Build and start
docker-compose up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    echo "SUCCESS! Application is running"
    echo "================================"
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend:  http://localhost:4000"
    echo ""
    echo "To stop:  docker-compose down"
    echo "To view logs: docker-compose logs -f"
    echo ""
else
    echo ""
    echo "ERROR: Failed to start containers"
    echo "Check the error messages above"
    echo ""
    exit 1
fi
