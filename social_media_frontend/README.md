# Social Media Dashboard Frontend (React)

A modern, lightweight React dashboard with sidebar navigation. It integrates with a FastAPI backend via environment-configured base URL.

## Features
- Sidebar layout with pages: Analytics, Profile, Admin
- Theming with primary (#3B82F6) and accent (#F59E0B)
- API services for `/users`, `/profiles`, `/analytics`, `/admin`
- Basic session state (demo login/logout) via Context
- Responsive design

## Environment
Create a `.env` file based on `.env.example`:

```
REACT_APP_API_BASE_URL=http://localhost:3001
```

Ensure the backend is reachable at this URL (FastAPI default from the work item is port 3001).

## Scripts
- `npm start` – start dev server at http://localhost:3000
- `npm test` – run tests
- `npm run build` – production build

## Project Structure
- `src/services/api.js` – API service module
- `src/context/SessionContext.js` – session context provider
- `src/components/Sidebar.js` – sidebar navigation
- `src/pages/Analytics.js` – analytics dashboard
- `src/pages/Profile.js` – profile management
- `src/pages/Admin.js` – admin user management
- `src/pages/pages.css` – shared page styles
- `src/App.js` – app layout & routing

## Notes
- Replace the placeholder login with real auth once backend endpoints are available.
- All API calls rely on `REACT_APP_API_BASE_URL`.
