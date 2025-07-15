#!/bin/bash

# FraudShield Setup Script
# This script helps you set up the FraudShield fraud detection system

set -e

echo "🚀 FraudShield Setup Script"
echo "=========================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p data/postgres
mkdir -p data/redis

# Set up environment variables
echo "🔧 Setting up environment variables..."
if [ ! -f .env ]; then
    cat > .env << EOF
# FraudShield Environment Variables
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=fraudshield

# ML Service
ML_SERVICE_URL=http://ml-service:8000

# Backend
SPRING_PROFILES_ACTIVE=docker
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/fraudshield
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_REDIS_HOST=redis

# Frontend
VITE_API_URL=http://localhost:8080/api
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

# Build and start services
echo "🐳 Building and starting services..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
fi

# Check ML Service
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ ML Service is ready"
else
    echo "❌ ML Service is not ready"
fi

# Check Backend
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Backend is ready"
else
    echo "❌ Backend is not ready"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📊 Service Status:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - ML Service: http://localhost:8000"
echo "   - Backend API: http://localhost:8080"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "🧪 To test the system:"
echo "   python test_system.py"
echo ""
echo "📝 Useful commands:"
echo "   docker-compose logs -f          # View all logs"
echo "   docker-compose logs -f backend  # View backend logs"
echo "   docker-compose logs -f ml-service # View ML service logs"
echo "   docker-compose down             # Stop all services"
echo "   docker-compose restart          # Restart all services"
echo ""
echo "🔧 Development:"
echo "   cd springboot-backend && ./gradlew bootRun  # Run backend locally"
echo "   cd ml-service && python main.py            # Run ML service locally"
echo "   cd web-dashboard && npm run dev            # Run frontend locally"
echo ""
echo "📚 Documentation: README.md" 