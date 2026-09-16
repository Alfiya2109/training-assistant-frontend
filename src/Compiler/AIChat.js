import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
const AIChat = ({ loading, setLoading, toggleAssistant, errorMessage, messages, setMessages, getChatbotResponse, formatErrorResponse, messageFromInput, setMessageFromInput }) => {
  const [userMessage, setUserMessage] = useState('');
  const [remainingTokens, setRemainingTokens] = useState(0);
  // Function to handle sending messages to the AI chat
  useEffect(() => {
    // Function to fetch user data
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem('access_token'); // Retrieve the access token from local storage
        const response = await axios.get(`${API_BASE_URL}/current-user/`, {
          headers: {
            Authorization: `Bearer ${accessToken}` // Use the access token in the authorization header
          }
        });
        // Set users data from response
        setRemainingTokens(parseInt(response.data.token_limit)-parseInt(response.data.token_consumption)); // Set remaining tokens from response
        setLoading(false); // Set loading to false once data is loaded
      } catch (e) {
        setRemainingTokens(50000);
        setLoading(false); // Ensure loading is set to false
      }
    };

    const intervalId = setInterval(() => {
      fetchUsers();  // This will refresh the token count periodically
    }, 9000);  // Adjust time as needed, e.g., every minute
  
    return () => clearInterval(intervalId);
  }, []);
  
  const handleSendMessage = async () => {
    if (!userMessage) return;
    setLoading(true);
    setMessageFromInput(true); // Optional: Clear input field after sending message

    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,{ role: 'user', content: userMessage },
    ]);
    setUserMessage('');

    // Call the AI API

    try {
      var botResponse ='';
      if (remainingTokens<=0){
           botResponse = 'You have reached token limit'
      }
      else{
           botResponse = await getChatbotResponse(userMessage);
      }  
      const formattedError = formatErrorResponse(botResponse);

      if (!botResponse) {
        console.error("Empty response from bot");
        return;
      }

      // Add bot's response to the chat messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: formattedError },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error calling AI API', error);
    }
    finally{
      setLoading(false);

    }
  };

 

  return (
    <aside
      id="error-assistant"
      className="fixed top-0 text-sm right-0 h-full w-11/12 z-50 sm:w-1/3 bg-blue-950 text-gray-100 shadow-lg p-4 flex flex-col"
    >
      <div className="flex w-full justify-between mb-4">
        <h2 className="text-lg font-semibold">AI Error Assistant</h2>
        <p
          className="font-semibold text-xl cursor-pointer hover:text-red-300"
          onClick={toggleAssistant}
        >
          x
        </p>
      </div>
      <div className='text-white w-full text-right'>Remaining Tokens: {remainingTokens<0?0:remainingTokens}</div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
        <div className="flex flex-col space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.role === 'user'
                    ? 'bg-blue-500 z-50 text-white self-end rounded-lg p-2 max-w-xs'
                    : 'bg-gray-700 z-50 text-white self-start rounded-lg p-2 max-w-xs'
                }`}
              >
               
                {msg.content}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No messages yet.</p>
          )}
        </div>
        {/* Loader */}
      {loading && (
        <div className="flex space-x-2 rounded-lg justify-center w-fit h-8 px-2 pt-1 bg-gray-700 items-center dark:invert">
          <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
        </div>
      )}
      </div>
      

      {/* Message Input */}
      <div className="flex w-full">
        <input
          className="w-full h-12 p-2 bg-gray-900 text-white rounded-lg border border-gray-700 mb-4"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Describe your issue..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 h-12 hover:bg-blue-600 text-white px-3 rounded-md"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </aside>
  );
};

export default AIChat;
