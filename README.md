# RBAC Blog Management Project

A complete blog management system with role-based access control, featuring a Next.js frontend and Node.js/PostgreSQL backend.

## Project Overview

This project consists of two main components:
- **Frontend**: Modern blog management dashboard built with Next.js and shadcn/ui
- **Backend**: RESTful API with authentication, authorization, and database integration

## Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** (via Docker or local installation)
- **Bun runtime** (v1.0+)
- **Docker** (optional, for containerized DB)
- **Mailtrap account** (for email verification)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ankitmahotla/rbac-app.git
   cd rbac-app
   ```

### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Set up the database**

   **Option A: Docker (Recommended)**
   ```bash
   docker run --name project-pg -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15
   ```

   **Option B: Local PostgreSQL**
   Create a database named `project_db` and update `.env`:
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/project_db"
   ```

5. **Configure Mailtrap for Email Verification**
   - Create an account at [Mailtrap](https://mailtrap.io/)
   - Navigate to Email Testing > Inboxes > SMTP Settings
   - Select "Node.js" from the integration dropdown
   - Copy the credentials to your `.env` file

6. **Update environment variables**
   Edit the `.env` file with your configuration:

   ```
   # JWT
   JWT_SECRET=your_secure_secret_here

   # App
   PORT=8000
   NODE_ENV=development
   BASE_URL=http://localhost:8000

   # Email (SMTP)
   SMTP_HOST=sandbox.smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USERNAME=your_mailtrap_username
   SMTP_PASSWORD=your_mailtrap_password
   ```

7. **Run database migrations**
   ```bash
   bunx prisma migrate dev --name init
   bunx prisma db push
   ```

8. **Start the backend server**
   ```bash
   bun run dev
   ```
   The backend API will be available at: http://localhost:8000

### Frontend Setup

1. **Open a new terminal and navigate to the frontend directory from the project root**
   ```bash
   cd frontend
   ```

2. **Install dependencies using Bun**
   ```bash
   bun install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Update the environment variables**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

5. **Start the frontend development server**
   ```bash
   bun run dev
   ```
   The frontend will be available at: http://localhost:3000

## API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User login |
| `/auth/me` | GET | Current user profile |
| `/auth/verify-email` | GET | Verify email with token query parameter |
| `/post` | GET | List all posts |
| `/post/create` | POST | Create post (Admin only) |
| `/post/delete/:id` | DELETE | Delete post (Admin only) |

## Email Verification

When a user registers, a verification email will be sent to their email address. This email contains a verification link with a token:

```
http://localhost:8000/api/v1/auth/verify-email?token=verification_token_here
```

All emails sent by the application will appear in your Mailtrap inbox dashboard. This allows you to test the email verification flow without sending real emails during development.

## Admin Access

To create an admin user, use Prisma Studio to manage your database:
```bash
cd backend
bunx prisma studio
```

This will open the database interface in your browser where you can:
- Navigate to the "users" table
- Select the user you want to make an admin
- Change the "role" field to "admin"
- Save the changes

## Testing the API

For testing the API endpoints, you can use our Postman collection:
[RBAC API Collection](https://www.postman.com/maintenance-specialist-15939562/rbac/collection/tmtbvje/rbac?share=true)

## Development Workflow

For the best development experience, run both servers simultaneously:

```bash
# Terminal 1 - Backend
cd backend
bun run dev

# Terminal 2 - Frontend
cd frontend
bun run dev
```

## Troubleshooting

- **Database connection issues**: Verify `DATABASE_URL` in `.env`
- **JWT errors**: Ensure `JWT_SECRET` is set and consistent
- **Email verification problems**: Check that Mailtrap credentials are correct in `.env`
- **CORS errors**: Ensure backend has proper CORS configuration
- **Authentication failures**: Verify JWT tokens are being sent properly

## Build for Production

**Backend:**
```bash
cd backend
bun run build
```

**Frontend:**
```bash
cd frontend
bun run build
```