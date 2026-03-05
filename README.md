# Market Palace

Marketplace for digital assets (3D models, code snippets, Notion templates) with secure file delivery and payment processing.

## Architecture

This is a monorepo containing:
- **Frontend**: Next.js 14 with App Router, Tailwind CSS, Shadcn/ui
- **Backend**: NestJS with Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Auth0 (Social + Email/Password)
- **Payments**: Stripe
- **Storage**: AWS S3 with presigned URLs

## Features

### Customer (Buyer)
- Browse catalog with filters and search
- Preview assets (images/videos)
- Secure payment via Stripe
- Temporary download links (5min expiry)
- Purchase history dashboard

### Seller (Creator)
- Upload files (private source + public preview)
- Manage inventory and pricing
- Track sales and revenue
- CRUD operations on assets

### Administrator
- Global asset management
- Moderation (activate/deactivate assets)
- Quality control

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL
- AWS S3 bucket
- Auth0 account
- Stripe account
- Docker & Docker Compose

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.docker .env
   # Edit .env with your actual configuration
   ```

### Development

Using Docker (Recommended):
```bash
# Start development environment
make dev

# Or start services individually
make docker-up
```

Manual setup:
```bash
# Backend
cd packages/backend
npm install
npm run prisma:migrate
npm run prisma:generate
npm run start:dev

# Frontend
cd packages/frontend
npm install
npm run dev
```

### Production

Using Docker:
```bash
# Build and start production environment
make prod

# Or use docker-compose directly
docker-compose -f docker-compose.yml up -d --build
```

### Docker Commands

```bash
# Start development services
make docker-up

# Stop all services
make docker-down

# View logs
make docker-logs

# Clean up containers and images
make clean
```

## Project Structure

```
prosets-marketplace/
├── packages/
│   ├── frontend/          # Next.js frontend
│   └── backend/           # NestJS backend
├── docker-compose.yml       # Production Docker setup
├── docker-compose.dev.yml   # Development Docker setup
├── Makefile             # Docker convenience commands
└── README.md
```

## Security Features

- Files stored in private S3 bucket
- Presigned URLs with 5-minute expiry
- Payment verification before access
- Auth0 authentication with JWT tokens
- CORS protection
- Input validation and sanitization

## API Documentation

Once running, visit `http://localhost:3001/api` for Swagger documentation.

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov
```

## Building for Production

```bash
# Build Docker images
make build

# The multi-stage Dockerfiles optimize for production
# Frontend uses .next/standalone output
# Backend uses compiled JavaScript output
```

## Environment Variables

See `.env.docker` for all required environment variables:
- Auth0 configuration
- Stripe keys
- AWS credentials
- Database connection
- JWT secrets

## License

MIT
