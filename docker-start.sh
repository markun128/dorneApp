#!/bin/bash

# SkyLogger Pro - Docker Quick Start Script
# This script helps users quickly start the application with Docker

echo "🚁 SkyLogger Pro - Docker Setup & Start"
echo "======================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker is installed and ready"

# Stop any existing containers
echo "🔄 Stopping any existing SkyLogger Pro containers..."
docker-compose down 2>/dev/null || true

# Build and start the application
echo "🏗️  Building SkyLogger Pro Docker image..."
docker-compose build

echo "🚀 Starting SkyLogger Pro..."
docker-compose up -d

# Wait a moment for the application to start
echo "⏳ Waiting for application to start..."
sleep 5

# Check if the container is running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "🎉 SkyLogger Pro is now running!"
    echo ""
    echo "📱 Access the application at:"
    echo "   🌐 Local:    http://localhost:3001"
    echo "   🌐 Network:  http://$(hostname -I | awk '{print $1}'):3001"
    echo ""
    echo "📊 Container status:"
    docker-compose ps
    echo ""
    echo "📝 To view logs: docker-compose logs -f"
    echo "🛑 To stop:      docker-compose down"
else
    echo "❌ Failed to start SkyLogger Pro. Check the logs:"
    docker-compose logs
    exit 1
fi