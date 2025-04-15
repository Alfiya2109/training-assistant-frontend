import React from 'react';

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  filteredQuestions,
  availableTopics,
  selectedDifficulty,
  selectedTopic,
  handleDifficultyChange,
  handleTopicChange,
  handleQuestionClick,
}) => {
  return (
    <div
    className={`fixed top-0 left-0 w-11/12 z-50 md:w-1/3 h-full bg-blue-950 text-white p-4 transition-transform transform ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    <div className="flex justify-between">
      <h2 className="text-xl font-semibold mb-4">Unsolved Questions</h2>
      <p
        className="font-semibold text-xl cursor-pointer hover:text-red-300"
        onClick={toggleSidebar}
      >
        x
      </p>
    </div>
  <div className="flex gap-2 mb-2 justify-end">
  <div>
    <label className="block mb-1 text-sm font-semibold">Difficulty</label>
    <select
      className="w-full p-2 rounded-md bg-slate-900  border border-gray-500 focus:ring-2 focus:ring-blue-500"
      value={selectedDifficulty}
      onChange={handleDifficultyChange}
    >
      <option value="">All</option>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
      <option value="complex">Complex</option>
    </select>
  </div>

  <div>
  <label className="block mb-1 text-sm font-semibold">Topic</label>
<select
  className="w-full p-2 rounded-md bg-slate-900 border border-gray-500 focus:ring-2 focus:ring-blue-500"
  value={selectedTopic}
  onChange={handleTopicChange}
>
  <option value="">All</option>
  {[...new Set(availableTopics)].map((topic, index) => (
    <option key={index} value={topic}>
      {topic}
    </option>
  ))}
</select>

<select
  className="w-full p-2 rounded-md bg-slate-900 border border-gray-500 focus:ring-2 focus:ring-blue-500"
  value={selectedTopic}
  onChange={handleTopicChange}
>
  <option value="">All</option>
  {[...new Set(availableTopics)].map((topic, index) => (
    <option key={index} value={topic}>
      {topic}
    </option>
  ))}
</select>

  </div>
</div>
<div className="space-y-2 overflow-y-auto" style={{ maxHeight: '75vh' }}>
    {filteredQuestions.length > 0 ? (
      filteredQuestions.map((q, index) => (
        <div
          key={index}
          className="bg-slate-900  p-3 rounded-md cursor-pointer"
          onClick={() => handleQuestionClick(q)} // Set selected question on click
        >
          <p className="text-sm font-semibold">
            {q.question.id}. {q.question.name}</p>
          <p className="text-xs">Topic: {q.question.topic_name}</p>
        </div>
      ))
    ) : (
      <p>No unsolved questions available.</p>
    )}
</div>

  </div>
  );
};

export default Sidebar;
