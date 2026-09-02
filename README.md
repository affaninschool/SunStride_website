# SunStride

SunStride is a smart bus station prototype combining RFID-based vehicle tracking with hybrid solar and piezoelectric energy generation.

This repository contains the SunStride website frontend (TypeScript). It documents the project, how to run the site locally, how it connects to the hardware and backend, and recommended deployment options.

---

## Quick overview

- Project: SunStride — smart, off-grid bus station prototype
- Focus: vehicle tracking (RFID), real-time status UI, monitoring energy generated from solar and piezoelectric harvesters
- Tech stack: TypeScript (frontend), designed to integrate with a backend REST/WebSocket API and embedded hardware nodes

---

## Features

- Dashboard showing live vehicle positions and station status
- Historical energy generation charts and real-time telemetry
- Alerts for low-power or maintenance conditions
- Support for RFID-tagged vehicles and station-side readers
- Designed for resilient, low-bandwidth environments (edge-friendly)

---

## Repository layout (typical)

- /public — static assets
- /src — TypeScript source code for the website
  - /components — UI components
  - /pages or /routes — routed views (depending on framework)
  - /services — API clients, WebSocket handlers, data adapters
  - /styles — global and theme styles
- /tests — unit/integration tests
- /docs — supplemental documentation, hardware interfacing notes

If your repository differs, adjust the structure docs to match the actual layout.

---

## Requirements

- Node.js 18.x or later
- npm 9.x or yarn 1.x / 3.x
- Recommended: a modern browser (Chrome, Edge, Firefox)

---

## Environment

This project expects a small set of runtime environment variables to connect to the backend and configure telemetry. Add a `.env.local` (or the convention used by your framework) with keys like:

- REACT_APP_API_BASE_URL or NEXT_PUBLIC_API_BASE_URL — base URL for REST endpoints
- REACT_APP_WS_URL or NEXT_PUBLIC_WS_URL — WebSocket URL for real-time telemetry
- SENTRY_DSN — (optional) error monitoring DSN

Do NOT commit secrets to the repository.

---

## Local development

Install dependencies:

npm install

Run the development server:

npm run dev

Build for production:

npm run build

Start a locally served production build:

npm run start

(Replace above scripts with the actual scripts used by this repository if they differ.)

---

## Connecting to the hardware & backend

SunStride is designed to integrate with two major pieces:

1. Hardware stations (edge nodes)
   - Each station runs firmware that:
     - Reads RFID tags from passing/boarding vehicles
     - Measures energy harvesting from solar panels and piezoelectric transducers
     - Publishes telemetry and status over MQTT/HTTP to the backend
   - Recommended hardware considerations:
     - RTC and local storage to buffer data during network outages
     - Low-power microcontroller with sleep/wake scheduling for sensors

2. Backend (API / realtime server)
   - The backend ingests telemetry, normalizes energy metrics, and exposes:
     - REST endpoints for historical queries
     - WebSocket or Server-Sent Events for live feeds
     - Auth + device management endpoints for station onboarding

Frontend integration points:
- REST API calls for historical charts and configuration
- WebSocket/Realtime feed for live vehicle positions and alerts
- Token-based auth (JWT or API key for device and operator actions)

---

## Data model (example)

Vehicle telemetry:
- id: string (vehicle id or RFID tag)
- timestamp: ISO string
- location: { lat, lon }
- speed: number

Energy telemetry:
- station_id: string
- timestamp: ISO string
- solar_watts: number
- piezo_watts: number
- battery_pct: number

---

## Deployment

- Static-hosting (recommended for frontend-only deployments): Vercel, Netlify, AWS S3 + CloudFront
- Containerized hosting (if server-side rendering or backend is co-located): Docker + cloud provider (GCP, AWS, Azure)

When deploying, ensure the frontend can reach the backend endpoints and WebSocket URL, and configure CORS and allowed origins accordingly.

---

## Testing

- Unit tests: npm run test
- E2E tests: npm run e2e (if present)
- Linting/formatting: npm run lint, npm run format

---

## Security & privacy

- Avoid storing any personally identifiable information (PII) in telemetry.
- Sanitize and validate all device-supplied data before rendering.
- Use HTTPS/WSS for all communications in production.

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Implement your changes and add tests
4. Submit a pull request with a clear description and screenshots (if UI changes)

Please add issues for feature requests and bugs. Include reproducible steps and logs where possible.

---

## Roadmap & future work

- Offline-first behavior and improved local caching
- Mobile-first responsive UI and accessibility improvements
- Advanced energy prediction and anomaly detection
- Integration with transit scheduling systems

---

## Acknowledgements

SunStride is a cross-disciplinary prototype combining embedded systems, renewable energy harvesting, and frontend telemetry visualization. Thanks to all contributors and hardware partners.

---

## License

Please add a LICENSE file to indicate the project's license. Common choices: MIT, Apache-2.0.

---

## Contact

For project questions, architecture discussions, or partnership inquiries, open an issue or contact the maintainer(s) listed on the repository.
