const { useState } = React;

function MealCard({ meal }) {
  return (
    <div className="border p-2 m-2 bg-white shadow">
      <h3 className="font-bold">{meal.name}</h3>
      <p>Calories: {meal.calories}</p>
      <p>Protein: {meal.macros.protein}g | Carbs: {meal.macros.carbs}g | Fat: {meal.macros.fat}g</p>
      <p>Price: ${meal.price.toFixed(2)}</p>
    </div>
  );
}

function MealPlanDisplay({ plan }) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Meal Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {plan.meals.map((m, idx) => <MealCard key={idx} meal={m} />)}
      </div>
      <p className="mt-2 font-bold">Total Price: ${plan.total_price.toFixed(2)}</p>
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">NEUTRA-BALANCE</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block">Daily Budget: ${budget}
            <input type="range" min="10" max="100" value={budget} onChange={e=>setBudget(parseInt(e.target.value))} className="w-full" />
          </label>
          <label className="block mt-2">Meals per day
            <input type="number" value={mealsPerDay} onChange={e=>setMealsPerDay(parseInt(e.target.value))} className="border ml-2 w-16" />
          </label>
          <label className="block mt-2">Optimization intent
            <input type="text" value={intent} onChange={e=>setIntent(e.target.value)} className="border ml-2" />
          </label>
          <div className="mt-2">
            <span className="font-semibold">Exclusions:</span>
            {Object.keys(exclusions).map(key => (
              <label key={key} className="ml-2">
                <input type="checkbox" checked={exclusions[key]} onChange={()=>toggleExclusion(key)} /> {key}
              </label>
            ))}
          </div>
          <div className="mt-2">
            <span className="font-semibold">Cuisine bias:</span>
            {['Asian','Vegan','Mediterranean'].map(c => (
              <button key={c} onClick={()=>setCuisine(c)} className={`ml-2 px-2 py-1 border ${cuisine===c?'bg-blue-200':''}`}>{c}</button>
            ))}
          </div>
          <label className="block mt-2">Current inventory (comma separated)
            <input type="text" value={inventory} onChange={e=>setInventory(e.target.value)} className="border ml-2 w-full" />
          </label>
          <button onClick={generatePlan} className="mt-4 px-4 py-2 bg-green-500 text-white">Generate Plan</button>
        </div>
      </div>
      {plan && <MealPlanDisplay plan={plan} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
