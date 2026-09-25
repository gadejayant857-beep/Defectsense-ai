# DefectSense AI Backend — Production

## Runtime

The backend listens on `0.0.0.0` in production and reads the hosting provider's `PORT`.

## CORS

Set `FRONTEND_ORIGIN` to the exact HTTPS frontend origin.

## Health check

`GET /health`

## API

`GET /api/dashboard`
`GET /api/claims`
`GET /api/defects`
`GET /api/intelligence`
`GET /api/analytics`

The production deployment must provide HTTPS and should place the Python service behind the hosting provider's managed TLS/reverse-proxy layer.
