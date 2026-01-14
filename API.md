# API Documentation

## Base URL

- Development: `http://localhost:8080/api`
- Production: Update with your domain

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Login
```
POST /api/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "changeme"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "username": "Admin",
    "is_admin": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### About Content

#### Get All About Content (Public)
```
GET /api/about
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Welcome",
    "content": "This is my personal website...",
    "image_url": "https://example.com/image.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create About Content (Admin Only)
```
POST /api/about
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "About Me",
  "content": "I'm a developer and car enthusiast...",
  "image_url": "https://example.com/photo.jpg"
}
```

#### Update About Content (Admin Only)
```
PUT /api/about/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "image_url": "https://example.com/new-photo.jpg"
}
```

#### Delete About Content (Admin Only)
```
DELETE /api/about/:id
Authorization: Bearer <token>
```

### Resume Sections

#### Get All Resume Sections (Public)
```
GET /api/resume
```

**Response:**
```json
[
  {
    "id": 1,
    "section_type": "experience",
    "title": "Software Developer",
    "subtitle": "Tech Company",
    "description": "Built modern web applications...",
    "start_date": "2020-01-01T00:00:00Z",
    "end_date": null,
    "display_order": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Resume Section (Admin Only)
```
POST /api/resume
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "section_type": "experience",
  "title": "Senior Developer",
  "subtitle": "Another Company",
  "description": "Led development team...",
  "start_date": "2023-01-01T00:00:00Z",
  "end_date": null,
  "display_order": 0
}
```

#### Update Resume Section (Admin Only)
```
PUT /api/resume/:id
Authorization: Bearer <token>
```

#### Delete Resume Section (Admin Only)
```
DELETE /api/resume/:id
Authorization: Bearer <token>
```

### Car Build Entries

#### Get All Car Build Entries (Public)
```
GET /api/carbuild
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Turbo Installation",
    "description": "Installed a new turbo kit...",
    "date": "2024-01-15T00:00:00Z",
    "category": "engine",
    "cost": 2500.00,
    "image_urls": [
      "https://example.com/turbo1.jpg",
      "https://example.com/turbo2.jpg"
    ],
    "display_order": 0,
    "created_at": "2024-01-15T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
]
```

#### Create Car Build Entry (Admin Only)
```
POST /api/carbuild
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Exhaust System",
  "description": "Upgraded to a performance exhaust...",
  "date": "2024-02-01T00:00:00Z",
  "category": "exhaust",
  "cost": 1200.50,
  "image_urls": ["https://example.com/exhaust.jpg"],
  "display_order": 0
}
```

#### Update Car Build Entry (Admin Only)
```
PUT /api/carbuild/:id
Authorization: Bearer <token>
```

#### Delete Car Build Entry (Admin Only)
```
DELETE /api/carbuild/:id
Authorization: Bearer <token>
```

### Contact Submissions

#### Submit Contact Form (Public)
```
POST /api/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about your project",
  "message": "I'd like to know more about..."
}
```

**Response:**
```json
{
  "id": 1,
  "message": "Contact form submitted successfully"
}
```

#### Get All Contact Submissions (Admin Only)
```
GET /api/contact
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question about your project",
    "message": "I'd like to know more about...",
    "is_read": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### User Management

#### Create User (Admin Only)
```
POST /api/users
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "username": "NewUser"
}
```

**Response:**
```json
{
  "id": 2,
  "message": "User created successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
"Invalid request body"
```

### 401 Unauthorized
```json
"Authorization header required"
```

### 403 Forbidden
```json
"Admin access required"
```

### 500 Internal Server Error
```json
"Database error"
```

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## CORS

The API allows requests from:
- http://localhost:3000 (React dev server)
- http://localhost:5173 (Vite default port)

Update CORS settings in production to match your frontend domain.
