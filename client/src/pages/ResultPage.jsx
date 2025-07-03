import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz, answers } = location.state || {};

  if (!quiz || !answers) {
    return <div className="p-6">No result data. <button onClick={() => navigate('/dashboard')} className="ml-2 text-blue-600 underline">Go back</button></div>;
  }

  let score = 0;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quiz Results: {quiz.title}</h1>
      <ul className="space-y-4">
        {quiz.questions.map((q, i) => {
          const userAnswer = answers[i];
          const isCorrect = userAnswer === q.answer;
          if (isCorrect) score++;

          return (
            <li key={i} className="p-4 border rounded shadow-sm bg-white">
              <p className="font-medium">{i + 1}. {q.question}</p>
              <p className={`mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                Your Answer: {userAnswer || <span className="italic">No answer</span>}
              </p>
              {!isCorrect && (
                <p className="text-gray-700">
                  Correct Answer: <span className="font-semibold">{q.answer}</span>
                </p>
              )}
              {q.explanation && (
                <p className="text-sm text-blue-700 mt-1">
                  Explanation: {q.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 text-xl font-bold text-center">
        Final Score: {score} / {quiz.questions.length}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ResultPage;
