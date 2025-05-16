import React, { useEffect, useState } from "react";
import axios from "axios";

const Insights = () => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data } = await axios.get("/api/insights");
        setInsights(data);
      } catch (error) {
        console.error("Error fetching insights", error);
      }
    };
    fetchInsights();
  }, []);

  if (!insights) return <p>Loading insights...</p>;

  return (
    <div className="p-6 rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">🧠 AI Insights</h2>
      <p className="mb-2">💰 Total Income: ₹{insights.totalIncome}</p>
      <p className="mb-2">🛒 Total Expenses: ₹{insights.totalExpense}</p>
      <p className="mb-2">📈 Savings: ₹{insights.savings}</p>
      <p className="mb-4">💡 Saving Rate: {insights.savingRate}%</p>

      <h3 className="text-xl font-semibold mb-2">Smart Tips:</h3>
      <ul className="list-disc ml-5">
        {insights.tips.map((tip, index) => (
          <li key={index} className="mb-1">{tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default Insights;
