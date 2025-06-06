# NEUTRA-BALANCE

This repository contains a small demonstration of a full-stack web application.
The frontend uses **React** and **Tailwind CSS** loaded from CDNs. The backend is a
minimal Python HTTP server that returns a mock meal plan.

## Running

1. Start the server:
   ```bash
   python3 server/server.py
   ```
   This serves the API on `http://localhost:8000/api/mealplan` and also hosts the
   static frontend.

2. Open your browser at `http://localhost:8000` to use the app.

## Notes

This implementation avoids external dependencies so the API integration is
limited to mock data. The structure is kept simple to allow swapping the backend
with a more robust framework or live data source in the future.
