# Quick Start Guide

This guide will help you get the personal website running quickly using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed
- Git

## Quick Start with Docker Compose

1. Clone the repository:
```bash
git clone https://github.com/Jakeito/TestWebsite.git
cd TestWebsite
```

2. Start all services:
```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Go backend server on port 8080
- React frontend on port 3000

3. Access the website:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

4. Login with default admin credentials:
- Email: admin@example.com
- Password: changeme

**Important**: Change the default admin password and JWT secret in production!

## Manual Setup (Without Docker)

### 1. Database Setup

Install and start PostgreSQL, then create the database:

```bash
createdb testwebsite_db
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
go mod download
go run cmd/server/main.go
```

The backend will run on http://localhost:8080

### 3. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000

## Development Workflow

### Running Tests

**Backend tests:**
```bash
cd backend
go test ./...
```

**Frontend unit tests:**
```bash
cd frontend
npm test
```

**E2E tests:**
```bash
cd frontend
npm run test:e2e
```

### Building for Production

**Backend:**
```bash
cd backend
go build -o bin/server cmd/server/main.go
```

**Frontend:**
```bash
cd frontend
npm run build
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=testwebsite
DB_PASSWORD=your_password
DB_NAME=testwebsite_db
DB_SSLMODE=disable
JWT_SECRET=your-secret-key-change-in-production
SERVER_PORT=8080
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme
```

## Troubleshooting

**Database connection issues:**
- Ensure PostgreSQL is running
- Check database credentials in .env file
- Verify database exists: `psql -l`

**Backend won't start:**
- Check if port 8080 is already in use
- Verify Go dependencies: `go mod download`
- Check logs for specific errors

**Frontend won't start:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is already in use
- Verify all dependencies installed correctly

## Next Steps

1. Change default admin password
2. Add your personal content through the admin dashboard
3. Customize the styling in `frontend/src/styles/App.css`
4. Add your car build entries and photos
5. Update the about page with your information

## Security Notes

- Change the default admin credentials immediately
- Use a strong JWT secret in production
- Enable SSL/TLS for database connections in production
- Use environment-specific .env files
- Never commit .env files to version control
