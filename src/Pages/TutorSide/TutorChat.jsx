import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Send, ArrowLeft, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';
import axiosInstance from '@/services/interceptor';
import { createOrGetChatRoom, fetchMessages, WebSocketService } from '@/services/chatService';
import { useParams } from 'react-router-dom';
import Modal from '@/Components/Modal/ModalPortal';
import ConfirmationModal from '@/Components/Modal/ChatDelete';
import { toast } from 'react-toastify';

const TutorChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [wsService, setWsService] = useState(null);
  const { studentId } = useParams();
  const messagesEndRef = useRef(null);
  const [student, setStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [MessageId,SetMessageId] = useState(null)
  
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
    if (!user || !studentId || !tutorId) return;

    let mounted = true
    const initializeChat = async () => {
      try {


        if (wsService) {
          wsService.disconnect();
        }
        // Create or get chat room
        const authTokens = JSON.parse(localStorage.getItem('authTokens'));
        const accessToken = authTokens?.access;

        if (!accessToken) {
          console.error('No authentication token found');
          return;
        }

        const room = await createOrGetChatRoom(studentId, tutorId);

        // Fetch existing messages
        const existingMessages = await fetchMessages(room.id);
        if (mounted) {
          setMessages(existingMessages);

          const ws = new WebSocketService(room.id, accessToken);
          ws.addMessageHandler(handleNewMessage);
          ws.connect();
          setWsService(ws);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();

    return () => {
      mounted = false;
      if (wsService) {
        wsService.disconnect();
      }
    };
  }, [studentId, tutorId]);



  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && wsService && wsService.socket?.readyState === WebSocket.OPEN) {
      const sent = wsService.sendMessage(newMessage.trim());
      if (sent) {
        setNewMessage('');
      } else {
        console.error('Failed to send message');
        // Optionally show an error to the user
      }
    }
  };

  const handleNewMessage = useCallback((data) => {

    if (data.type === 'message_deleted') {
      setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
      return;
    }


    setMessages(prev => {
      // Check if message already exists
      const messageExists = prev.some(msg => msg.id === data.id);
      if (messageExists) {
        return prev;
      }

      // Create new message object
      const newMessage = {
        id: data.id,
        content: data.message,
        sender_email: data.sender_email,
        sender_name: data.sender_name,
        timestamp: data.timestamp
      };

      return [...prev, newMessage];
    });
  }, []);


  const handleDeleteConfirm = (messageId) =>{
    SetMessageId(messageId)
    setShowDeleteModal(true)
  }

  const handleDeleteMessage = (messageId) => {
    if (wsService) {
      const deleted = wsService.sendDeleteMessage(messageId);
      setShowDeleteModal(false)

      if (deleted) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        toast.success('Message deleted successfully')

      }else{
        toast.error('Message could not delete')
      }
    }
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    return () => {
      if (wsService) {
        wsService.disconnect();
      }
    };
  }, [wsService]);






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
                    className={`max-w-[70%] rounded-lg p-3 relative ${message.sender_email === user?.email
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                      }`}
                  >

                    {message.sender_email === user?.email && (
                      <button
                        onClick={() => handleDeleteConfirm(message.id)}
                        className="absolute right-0 top-0   opacity-100 transition-opacity duration-200 p-1.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-red-500"
                        title="Delete message"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}

                    <p>{message.content}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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


      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <ConfirmationModal
          title={'Delete Message'}
          message={'Are you sure you want to delete this message. This action cannot be undone'}       
          onConfirm={() => handleDeleteMessage(MessageId)}   
          onCancel={() => setShowDeleteModal(false)}
          />

        </Modal>
      )}




    </div>
  );
};

export default TutorChat;

