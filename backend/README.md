# Backend API Setup Guide

## Prerequisites
- **Node.js** (v18+ recommended)
- **PostgreSQL** (via Docker or local installation)
- **Bun runtime** (v1.0+)
- **Docker** (optional, for containerized DB)

---

## 1. Environment Setup

Clone repository
```
git clone https://github.com/your-repo/backend.git
cd backend
```

Install dependencies
```
bun install
```

Copy environment template
```
cp .env.example .env
```

---

## 2. Database Configuration
### Option A: Docker (Recommended)

Start PostgreSQL container
```
docker run --name project-pg -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15
```

### Option B: Local PostgreSQL
Create a database named `project_db` and update `.env`:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/project_db"
```

---

## 3. Environment Variables
Update `.env` with your configuration:

JWT
```
JWT_SECRET=your_secure_secret_here
```

App
```
PORT=8000
NODE_ENV=development
BASE_URL=http://localhost:8000
```

Email (SMTP)
```
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=your_mailtrap_user
SMTP_PASSWORD=your_mailtrap_pass
```

---

## 4. Database Migrations

Create migration
```
bunx prisma migrate dev --name init
```

Apply migrations
```
bunx prisma db push
```

---

## 5. Running the Server

Development mode (watch)
```
bun run dev
```

---

## 6. API Endpoints
| Route | Method | Description |
|-------|--------|-------------|
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User login |
| `/auth/me` | GET | Current user profile |
| `/post` | GET | List all posts |
| `/post/create` | POST | Create post (Admin only) |
| `/post/delete/:id` | DELETE | Delete post (Admin only) |

---

## 7. Testing Authentication

### Postman Collection
For testing the API endpoints, you can use our Postman collection:
[RBAC API Collection](https://www.postman.com/maintenance-specialist-15939562/rbac/collection/tmtbvje/rbac?share=true)

---

## 8. Admin Access
To create an admin user, use Prisma Studio to manage your database:

```
bunx prisma studio
```

This will open up the current database in your browser where you can:
- Navigate to the "users" table
- Select the user you want to make an admin
- Change the "role" field to "admin"
- Save the changes

---

## Troubleshooting
- **Database connection issues**: Verify `DATABASE_URL` in `.env`
- **JWT errors**: Ensure `JWT_SECRET` is set and consistent
- **Email failures**: Check SMTP credentials in `.env`
