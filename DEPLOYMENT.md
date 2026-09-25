# DefectSense AI — Deployment Foundation

## Frontend

The frontend reads the backend API URL from:

`VITE_API_BASE_URL`

Local development defaults to:

`http://127.0.0.1:8000/api`

For production, set `VITE_API_BASE_URL` to the deployed HTTPS API URL before building.

## Backend

The current backend is intentionally lightweight and runs with Python's standard-library HTTP server for local development.

For production deployment, run the backend behind a production-grade HTTPS reverse proxy or supported hosting runtime.

## Security

Do not commit `.env`, `.env.local`, or `.env.production`.

Production API traffic should use HTTPS.
