# NEUTRA-BALANCE

NEUTRA-BALANCE is a small nutrition optimization tool built with React and a Python (Flask) backend. The project currently uses mock food data but is structured so the backend can integrate with services like the USDA FoodData Central API.

## Running

1. Install Python requirements
   ```bash
   pip install -r server/requirements.txt
   ```
2. Start the server
   ```bash
   python3 server/server.py
   ```
   The API will be available at `http://localhost:8000/api/mealplan` and the React frontend will be served on the same port.

3. Open your browser at `http://localhost:8000` to use the app.

## Project structure

- **client/** – React frontend served as static files
- **server/** – Flask backend with a simple meal plan generator

This implementation keeps dependencies light but the code can be extended with real data sources and additional features.
