import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(120);
  const { token } = useContext(AuthContext);



  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/${id}`)
      .then(res => setQuiz(res.data))
      .catch(() => alert('Failed to load quiz'));
  }, [id]);

  useEffect(() => {
  let timer;
  if (quiz) {
    timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => clearInterval(timer);
}, [quiz]);

  const handleOptionChange = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const handleNext = () => {
    setCurrent(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrent(prev => prev - 1);
  };

  const handleSubmit = async () => {
  if (submitted) return;
  setSubmitted(true);

  let score = 0;
  quiz.questions.forEach((q, index) => {
    if (answers[index] === q.answer) score++;
  });

  // Save result to backend
  try {
    await axios.post(
      'http://localhost:5000/api/results',
      {
        quizId: quiz._id,
        score,
        total: quiz.questions.length,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (err) {
    console.error('Failed to save result', err);
  }

  navigate('/result', { state: { quiz, answers } });
};

  if (!quiz) return <div className="p-6">Loading quiz...</div>;

  const question = quiz.questions[current];

  return (
         <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

        <div className="mb-4 text-right text-red-600 font-semibold">
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>

        <div className="bg-white p-4 border rounded shadow">
        <p className="font-medium mb-3">
          {current + 1}. {question.question}
        </p>
        {question.options.map((opt, idx) => (
          <label key={idx} className="block mb-2">
            <input
              type="radio"
              name={`question-${current}`}
              value={opt}
              checked={answers[current] === opt}
              onChange={() => handleOptionChange(current, opt)}
              className="mr-2"
            />
            {opt}
          </label>
        ))}
        <div className="mt-4 flex justify-between">
          {current > 0 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back
            </button>
          )}
          {current < quiz.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="ml-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
