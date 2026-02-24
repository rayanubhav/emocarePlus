import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';
import { RiRobot2Line, RiSendPlane2Fill } from 'react-icons/ri';
import { FaSpinner } from 'react-icons/fa';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/chat/history');
        const history = response.data;

        const formattedHistory = [];
        if (history.length > 0) {
          history.forEach((item) => {
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
          formattedHistory.push({
            id: 'init1',
            text: "Hello! I'm your mindful assistant. How are you feeling today?",
            isUser: false,
          });
        }

        setMessages(formattedHistory);
      } catch (error) {
        setMessages([{ id: 'error1', text: 'Could not load chat history.', isUser: false }]);
      } finally {
        setIsFetchingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '' || isLoading) return;

    const userMessage = { id: Date.now().toString(), text: inputText.trim(), isUser: true };
    setMessages((prev) => [...prev, userMessage]);
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
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-white border border-[#D9E6F2] rounded-[24px] shadow-[0_2px_16px_rgba(91,155,213,0.07)] overflow-hidden "
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#D9E6F2] bg-gradient-to-br from-[#5B9BD5]/5 to-[#72C5A8]/5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4F2E8] to-[#D6EAFC] border-[1.5px] border-[#72C5A8] flex items-center justify-center text-[16px] shrink-0">
          🤖
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-[#2D3E50]">AI Companion</h3>
          <p className="text-[11px] text-[#7A90A4]">A safe space to share your thoughts</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-[#72C5A8] shadow-[0_0_0_2px_rgba(114,197,168,0.3)] shrink-0" />
      </div>

      {/* Chat Container */}
      <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto bg-[#FAFCFE] flex flex-col gap-3">
        {isFetchingHistory ? (
          <div className="flex h-full items-center justify-center">
            <FaSpinner className="animate-spin text-[#5B9BD5]" size={24} />
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-end gap-2 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!msg.isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#D4F2E8] border-[1.5px] border-[#72C5A8] flex items-center justify-center text-[12px] shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 text-[13px] leading-[1.55] ${
                    msg.isUser
                      ? 'bg-[#5B9BD5] text-white rounded-[16px] rounded-br-[4px] shadow-[0_2px_8px_rgba(91,155,213,0.2)]'
                      : 'bg-white text-[#2D3E50] border border-[#D9E6F2] rounded-[16px] rounded-bl-[4px]'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2 flex-row">
                <div className="w-7 h-7 rounded-full bg-[#D4F2E8] border-[1.5px] border-[#72C5A8] flex items-center justify-center text-[12px] shrink-0">
                  🤖
                </div>
                <div className="px-4 py-3 bg-white border border-[#D9E6F2] rounded-[16px] rounded-bl-[4px]">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-[#7A90A4] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-[#7A90A4] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-[#7A90A4] rounded-full animate-bounce"></span>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[#D9E6F2] bg-white flex items-center gap-2.5">
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share what's on your mind..."
            disabled={isLoading}
            className="flex-1 bg-[#F7FAFC] border-[1.5px] border-[#D9E6F2] rounded-full px-4 py-2.5 text-[13px] text-[#2D3E50] outline-none transition-all focus:border-[#5B9BD5] focus:shadow-[0_0_0_3px_rgba(91,155,213,0.1)] placeholder:text-[#7A90A4]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="w-[38px] h-[38px] rounded-full bg-[#5B9BD5] text-white flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(91,155,213,0.25)] transition-all hover:bg-[#4A88C0] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RiSendPlane2Fill size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Chatbot;