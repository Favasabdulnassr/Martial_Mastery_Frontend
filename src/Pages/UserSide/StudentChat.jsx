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
import { useSelector } from 'react-redux';
import { fetchMessages,WebSocketService,createOrGetChatRoom } from '@/services/chatService';


const StudentChat = () => {
  const { tutorId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [tutor, setTutor] = useState(null);
  const [wsService, setWsService] = useState(null);
  const { user } = useSelector((state) => state.login);
  const studentId = user?.id;


  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        console.log(studentId,tutorId);
        
        const tutorResponse = await axiosInstance.get(`chat/tutor/${tutorId}/`);
        setTutor(tutorResponse.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorData();
  }, [tutorId]);








  
  // // Sample initial messages - replace with actual API data
  // useEffect(() => {
  //   setMessages([
  //     {
  //       id: 1,
  //       sender: 'tutor',
  //       text: 'Hello! How can I help you with the course today?',
  //       timestamp: new Date().toISOString()
  //     }
  //   ]);
  // }, []);


  useEffect(() => {
    if (!tutor?.id || !studentId) return;

    const initializeChat = async () => {
      
      try {
        // Create or get chat room
        const authTokens = JSON.parse(localStorage.getItem('authTokens'));
        const accessToken = authTokens?.access;

        if (!accessToken) {
          console.error('No authentication token found');
          return;
        }

        
        const room = await createOrGetChatRoom(studentId, tutorId);
        console.log('vvvvvvvvvvvvvv',room);
        
        if (!room || !room.id) {
          console.error('Invalid room data received:', room);
          return;
      }
        // Fetch existing messages
        const existingMessages = await fetchMessages(room.id);
        setMessages(existingMessages);

        // Initialize WebSocket connection
        
        const ws = new WebSocketService(room.id, accessToken);
        ws.addMessageHandler(handleNewMessage);
        ws.connect();
        setWsService(ws);

        return () => {
          if (ws) {
            ws.disconnect();
        }
        };
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
  }, [tutor, studentId, user?.token]);






  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const handleNewMessage = (data) => {
    setMessages(prev => [...prev, {
      id: data.id,
      content: data.message,
      sender_email: data.sender_email,
      sender_name: data.sender_name,
      timestamp: new Date(data.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }]);
    scrollToBottom();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() && wsService) {
      
      wsService.sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  //   setMessages(prev => [...prev, userMessage]);
  //   setNewMessage('');
  //   setLoading(true);

  //   // Simulate tutor response - replace with actual API call
  //   setTimeout(() => {
  //     const tutorMessage = {
  //       id: messages.length + 2,
  //       sender: 'tutor',
  //       text: 'Thank you for your message. I understand your question and I\'ll be happy to help.',
  //       timestamp: new Date().toISOString()
  //     };
  //     setMessages(prev => [...prev, tutorMessage]);
  //     setLoading(false);
  //   }, 1500);
  // };

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
                <h2 className="text-2xl font-bold text-black">Tutor {tutor?.first_name}</h2>
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
                className={`flex ${message.sender_email === user?.email ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.sender_email === user?.email
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black'
                      : 'bg-zinc-800 text-white'
                  }`}
                >
                  <p>{message.content}</p>
                  <div className={`text-xs mt-2 ${
                    message.sender_email === user?.email ? 'text-black/70' : 'text-zinc-400'
                  }`}>
                    {message.timestamp}
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