# EL ALMANI SALON

Full-stack salon website with a public frontend, admin dashboard, media gallery, and a new Team portfolio system for individual staff members.

## Stack

- React + Vite
- Tailwind CSS
- Node.js + Express
- MongoDB + Mongoose
- Cloudinary for image and video uploads
- JWT auth for admin routes

## Public Pages

- `/`
- `/about`
- `/services`
- `/gallery`
- `/team`
- `/team/:id`
- `/contact`

## Admin Pages

- `/admin/login`
- `/admin`
- `/admin/team`
- `/admin/team/:id`

## API

```txt
POST   /api/auth/login

GET    /api/gallery
POST   /api/gallery
PUT    /api/gallery/:id
DELETE /api/gallery/:id

GET    /api/services
POST   /api/services
PUT    /api/services/:id
DELETE /api/services/:id

GET    /api/settings
PUT    /api/settings

GET    /api/team
GET    /api/team/:id
POST   /api/team
PUT    /api/team/:id
DELETE /api/team/:id
POST   /api/team/:id/works
PUT    /api/team/:id/works/:workId
DELETE /api/team/:id/works/:workId
```

## Team Feature

The Team feature adds:

- A public Team page with premium member cards
- A member details page with only that member's works
- Admin management for members and their works
- Multi-file uploads for each work
- Mixed media support inside a single work:
  - multiple images
  - multiple short videos
- Cloudinary cleanup when deleting:
  - a full member
  - a full work
  - a single media item

Each team work now follows this structure:

```txt
work
  title
  description
  serviceType
  media[]
    url
    publicId
    type
    title
    description
```

## Gallery Behavior

The public gallery is now built from `TeamMember.works`.

- `GET /api/gallery` returns aggregated team works
- Each gallery card belongs to a team member
- Each gallery item can open a modal showing all related media
- Gallery supports images and videos together
- Gallery filtering is handled on the frontend by:
  - media type
  - service type
  - member
  - search text

## Folder Structure

```txt
el-almani-salon/
  client/
    src/
      admin/
      api/
      components/
      pages/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
```

## Environment Variables

### `server/.env`

Copy `server/.env.example` to `server/.env`.

```env
PORT=5001
CLIENT_URL=http://localhost:5173,http://localhost:5174
MONGO_URI=mongodb://127.0.0.1:27017/el-almani-salon
JWT_SECRET=change_this_secret
ADMIN_EMAIL=admin@elalmani.com
ADMIN_PASSWORD=admin123
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### `client/.env`

Copy `client/.env.example` to `client/.env`.

```env
VITE_API_URL=http://localhost:5001/api
```

## Local Run

Install dependencies:

```bash
npm run install:all
```

Seed default data:

```bash
npm run seed --prefix server
```

Start backend:

```bash
npm run dev --prefix server
```

Start frontend:

```bash
npm run dev --prefix client
```

## Default Admin

```txt
Email: admin@elalmani.com
Password: admin123
```

## Notes

- Admin routes are JWT-protected.
- Team works support multiple image and video uploads in one request.
- Gallery uploads are image-only.
- Public gallery content is generated from team works.
- If your frontend starts on `5174`, it is already allowed by the backend CORS config.
- If Cloudinary credentials are missing, Team and Gallery uploads will fail until they are added.
