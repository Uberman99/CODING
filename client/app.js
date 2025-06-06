const { useState } = React;

function MealCard({ meal }) {
  return (
    <div className="border rounded-lg p-4 m-2 bg-white shadow-md">
      <h3 className="font-semibold text-lg mb-1">{meal.name}</h3>
      <p className="text-sm text-gray-700">Calories: {meal.calories}</p>
      <p className="text-sm text-gray-700">Protein: {meal.macros.protein}g | Carbs: {meal.macros.carbs}g | Fat: {meal.macros.fat}g</p>
      <p className="text-sm font-medium mt-1">Price: ${meal.price.toFixed(2)}</p>
    </div>
  );
}

function MealPlanDisplay({ plan }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Meal Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {plan.meals.map((m, idx) => <MealCard key={idx} meal={m} />)}
      </div>
      <p className="mt-4 font-bold">Total Price: ${plan.total_price.toFixed(2)} (Budget: ${plan.budget})</p>
    </div>
  );
}

function App() {
  const [budget, setBudget] = useState(30);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [intent, setIntent] = useState('');
  const [exclusions, setExclusions] = useState({gluten:false, soy:false, dairy:false, shellfish:false, nightshades:false});
  const [cuisine, setCuisine] = useState('');
  const [inventory, setInventory] = useState('');
  const [plan, setPlan] = useState(null);

  const toggleExclusion = (key) => setExclusions({...exclusions, [key]:!exclusions[key]});

  const generatePlan = async () => {
    const payload = {budget, mealsPerDay, intent, exclusions, cuisine, inventory: inventory.split(',')};
    const res = await fetch('/api/mealplan', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    const data = await res.json();
    setPlan(data);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-md shadow">
        <h1 className="text-3xl font-bold">NEUTRA-BALANCE</h1>
        <p className="text-sm">Nutrition optimization made simple</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block font-medium">Daily Budget: ${budget}
            <input type="range" min="10" max="100" value={budget} onChange={e=>setBudget(parseInt(e.target.value))} className="w-full" />
          </label>
          <label className="block mt-3 font-medium">Meals per day
            <input type="number" value={mealsPerDay} onChange={e=>setMealsPerDay(parseInt(e.target.value))} className="border ml-2 w-16" />
          </label>
          <label className="block mt-3 font-medium">Optimization intent
            <input type="text" value={intent} onChange={e=>setIntent(e.target.value)} className="border ml-2" />
          </label>
          <div className="mt-3">
            <span className="font-semibold">Exclusions:</span>
            {Object.keys(exclusions).map(key => (
              <label key={key} className="ml-2">
                <input type="checkbox" checked={exclusions[key]} onChange={()=>toggleExclusion(key)} /> {key}
              </label>
            ))}
          </div>
          <div className="mt-3">
            <span className="font-semibold">Cuisine bias:</span>
            {['Asian','Vegan','Mediterranean'].map(c => (
              <button key={c} onClick={()=>setCuisine(c)} className={`ml-2 px-2 py-1 border rounded ${cuisine===c?'bg-blue-200':'bg-white'}`}>{c}</button>
            ))}
          </div>
          <label className="block mt-3 font-medium">Current inventory (comma separated)
            <input type="text" value={inventory} onChange={e=>setInventory(e.target.value)} className="border ml-2 w-full" />
          </label>
          <button onClick={generatePlan} className="mt-4 px-4 py-2 bg-green-500 text-white rounded shadow">Generate Plan</button>
        </div>
      </div>
      {plan && <MealPlanDisplay plan={plan} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
