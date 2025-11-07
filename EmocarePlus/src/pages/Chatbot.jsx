import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../contexts/AuthContext'; // Import our centralized API
import { useAuth } from '../contexts/AuthContext'; // To get user info
import { RiRobot2Line, RiSendPlane2Fill } from 'react-icons/ri';
import { FaSpinner } from 'react-icons/fa';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]); // Start with an empty array
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For sending
  const [isFetchingHistory, setIsFetchingHistory] = useState(true); // For loading
  const chatContainerRef = useRef(null);

  // --- THIS IS THE FIX ---
  // Fetch chat history when the component loads
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/chat/history');
        const history = response.data;
        
        // Transform the backend data into the format React needs
        const formattedHistory = [];
        if (history.length > 0) {
          history.forEach(item => {
            formattedHistory.push({
              id: item.id + '_user',
              text: item.user_message,
              isUser: true,
            });
            formattedHistory.push({
              id: item.id + '_ai',
              text: item.ai_response,
              isUser: false,
            });
          });
        } else {
          // Add the welcome message if history is empty
          formattedHistory.push({ id: 'init1', text: "Hello! I'm your mindful assistant. How are you feeling today?", isUser: false });
        }
        
        setMessages(formattedHistory);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setMessages([{ id: 'error1', text: "Could not load chat history.", isUser: false }]);
      } finally {
        setIsFetchingHistory(false);
      }
    };
    
    fetchHistory();
  }, []); // Empty array means run once on load
  // -----------------------

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '' || isLoading) return;

    const userMessage = { id: Date.now().toString(), text: inputText.trim(), isUser: true };
    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/chat', {
        message: messageText,
        user_id: user?.id || 'anonymous',
      });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        isUser: false,
        emotion: response.data.emotion,
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-[var(--color-surface)] rounded-xl shadow-lg">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-xl font-bold text-white">AI Companion</h3>
        <p className="text-sm text-[var(--color-text-muted)]">A safe space to share.</p>
      </div>
      
      <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto">
        {isFetchingHistory ? (
          <div className="flex h-full items-center justify-center">
            <FaSpinner className="animate-spin text-white" />
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isUser && (
                  <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center mr-3 flex-shrink-0">
                    <RiRobot2Line size={24} />
                  </div>
                )}
                <div className={`max-w-md p-3 rounded-2xl ${msg.isUser ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-br-none' : 'bg-black/20 text-white rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                {msg.isUser && (
                  <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center ml-3 flex-shrink-0 font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div className="flex items-end gap-3 justify-start">
                <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center mr-3 flex-shrink-0">
                  <RiRobot2Line size={24} />
                </div>
                <div className="max-w-md p-3 rounded-2xl bg-black/20">
                  <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share what's on your mind..."
            disabled={isLoading}
            className="w-full px-4 py-2 bg-black/20 rounded-full focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
          />
          <button type="submit" disabled={isLoading || !inputText.trim()} className="text-[var(--color-primary)] disabled:text-gray-600">
            <RiSendPlane2Fill size={24} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Chatbot;