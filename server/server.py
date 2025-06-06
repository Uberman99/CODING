from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='../client', static_url_path='')

MOCK_FOODS = [
    {
        "name": "Oatmeal",
        "calories": 150,
        "price": 0.5,
        "macros": {"protein": 5, "carbs": 27, "fat": 3},
        "category": "Breakfast"
    },
    {
        "name": "Grilled Chicken",
        "calories": 200,
        "price": 1.2,
        "macros": {"protein": 30, "carbs": 0, "fat": 5},
        "category": "Lunch"
    },
    {
        "name": "Rice",
        "calories": 180,
        "price": 0.4,
        "macros": {"protein": 4, "carbs": 40, "fat": 1},
        "category": "Dinner"
    },
    {
        "name": "Salad",
        "calories": 100,
        "price": 0.8,
        "macros": {"protein": 2, "carbs": 10, "fat": 5},
        "category": "Side"
    }
]


def generate_meal_plan(params):
    meals_per_day = params.get('mealsPerDay', 3)
    budget = params.get('budget', 30)

    meals = []
    total_price = 0
    for i in range(meals_per_day):
        food = MOCK_FOODS[i % len(MOCK_FOODS)]
        meals.append({
            "name": food["name"],
            "calories": food["calories"],
            "price": food["price"],
            "macros": food["macros"]
        })
        total_price += food['price']

    plan = {
        "meals": meals,
        "total_price": total_price,
        "budget": budget
    }
    return plan


@app.route('/api/mealplan', methods=['POST'])
def mealplan():
    params = request.get_json(force=True)
    plan = generate_meal_plan(params)
    return jsonify(plan)


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)


if __name__ == '__main__':
    app.run(port=8000, debug=True)
