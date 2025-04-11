// src/Admin/AddQuestions.js

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AddQuestions = () => {
  // Initialize state for each form field
  const [formData, setFormData] = useState({
    name: '',
    topic: '', // Store the topic_id here
    description: '',
    difficulty: 'easy', // Default value
    answer: '',
    companies: '', // New companies field
  });

  // State for form submission status and errors
  const token = localStorage.getItem('access_token');
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [topics, setTopics] = useState([]); // State for storing fetched topics

  // Fetch topics from the API
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/topics/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTopics(data); // Set the topics in the state
        } else {
          console.error('Failed to fetch topics');
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear any existing errors for the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  // Validate form fields
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.topic.trim()) newErrors.topic = 'Topic is required.'; // Ensure topic is required
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty level is required.';
    if (!formData.answer.trim()) newErrors.answer = 'Answer is required.';
    if (!formData.companies.trim()) newErrors.companies = 'Companies field is required.'; // New validation for companies

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Set loading state
    setIsSubmitting(true);
    setSubmissionStatus('');

    try {
      const response = await fetch(`${API_BASE_URL}/questions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData), // Send the topic_id (formData.topic)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const formattedErrors = {};

        for (const key in errorData) {
          if (errorData.hasOwnProperty(key)) {
            formattedErrors[key] = errorData[key].join(' ');
          }
        }

        setErrors(formattedErrors);
        setSubmissionStatus('Failed to add question. Please fix the errors and try again.');
      } else {
        const result = await response.json();
        console.log('Success:', result);

        // Reset form after successful submission
        setFormData({
          name: '',
          topic: '', // Clear the topic field
          description: '',
          difficulty: 'easy',
          answer: '',
          companies: '', // Clear the companies field
        });

        setSubmissionStatus('Question added successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmissionStatus('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);

      // Clear the success message after a few seconds
      if (submissionStatus === 'Question added successfully!') {
        setTimeout(() => {
          setSubmissionStatus('');
        }, 3000);
      }
    }
  };

  return (
    <div className="w-full add-questions-container text-white flex flex-col items-center p-4">
      <h2 className='text-3xl '>Add New Question</h2>
      {submissionStatus && (
        <p className={`mb-4 ${submissionStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {submissionStatus}
        </p>
      )}
      <form onSubmit={handleSubmit} className="w-5/6 add-questions-form text-xl gap-2 flex flex-col justify-center">
        {/* Name Field */}
        <div className="form-group flex flex-col w-full">
          <label htmlFor="name">Name<span className="required">*</span>:</label>
          <input
            className={`pl-2 w-full h-10 rounded-xl text-black ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter question name"
          />
          {errors.name && <span className="error text-red-500">{errors.name}</span>}
        </div>

        {/* Topic Dropdown Field */}
        <div className="form-group flex flex-col">
          <label htmlFor="topic">Topic<span className="required">*</span>:</label>
          <select
            className={`pl-2 w-full h-10 rounded-xl text-black ${errors.topic ? 'border-red-500' : 'border-gray-300'}`}
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
          >
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}  {/* Display the topic name */}
              </option>
            ))}
          </select>
          {errors.topic && <span className="error text-red-500">{errors.topic}</span>}
        </div>

        {/* Description Field */}
        <div className="form-group flex flex-col">
          <label htmlFor="description">Description<span className="required">*</span>:</label>
          <textarea
            className={`pl-2 w-full h-16 rounded-xl text-black resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter question description"
            rows="4"
          ></textarea>
          {errors.description && <span className="error text-red-500">{errors.description}</span>}
        </div>

        {/* Difficulty Field */}
        <div className="form-group flex flex-col">
          <label htmlFor="difficulty">Difficulty<span className="required">*</span>:</label>
          <select
            className={`pl-2 w-full h-10 rounded-xl text-black bg-white ${errors.difficulty ? 'border-red-500' : 'border-gray-300'}`}
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          {errors.difficulty && <span className="error text-red-500">{errors.difficulty}</span>}
        </div>

        {/* Answer Field */}
        <div className="form-group flex flex-col">
          <label htmlFor="answer">Answer<span className="required">*</span>:</label>
          <textarea
            className={`pl-2 w-full h-20 rounded-xl text-black resize-none ${errors.answer ? 'border-red-500' : 'border-gray-300'}`}
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            placeholder="Enter answer"
            rows="4"
          ></textarea>
          {errors.answer && <span className="error text-red-500">{errors.answer}</span>}
        </div>

        {/* Companies Field */}
        <div className="form-group flex flex-col">
          <label htmlFor="companies">Companies<span className="required">*</span>:</label>
          <input
            className={`pl-2 w-full h-10 rounded-xl text-black ${errors.companies ? 'border-red-500' : 'border-gray-300'}`}
            type="text"
            id="companies"
            name="companies"
            value={formData.companies}
            onChange={handleChange}
            placeholder="Enter companies name"
          />
          {errors.companies && <span className="error text-red-500">{errors.companies}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Question'}
        </button>
      </form>
    </div>
  );
};

export default AddQuestions;
