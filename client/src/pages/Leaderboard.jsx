import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/results/leaderboard')
      .then(res => setLeaders(res.data))
      .catch(() => alert('Failed to load leaderboard'));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏆 Leaderboard</h1>
      {leaders.length === 0 ? (
        <p>No results yet.</p>
      ) : (
        <ul className="space-y-3">
          {leaders.map((r, i) => (
            <li key={i} className="border rounded p-4 shadow-sm bg-white">
              <div className="flex justify-between">
                <span><strong>{r.user?.email}</strong> — {r.quiz?.title}</span>
                <span className="font-medium">
                  {r.score} / {r.total}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(r.date).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Leaderboard;
