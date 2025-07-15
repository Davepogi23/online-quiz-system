import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import CreateQuizForm from '../components/CreateQuizForm';
import axios from 'axios';

function Dashboard() {
  const { isAdmin, logout, token } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  // Fetch quizzes for users
  useEffect(() => {
    if (!isAdmin) {
      const url = selectedCategory
        ? `http://localhost:5000/api/quizzes?category=${selectedCategory}`
        : `http://localhost:5000/api/quizzes`;

      axios.get(url)
        .then(res => setQuizzes(res.data))
        .catch(() => alert('Failed to load quizzes'));
    }
  }, [isAdmin, selectedCategory]);

  // Fetch user quiz history
  useEffect(() => {
    if (!isAdmin) {
      axios.get('http://localhost:5000/api/results/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setHistory(res.data))
      .catch(() => alert('Failed to load quiz history'));
    }
  }, [isAdmin, token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            View Leaderboard
          </button>
        </div>

      {isAdmin ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Admin Panel: Create a Quiz</h2>
          <CreateQuizForm />
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Available Quizzes</h2>

          <div className="mb-4">
            <label className="mr-2 font-medium">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All</option>
              <option value="JavaScript">JavaScript</option>
              <option value="HTML">HTML</option>
              <option value="Networking">Networking</option>
              {/* Add more if needed */}
            </select>
          </div>

          {quizzes.length === 0 ? (
            <p className="text-gray-600">No quizzes available yet.</p>
          ) : (
            <ul className="space-y-3">
              {quizzes.map((quiz) => (
                <li key={quiz._id} className="p-4 border rounded shadow-sm">
                  <span className="font-medium">{quiz.title}</span>
                  <button
                    className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                  >
                    Take Quiz
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Quiz History */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Your Quiz History</h2>
            {history.length === 0 ? (
              <p className="text-gray-600">No attempts yet.</p>
            ) : (
              <ul className="space-y-2">
                {history.map((r, i) => (
                  <li key={i} className="border rounded p-3 shadow-sm bg-white">
                    <p><strong>{r.quiz?.title}</strong></p>
                    <p>Score: {r.score} / {r.total}</p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(r.date).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
