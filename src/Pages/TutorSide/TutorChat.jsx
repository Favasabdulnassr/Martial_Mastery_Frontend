import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Send, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';
import axiosInstance from '@/services/interceptor';
import { createOrGetChatRoom,fetchMessages,WebSocketService } from '@/services/chatService';

const TutorChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [wsService, setWsService] = useState(null);
  const { studentId } = useParams(); 
  const messagesEndRef = useRef(null);
  const [student, setStudent] = useState(null);
  const { user } = useSelector((state) => state.login);
  const tutorId = user?.id



  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axiosInstance.get(`chat/students/${studentId}/`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student:', error);
      }
    };

    if (studentId) fetchStudent();
  }, [studentId]);


  useEffect(() => {
    console.log('tutoraaaaaaaaaaano',tutorId,studentId);
    if (!user || !studentId || !tutorId) return;

    
    const initializeChat = async () => {
      try {
        // Create or get chat room
        const room = await createOrGetChatRoom(studentId, tutorId);
        
        // Fetch existing messages
        const existingMessages = await fetchMessages(room.id);
        setMessages(existingMessages);

        // Initialize WebSocket connection
        const ws = new WebSocketService(room.id, user.token);
        ws.addMessageHandler(handleNewMessage);
        ws.connect();
        setWsService(ws);

        return () => {
          ws.disconnect();
        };
      } catch (error) {
        console.error('Error initializing chat:', error);
        // Handle error appropriately
      }
    };

    initializeChat();
  }, [studentId, tutorId]);

  const handleNewMessage = (data) => {
    setMessages(prev => [...prev, {
      id: data.id, // temporary id
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



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Example message data structure
  // const sampleMessages = [
  //   { id: 1, sender: 'tutor', content: 'Hello! How can I help you today?', timestamp: '10:00 AM' },
  //   { id: 2, sender: 'student', content: 'I have a question about the course material.', timestamp: '10:02 AM' },
  // ];

  // const handleSendMessage = (e) => {
  //   e.preventDefault();
  //   if (newMessage.trim()) {
  //     const message = {
  //       id: messages.length + 1,
  //       sender: 'tutor',
  //       content: newMessage,
  //       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //     };
  //     setMessages([...messages, message]);
  //     setNewMessage('');
  //   }
  // };

  

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <TutorSidebar />
      
      <div className="flex-1 lg:ml-80">
        <TutorTopbar />
        
        <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
          <div className="flex items-center mb-6">
            <button className="mr-4 p-2 hover:bg-gray-800 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Chat with Student</h1>
              <p className="text-gray-400">
                John Doe • Computer Science 101
                {student ? `${student.name} • ${student.course}` : 'Loading...'}
                </p>
            </div>
          </div>

          <Card className="flex-1 bg-gray-800 border-gray-700 overflow-hidden flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_email === user.email ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender_email === user?.email
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
             
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            
            <div className="p-4 border-t border-gray-700">
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2 transition-colors"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorChat;