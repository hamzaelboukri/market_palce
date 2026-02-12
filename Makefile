.PHONY: help dev build prod clean docker-up docker-down docker-logs

# Default target
help:
	@echo "Available targets:"
	@echo "  dev      - Start development environment with Docker"
	@echo "  build    - Build Docker images for production"
	@echo "  prod     - Start production environment with Docker"
	@echo "  clean    - Clean Docker containers and images"
	@echo "  docker-up - Start all services in development mode"
	@echo "  docker-down - Stop all services"
	@echo "  docker-logs - Show logs for all services"

# Development environment
dev:
	docker-compose -f docker-compose.dev.yml up --build

# Build for production
build:
	docker-compose -f docker-compose.yml build

# Production environment
prod:
	docker-compose -f docker-compose.yml up -d

# Clean Docker environment
clean:
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.yml down -v
	docker system prune -f

# Start development environment
docker-up:
	docker-compose -f docker-compose.dev.yml up -d --build

# Stop all services
docker-down:
	docker-compose -f docker-compose.dev.yml down
	docker-compose -f docker-compose.yml down

# Show logs
docker-logs:
	docker-compose -f docker-compose.dev.yml logs -f
	docker-compose -f docker-compose.yml logs -f
