import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Send,
  Clock,
  ArrowLeft,
  Paperclip,
  User,
  UserCircle
} from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import axiosInstance from '@/services/interceptor';

const StudentChat = () => {
  const { tutorialId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Sample initial messages - replace with actual API data
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'tutor',
        text: 'Hello! How can I help you with the course today?',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    // Simulate tutor response - replace with actual API call
    setTimeout(() => {
      const tutorMessage = {
        id: messages.length + 2,
        sender: 'tutor',
        text: 'Thank you for your message. I understand your question and I\'ll be happy to help.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, tutorMessage]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="h-20">
        <Header />
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-zinc-900 rounded-2xl shadow-xl border border-cyan-900/20 overflow-hidden">
          {/* Chat Header */}
          <div className="p-6 bg-gradient-to-r from-cyan-500 to-cyan-400">
            <div className="flex items-center gap-4">
              <UserCircle className="w-12 h-12 text-black" />
              <div>
                <h2 className="text-2xl font-bold text-black">Course Tutor</h2>
                <div className="flex items-center gap-2 text-black/80">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-[60vh] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black'
                      : 'bg-zinc-800 text-white'
                  }`}
                >
                  <p>{message.text}</p>
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-black/70' : 'text-zinc-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 p-4 rounded-2xl">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-6 bg-zinc-800 border-t border-zinc-700">
            <div className="flex gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-zinc-900 text-white rounded-full border border-zinc-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 
                  text-black font-semibold rounded-full shadow-lg 
                  transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,236,255,0.3)]
                  flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentChat;