# Personal Website

A modern, minimalistic personal website built with Go (backend), React (frontend), and PostgreSQL (database). This website showcases personal information, professional resume, a car build project, and includes a contact form.

## Features

- **About Me**: Personal information and biography
- **Resume**: Professional experience, education, and skills
- **Car Build**: Detailed documentation of automotive project
- **Contact**: Contact form for visitors to reach out
- **Authentication**: Secure login system with JWT
- **Admin Dashboard**: Content management for admin users

## Tech Stack

### Backend
- **Go 1.21+**: High-performance backend server
- **Gorilla Mux**: HTTP routing and middleware
- **PostgreSQL**: Reliable relational database
- **JWT**: Secure authentication
- **CORS**: Cross-origin resource sharing support

### Frontend
- **React 18**: Modern UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client

### Testing
- **Backend**: Go testing package
- **Frontend Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright

## Project Structure

```
TestWebsite/
├── backend/
│   ├── cmd/server/          # Main application entry point
│   ├── internal/
│   │   ├── auth/           # Authentication logic
│   │   ├── config/         # Configuration management
│   │   ├── database/       # Database connection and migrations
│   │   ├── handlers/       # HTTP request handlers
│   │   ├── middleware/     # HTTP middleware
│   │   └── models/         # Data models
│   ├── migrations/         # Database migration files
│   └── go.mod              # Go dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── styles/         # CSS files
│   │   └── types/          # TypeScript type definitions
│   ├── e2e/                # End-to-end tests
│   └── package.json        # Node.js dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Go 1.21 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher

### Database Setup

1. Create a PostgreSQL database:
```bash
createdb testwebsite_db
```

2. Copy the environment file:
```bash
cd backend
cp .env.example .env
```

3. Update the `.env` file with your database credentials and JWT secret.

### Backend Setup

1. Install Go dependencies:
```bash
cd backend
go mod download
```

2. Run database migrations:
```bash
go run cmd/server/main.go
```

The server will automatically run migrations on startup.

3. The backend server will start on `http://localhost:8080`

Default admin credentials (change these in `.env`):
- Email: admin@example.com
- Password: changeme

### Frontend Setup

1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. The frontend will be available at `http://localhost:3000`

## Running Tests

### Backend Tests
```bash
cd backend
go test ./...
```

### Frontend Unit Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
cd frontend
npm run test:e2e
```

## Building for Production

### Backend
```bash
cd backend
go build -o bin/server cmd/server/main.go
```

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

## API Documentation

### Public Endpoints

- `POST /api/login` - User login
- `GET /api/about` - Get about content
- `GET /api/resume` - Get resume sections
- `GET /api/carbuild` - Get car build entries
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Require Authentication + Admin Role)

- `POST /api/about` - Create about content
- `PUT /api/about/:id` - Update about content
- `DELETE /api/about/:id` - Delete about content
- `POST /api/resume` - Create resume section
- `PUT /api/resume/:id` - Update resume section
- `DELETE /api/resume/:id` - Delete resume section
- `POST /api/carbuild` - Create car build entry
- `PUT /api/carbuild/:id` - Update car build entry
- `DELETE /api/carbuild/:id` - Delete car build entry
- `GET /api/contact` - Get all contact submissions
- `POST /api/users` - Create new user

## Database Schema

### Users Table
- Stores user accounts with email, password hash, and admin status
- Supports authentication and authorization

### About Content Table
- Stores about page content sections
- Supports multiple content blocks with titles, text, and images

### Resume Sections Table
- Stores resume information (experience, education, skills)
- Supports chronological ordering and date ranges

### Car Build Entries Table
- Documents car build progress
- Includes descriptions, images, costs, and categories

### Contact Submissions Table
- Stores messages from the contact form
- Tracks read/unread status

## Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured CORS for allowed origins
- **Admin Authorization**: Protected routes for admin-only actions
- **SQL Parameterization**: Protection against SQL injection

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

ISC
