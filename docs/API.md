# API Documentation

Complete API reference for the SaaS Dashboard.

## Base URL

- **Local:** `http://localhost:3000/api`
- **Production:** `https://dashboard-saas-alpha.vercel.app/api`

## Authentication

Most endpoints require authentication via NextAuth.js session cookies. Protected endpoints return `401 Unauthorized` if no valid session exists.

## Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}
```

## Error Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation failed |
| 401 | Unauthorized - Authentication required |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Dashboard API

### GET /api/dashboard

Get dashboard statistics and chart data.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalProjects": 30,
      "activeProjects": 15,
      "onHoldProjects": 3,
      "completedProjects": 12,
      "totalBudget": 7887910,
      "budgetUtilization": 91,
      "teamMembers": 10
    },
    "recentProjects": [
      {
        "id": "clx...",
        "name": "Analytics Dashboard - Phase 1",
        "status": "ACTIVE",
        "progress": 61,
        "deadline": "2026-05-01T00:00:00.000Z"
      }
    ],
    "charts": {
      "monthlyData": [
        { "name": "Jan", "projects": 5 },
        { "name": "Feb", "projects": 8 }
      ],
      "statusData": [
        { "name": "Active", "value": 15, "color": "#22c55e" },
        { "name": "On Hold", "value": 3, "color": "#eab308" },
        { "name": "Completed", "value": 12, "color": "#6366f1" }
      ],
      "weeklyActivity": [
        { "day": "Mon", "tasks": 12 },
        { "day": "Tue", "tasks": 8 }
      ]
    }
  }
}
```

---

## Projects API

### GET /api/projects

List all projects with filtering and pagination.

**Authentication:** Not required

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | ALL | Filter: ACTIVE, ON_HOLD, COMPLETED, ALL |
| search | string | - | Search by project name (case-insensitive) |
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |

**Example:**
```bash
GET /api/projects?status=ACTIVE&search=dashboard&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "Analytics Dashboard - Q1",
      "status": "ACTIVE",
      "deadline": "2026-05-27T00:00:00.000Z",
      "assignedTo": "Emily Davis",
      "budget": "239700",
      "progress": 72,
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-02-10T14:20:00.000Z"
    }
  ],
  "meta": {
    "total": 30,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

### GET /api/projects/:id

Get a single project by ID.

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "Analytics Dashboard - Q1",
    "status": "ACTIVE",
    "deadline": "2026-05-27T00:00:00.000Z",
    "assignedTo": "Emily Davis",
    "budget": "239700",
    "progress": 72,
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-02-10T14:20:00.000Z"
  }
}
```

### POST /api/projects

Create a new project.

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "New Project",
  "status": "ACTIVE",
  "deadline": "2026-06-15",
  "assignedTo": "John Doe",
  "budget": 15000
}
```

**Validation:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| name | string | Yes | 2-100 characters |
| status | enum | Yes | ACTIVE, ON_HOLD, COMPLETED |
| deadline | string | Yes | Valid date (YYYY-MM-DD) |
| assignedTo | string | Yes | 2-100 characters |
| budget | number | Yes | Positive number |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "New Project",
    "status": "ACTIVE",
    "deadline": "2026-06-15T00:00:00.000Z",
    "assignedTo": "John Doe",
    "budget": "15000",
    "progress": 0,
    "createdAt": "2026-02-10T18:00:00.000Z",
    "updatedAt": "2026-02-10T18:00:00.000Z"
  }
}
```

### PUT /api/projects/:id

Update an existing project.

**Authentication:** Not required

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Project Name",
  "status": "COMPLETED",
  "deadline": "2026-07-01",
  "assignedTo": "Jane Smith",
  "budget": 20000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "Updated Project Name",
    "status": "COMPLETED",
    ...
  }
}
```

### DELETE /api/projects/:id

Delete a project.

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Project deleted successfully"
  }
}
```

---

## Notifications API

### GET /api/notifications

List notifications for the current user.

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| filter | string | all | Filter: all, unread |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "userId": "clx...",
      "title": "New team member added",
      "message": "John Smith has been added to the project.",
      "type": "INFO",
      "read": false,
      "createdAt": "2026-02-09T10:00:00.000Z",
      "updatedAt": "2026-02-09T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 12,
    "unread": 11,
    "read": 1
  }
}
```

### POST /api/notifications

Mark all notifications as read.

**Authentication:** Required

**Request Body:**
```json
{
  "action": "mark-all-read"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "All notifications marked as read"
  }
}
```

### PATCH /api/notifications/:id

Mark a single notification as read/unread.

**Authentication:** Required

**Request Body:**
```json
{
  "read": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "read": true,
    ...
  }
}
```

### DELETE /api/notifications/:id

Delete a notification.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Notification deleted"
  }
}
```

---

## Profile API

### GET /api/profile

Get current user's profile with statistics.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "Demo User",
    "email": "demo@example.com",
    "image": null,
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "role": "Project Manager",
    "department": "Engineering",
    "bio": "Passionate about building great products...",
    "createdAt": "2026-02-01T00:00:00.000Z",
    "stats": {
      "projectsManaged": 30,
      "completed": 12,
      "inProgress": 15,
      "onHold": 3
    }
  }
}
```

### PUT /api/profile

Update user profile.

**Authentication:** Required

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "phone": "+1 (555) 987-6543",
  "location": "New York, NY",
  "role": "Senior PM",
  "department": "Product",
  "bio": "Updated bio text..."
}
```

**Validation:**
| Field | Type | Max Length |
|-------|------|------------|
| name | string | 100 |
| phone | string | 20 |
| location | string | 100 |
| role | string | 100 |
| department | string | 100 |
| bio | string | 500 |

---

## Authentication API

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Validation:**
| Field | Type | Rules |
|-------|------|-------|
| name | string | 2-100 characters |
| email | string | Valid email format |
| password | string | Minimum 6 characters |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

### NextAuth.js Endpoints

These are handled automatically by NextAuth.js:

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/signin | GET/POST | Sign in page and handler |
| /api/auth/signout | GET/POST | Sign out handler |
| /api/auth/session | GET | Get current session |
| /api/auth/csrf | GET | Get CSRF token |
| /api/auth/providers | GET | List auth providers |

---

## Example cURL Requests

```bash
# Get all projects
curl https://dashboard-saas-alpha.vercel.app/api/projects

# Get active projects
curl "https://dashboard-saas-alpha.vercel.app/api/projects?status=ACTIVE"

# Create a project
curl -X POST https://dashboard-saas-alpha.vercel.app/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign",
    "status": "ACTIVE",
    "deadline": "2026-06-15",
    "assignedTo": "John Doe",
    "budget": 15000
  }'

# Update a project
curl -X PUT https://dashboard-saas-alpha.vercel.app/api/projects/PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}'

# Delete a project
curl -X DELETE https://dashboard-saas-alpha.vercel.app/api/projects/PROJECT_ID
```
