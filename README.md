# EcoSort AI — AI-Powered Waste Segregation

EcoSort AI is a full-stack sustainability project that helps users identify common household waste, choose the right segregation stream, understand the disposal reasoning, and track environmental impact.

## Internship project alignment
- **UN SDG:** SDG 11 — Sustainable Cities and Communities; SDG 12 — Responsible Consumption and Production.
- **Problem:** Incorrect waste segregation causes recyclable and organic material to be mixed with landfill waste and makes safe handling of e-waste/hazardous material harder.
- **Solution:** A web-based classification assistant with category guidance, confidence scoring, history, impact analytics and an AI-style classification workflow.

## Tech stack
- **Frontend:** React 18 + Vite + React Router + custom responsive CSS.
- **Backend:** Node.js + Express.
- **Database:** Node `node:sqlite` with per-user history.
- **Authentication:** JWT + bcrypt.
- **Classification:** Isolated server-side heuristic/keyword engine. It is intentionally replaceable with a trained image model or LLM API later; the current version does not claim to run a trained computer-vision model.

## Demo
Backend: `http://localhost:5000`  
Frontend: `http://localhost:5173`

Demo account after seeding:
- Email: `demo@ecosort.ai`
- Password: `demo1234`

## Run
### Backend
```bash
cd backend
npm install
npm run seed
npm start
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Main features
1. Dashboard with waste statistics, recent classifications, sustainability metrics and weekly trend.
2. AI Waste Classification workspace with text classification and image-input UI.
3. Sorting history with deletion and clear-history controls.
4. Environmental impact analytics.
5. Profile/session settings.
6. Responsive dark sustainability UI inspired by a modern operations dashboard.

## API
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/classify`
- `GET /api/dashboard`
- `GET /api/history`
- `DELETE /api/history/:id`
- `DELETE /api/history`
- `GET /api/impact`
- `GET /api/health`
