import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import AIChat from './AIChat';
import Editor from './Editor';
import Header from './Header';
import QuestionItem from './QuestionItem';
import Sidebar from './Sidebar';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Output from './Output';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';
const CodeEditor = () => {
  const [language, setLanguage] = useState('csharp');
  const [isChatbotLoading, setIsChatbotLoading] = useState(false);
  const theme = 'monokai';
  const [messages, setMessages] = useState([]);
  const [editorValue, setEditorValue] = useState('');
  const [output, setOutput] = useState('');
  const [theerror, setError] = useState('');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOutputVisible, setIsOutputVisible] = useState(false); 
  const [questions, setQuestions] = useState([]); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(''); 
  const [selectedTopic, setSelectedTopic] = useState(''); 
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [availableTopics, setAvailableTopics] = useState([]); 
  const [showOutput, setShowOutput] = useState(false); // State to control the visibility of the output
  const [messagesFromInput, setMessagesFromInput] = useState(false);  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('access_token'); 
        const response = await axios.get(`${API_BASE_URL}/questions/user_status/`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          }
        });

        const unsolvedQuestions = response.data.filter(q => q.status === 'unsolved');
        setQuestions(unsolvedQuestions);
        setFilteredQuestions(unsolvedQuestions);
        const topics = [...new Set(unsolvedQuestions.map((q) => q.question.topic_name))];
        setAvailableTopics(topics);
        setSelectedQuestion(unsolvedQuestions[0]); 
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success("Copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const formatErrorResponse = (response) => {
    // Match any code block enclosed in triple backticks
    const codeBlockPattern = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g;

    // Replace matched code blocks with SyntaxHighlighter component
    return response.split(codeBlockPattern).map((part, index) => {
      if (index % 3 === 1) {
        const language = part.trim();
        return (
          <div className='w-fit relative '>
          <button
              onClick={() => copyToClipboard(response.split(codeBlockPattern)[index + 1])}
              className="absolute right-0 top-0  text-gray-400 p-[0.2rem] rounded-md hover:bg-blue-600"
            >
              <FaCopy />
          </button>
          <SyntaxHighlighter key={index} language={language} style={solarizedlight} className=''>
            {response.split(codeBlockPattern)[index + 1]}
          </SyntaxHighlighter>
          </div>
        );
      }
      return part;
    });
  };
  

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };
 
  const updateQuestionStatus = async (questionId, newStatus, language) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(
      `${API_BASE_URL}/questions/${questionId}/update_status/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus,language: language })
      }
    );
    
    if (!response.ok) {
      console.error("Failed to update question status");
      return;
    }
    
    // Optionally, update local React state to reflect the new status
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.question.id === questionId) {
          return { ...q, status: newStatus };
        }
        return q;
      })
    );
  };
  
  const handleRunCode = async () => {
    setShowOutput(true);
    const languageVersions = {
      python: '1',
      java: '1',
      csharp: '4',
      cpp: '0',
      c: '0',
      go: '0',
      php: '0',
      javascript: '0',
      
    };
  
    const versionIndex = languageVersions[language] || null;
  
    const raw = JSON.stringify({
      clientId: '1ff06c76b637c5f12138528d188cef03',
      clientSecret: '14b98ef7dd6ece22d5b93aa80d4ebf1dec5b7b6342dee4d964bbd92c1fea0e9a',
      code: editorValue, // Code from the editor
      language: language,
      versionIndex: versionIndex,
    });
  
    const token = localStorage.getItem('access_token'); 
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: raw,
    };
  

    try {
      // Make a request to your Django backend
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/run-code/`, requestOptions);
      const result = await response.json();
      console.log(result)
      console.log(selectedQuestion.question)
      console.log(result);
      if (result.error !=="") {
        setOutput(result.error);
        setError(result.error);
      } 
      // else if (result.output === "") 
      // {
      //   setOutput(result.error);
      //   setError(result.error);
        
      // }

         // Open AI Assistant if there is an error
       else {
        setOutput(result.output || 'No output');
        const normalizedOutput = result.output.replace(/\r\n/g, "\n").trim();

        // If the output matches the answer, mark the question as solved
        const normalizedAnswer = selectedQuestion.question.answer.replace(/\r\n/g, "\n").trim();
        console.log(normalizedOutput)
        console.log(normalizedAnswer)

        

// Compare ignoring line endings if you want
        if (normalizedAnswer === normalizedOutput) {
          // Mark as solved in the frontend, or do a follow-up API call to update status
          toast.success("Correct output! Marking question as solved.");
          updateQuestionStatus(selectedQuestion.question.id, "solved",language);
          setEditorValue('')
           
        } else {
          toast.error("Incorrect output or not matching the question's answer!");
        }
      }
      setShowOutput(true);
      setLoading(false) // Show output section
    } catch (error) {
      setOutput('Error: ' + error.message);
      setError(error.message);

      setShowOutput(true);
    }
  };
  
  const getChatbotResponse = async (userMessage) => {
    if (isChatbotLoading) return; // Prevent duplicate API calls
  
    setIsChatbotLoading(true); // Set loading to true when starting the API request
  
    try {
      const token = localStorage.getItem('access_token');
      console.log(userMessage)
      // Construct the prompt based on the selected question and editor value
      const prompt = `
      This is the question: ${selectedQuestion.question.description}
      If the provided code is incorrect or does not satisfy the requirements of the question, provide constructive feedback and suggest a corrected version of the code in backticks.
      Ensure the corrected code fully satisfies the question requirements, specifically addressing the task described: "${selectedQuestion.question.description}".
      `;     
        const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [ // Adjusting to send an array of messages
            {
              role: 'system',
              content:prompt,
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) { // Check if the response is successful
        // Update messages with both user and assistant responses
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content:formatErrorResponse(data.response)},
        ]);
      } else {
        console.error('Error from API:', data);
      }
    } catch (error) {
      console.error('Error fetching response from OpenAI:', error);
    } finally {
      setIsChatbotLoading(false); // Reset loading state after the request is complete
    }
  };
  
  const toggleAssistant = async () => {
    setIsAssistantOpen(!isAssistantOpen);
    if (theerror && theerror.trim() !== '' && !isChatbotLoading) {
      setIsChatbotLoading(true);
      const err =`question: ${selectedQuestion.question.description}. This is code: ${editorValue}. error:`+theerror+'firstly check if code is logically correct secondly check if code is syntactically correct then provide the correct code as per question'
      await getChatbotResponse(err);
      setIsChatbotLoading(false);
      setError('');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    toggleSidebar();
  };


  const filterQuestions = (difficulty, topic) => {
    let filtered = questions;
  
    if (difficulty) {
      filtered = filtered.filter((q) => q.question.difficulty === difficulty); // Filter by difficulty
    }
  
    if (topic) {
      filtered = filtered.filter((q) => q.question.topic_name === topic); // Filter by topic
    }
  
    // If no filter is selected, show all questions
    if (!difficulty && !topic) {
      filtered = questions;
    }
  
    setFilteredQuestions(filtered); // Update filtered questions
  };
  

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
    filterQuestions(e.target.value, selectedTopic);
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    console.log(e.target.value)
    filterQuestions(selectedDifficulty, e.target.value);
  };

  const closeOutput = () => {
    setShowOutput(false); 
  };

  return (
    <div className="bg-gray-200 text-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <Header 
        language={language} 
        handleLanguageChange={handleLanguageChange}
        handleRunCode={handleRunCode}
        loading={loading}
        setIsOutputVisible={setIsOutputVisible}
        toggleAssistant={toggleAssistant}
      />

      {/* Main Content */}
      <main className="container mx-auto flex-1 px-2 py-2 space-y-8">

        {/* Editor and Output */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Sidebar (for unsolved questions) */}
          <Sidebar isSidebarOpen = { isSidebarOpen}
            toggleSidebar = { toggleSidebar }
            filteredQuestions = { filteredQuestions }
            availableTopics = { availableTopics }
            selectedDifficulty = { selectedDifficulty }
            selectedTopic = { selectedTopic }
            handleDifficultyChange = { handleDifficultyChange }
            handleTopicChange = { handleTopicChange }
            handleQuestionClick={handleQuestionClick}
            />
          {/* Questions */}
          <QuestionItem selectedQuestion={selectedQuestion} toggleSidebar = {toggleSidebar}/>
          {/* Code Editor */}
          <Editor language={language} theme={theme} setEditorValue={setEditorValue} editorValue={editorValue}  handleRunCode={handleRunCode} setShowOutput={setShowOutput} showOutput={showOutput} output={output}/>
        </section>

        {/* Output */}
        {showOutput && (
            <Output loading={loading} output={output} closeOutput={closeOutput} toggleAssistant={toggleAssistant} / >
        )}
      </main>

   {/* AI Assistant */}
   {isAssistantOpen && (
        <AIChat loading={isChatbotLoading} setLoading={setIsChatbotLoading}  messagesFromInput={messagesFromInput} setMessageFromInput={setMessagesFromInput} formatErrorResponse={formatErrorResponse} toggleAssistant={toggleAssistant} errorMessage={theerror} messages={messages} setMessages={setMessages} getChatbotResponse={getChatbotResponse}
        />
      )}
    </div>
  );
};

export default CodeEditor;
