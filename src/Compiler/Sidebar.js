import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchableDropdown = ({ options, label, id, selectedVal, handleChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option[label].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        className="w-full p-2 text-sm rounded-md bg-slate-900 border border-gray-500 cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedVal || 'Select...'}
      </div>
      {isDropdownOpen && (
        <div className="absolute w-full bg-slate-900 border border-gray-500 mt-1 rounded-md z-10">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 text-sm bg-slate-800 border-b border-gray-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.map((option) => (
              <li
                key={option[id]}
                className="p-1 text-xs hover:bg-slate-700 cursor-pointer"
                onClick={() => {
                  handleChange(option[label]);
                  setIsDropdownOpen(false);
                  setSearchTerm('');
                }}
              >
                {option[label]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  filteredQuestions,
  availableTopics,
  selectedDifficulty,
  selectedTopic,
  selectedCompany,
  handleDifficultyChange,
  handleTopicChange,
  handleCompanyChange,
  handleQuestionClick,
  companies,
}) => {
  const companyOptions = companies.map((company, index) => ({ id: index, name: company }));

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
        <div className="w-1/4">
          <label className="block mb-1 text-sm font-semibold">Difficulty</label>
          <select
            className="w-full p-2 rounded-md bg-slate-900 border border-gray-500 focus:ring-2 focus:ring-blue-500 text-sm"
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

        <div className="w-1/4">
          <label className="block mb-1 text-sm font-semibold">Topic</label>
          <select
            className="w-full p-2 rounded-md bg-slate-900 border border-gray-500 focus:ring-2 focus:ring-blue-500 text-sm"
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

        <div className="w-1/2">
          <label className="block mb-1 text-sm font-semibold">Company</label>
          <SearchableDropdown
            options={companyOptions}
            label="name"
            id="id"
            selectedVal={selectedCompany}
            handleChange={(value) => handleCompanyChange(value)}
            className="text-sm"
          />
        </div>
      </div>
      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '75vh' }}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, index) => (
            <div
              key={index}
              className="bg-slate-900 p-3 rounded-md cursor-pointer"
              onClick={() => handleQuestionClick(q)}
            >
              <p className="text-sm font-semibold">
                {q.question.id}. {q.question.name}
              </p>
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
