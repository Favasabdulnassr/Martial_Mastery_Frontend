import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Send,
  Clock,
  ArrowLeft,
  Paperclip,
  User,
  UserCircle,
  Trash2
} from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import axiosInstance from '@/services/interceptor';
import { useSelector } from 'react-redux';
import { fetchMessages, WebSocketService, createOrGetChatRoom } from '@/services/chatService';
import { toast } from 'react-toastify';
import Modal from '@/Components/Modal/ModalPortal';
import ConfirmationModal from '@/Components/Modal/ChatDelete';


const StudentChat = () => {
  const { tutorId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [tutor, setTutor] = useState(null);
  const [wsService, setWsService] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [MessageId,SetMessageId] = useState(null)
  const { user } = useSelector((state) => state.login);
  const studentId = user?.id;


  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',studentId, tutorId);

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











  useEffect(() => {
    if (!user?.id || !tutorId || !studentId) {
      console.log('Missing required IDs:', { userId: user?.id, tutorId, studentId });
      return;
    }



    let mounted = true;


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
        console.log('ssssssssssssssssssssssssssssssss',room.id);
        


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
  }, [tutorId, studentId, user]);






  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



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






  useEffect(() => {
    return () => {
      if (wsService) {
        wsService.disconnect();
      }
    };
  }, [wsService]);






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
                  className={`max-w-[70%] p-4 rounded-2xl relative ${message.sender_email === user?.email
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black'
                      : 'bg-zinc-800 text-white'
                    }`}
                >


                  {message.sender_email === user?.email && (
                    <button
                    onClick={() => handleDeleteConfirm(message.id)}
                      className="absolute right-0 top-0   opacity-100 transition-opacity duration-200 p-1.5 rounded-full hover:bg-gray-700 text-gray-900 hover:text-red-500"
                      title="Delete message"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  <p>{message.content}</p>
                  <div className={`text-xs mt-2 ${message.sender_email === user?.email ? 'text-black/70' : 'text-zinc-400'
                    }`}>
                     {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                // onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-zinc-900 text-white rounded-full border border-zinc-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
              <button
                type='submit'
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 
                  text-black font-semibold rounded-full shadow-lg 
                  transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,236,255,0.3)]
                  flex items-center gap-2"
                disabled={!newMessage.trim()}

              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />


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

export default StudentChat;