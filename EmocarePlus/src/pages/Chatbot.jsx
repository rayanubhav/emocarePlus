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
      className="flex flex-col h-full glass rounded-[24px] shadow-[0_4px_24px_rgba(91,155,213,0.10)] overflow-hidden"
    >      <div className="flex items-center gap-3 p-4 border-b border-[var(--glass-border)] bg-gradient-to-br from-[#5B9BD5]/8 to-[#72C5A8]/8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4F2E8] to-[#D6EAFC] border-[1.5px] border-[#72C5A8] flex items-center justify-center text-[18px] shrink-0 shadow-[0_2px_8px_rgba(114,197,168,0.2)]">
          🤖
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-text-main tracking-[-0.01em]">AI Companion</h3>
          <p className="text-[11px] text-text-muted">A safe space to share your thoughts</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#72C5A8] shadow-[0_0_0_3px_rgba(114,197,168,0.2)] animate-pulse shrink-0" />
          <span className="text-[10px] text-text-muted font-medium">Online</span>
        </div>
      </div>
      <div ref={chatContainerRef} className="flex-grow p-5 overflow-y-auto bg-surface-light/50 flex flex-col gap-4 styled-scrollbar">
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
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex items-end gap-2.5 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!msg.isUser && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4F2E8] to-[#D6EAFC] border-[1.5px] border-[#72C5A8] flex items-center justify-center text-[12px] shrink-0 shadow-sm">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 text-[13.5px] leading-[1.65] tracking-[0.005em] ${msg.isUser
                    ? 'bg-primary text-white rounded-[18px] rounded-br-[6px] shadow-[0_2px_12px_rgba(91,155,213,0.25)]'
                    : 'glass-subtle text-text-main rounded-[18px] rounded-bl-[6px]'
                    }`}
                >
                  {msg.text}
                  {msg.emotion && (
                    <span className="inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-secondary/15 text-secondary border border-secondary/20">
                      {msg.emotion}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2.5 flex-row">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4F2E8] to-[#D6EAFC] border-[1.5px] border-[#72C5A8] flex items-center justify-center text-[12px] shrink-0 shadow-sm">
                  🤖
                </div>
                <div className="px-5 py-3.5 glass-subtle rounded-[18px] rounded-bl-[6px]">
                  <div className="flex items-center gap-2">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
      <div className="p-3.5 border-t border-[var(--glass-border)] bg-surface/80 backdrop-blur-sm flex items-center gap-2.5">
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share what's on your mind..."
            disabled={isLoading}
            className="flex-1 bg-surface-light/70 border-[1.5px] border-border rounded-full px-5 py-2.5 text-[13.5px] text-text-main outline-none transition-all focus:border-[#5B9BD5] focus:shadow-[0_0_0_4px_rgba(91,155,213,0.1)] placeholder:text-text-muted backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="w-[40px] h-[40px] rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(91,155,213,0.3)] transition-all hover:bg-[#4A88C0] hover:scale-105 hover:shadow-[0_6px_20px_rgba(91,155,213,0.35)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RiSendPlane2Fill size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Chatbot;