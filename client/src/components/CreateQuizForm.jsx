import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function CreateQuizForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
  const { token } = useContext(AuthContext);

  const handleChange = (i, field, value) => {
    const updated = [...questions];
    if (field === 'question') updated[i].question = value;
    else if (field === 'answer') updated[i].answer = value;
    else updated[i].options[field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/quizzes',
        { title, category, questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Quiz created!');
      setTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
    } catch (err) {
      alert(err.response.data.message || 'Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <input
        type="text"
        placeholder="Category (e.g. JavaScript, HTML)"
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />
      {questions.map((q, i) => (
        <div key={i} className="mb-4">
          <input
            type="text"
            placeholder={`Question ${i + 1}`}
            value={q.question}
            onChange={e => handleChange(i, 'question', e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          {q.options.map((opt, j) => (
            <input
              key={j}
              type="text"
              placeholder={`Option ${j + 1}`}
              value={opt}
              onChange={e => handleChange(i, j, e.target.value)}
              className="w-full p-2 border rounded mb-1"
              required
            />
          ))}
          <input
            type="text"
            placeholder="Correct Answer"
            value={q.answer}
            onChange={e => handleChange(i, 'answer', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addQuestion}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        + Add Question
      </button>
      <button
        type="submit"
        className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Save Quiz
      </button>
    </form>
  );
}

export default CreateQuizForm;
