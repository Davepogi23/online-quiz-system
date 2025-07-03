import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import CreateQuizForm from '../components/CreateQuizForm';
import axios from 'axios';

function Dashboard() {
  const { isAdmin, logout, token } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (!isAdmin) {
      axios.get('http://localhost:5000/api/quizzes')
        .then(res => setQuizzes(res.data))
        .catch(() => alert('Failed to load quizzes'));
    }
  }, [isAdmin]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>

      {isAdmin ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Admin Panel: Create a Quiz</h2>
          <CreateQuizForm />
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Available Quizzes</h2>
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
        </div>
      )}
    </div>
  );
}

export default Dashboard;