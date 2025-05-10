import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Send,
  Clock,
  ArrowLeft,
  Paperclip,
  User,
  UserCircle,
  Trash2,
  Menu,
  X
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
  const [MessageId, SetMessageId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.login);
  const studentId = user?.id;
  const messageInputRef = useRef(null);

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        setLoading(true);
        const tutorResponse = await axiosInstance.get(`chat/tutor/${tutorId}/`);
        setTutor(tutorResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch tutor data');
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
          toast.error('Authentication failed');
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
        toast.error('Failed to initialize chat');
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
        // Focus back on input after sending
        messageInputRef.current?.focus();
      } else {
        console.error('Failed to send message');
        toast.error('Failed to send message');
      }
    }
  };

  const handleDeleteConfirm = (messageId) => {
    SetMessageId(messageId);
    setShowDeleteModal(true);
  };

  const handleDeleteMessage = (messageId) => {
    if (wsService) {
      const deleted = wsService.sendDeleteMessage(messageId);
      setShowDeleteModal(false);
      if (deleted) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        toast.success('Message deleted successfully');
      } else {
        toast.error('Message could not be deleted');
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

  // Function to group messages by date
  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};
    
    // Get today and yesterday dates for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp);
      messageDate.setHours(0, 0, 0, 0);
      
      let dateKey;
      
      if (messageDate.getTime() === today.getTime()) {
        dateKey = 'Today';
      } else if (messageDate.getTime() === yesterday.getTime()) {
        dateKey = 'Yesterday';
      } else {
        // Format date as DD/MM/YYYY for older messages
        dateKey = messageDate.toLocaleDateString('en-GB');
      }
      
      if (!groupedMessages[dateKey]) {
        groupedMessages[dateKey] = [];
      }
      
      groupedMessages[dateKey].push(message);
    });
    
    return groupedMessages;
  };

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);
  
  // Sort date keys to ensure chronological order
  const sortedDateKeys = Object.keys(groupedMessages).sort((a, b) => {
    if (a === 'Today') return 1;
    if (b === 'Today') return -1;
    if (a === 'Yesterday') return 1;
    if (b === 'Yesterday') return -1;
    
    // Convert other dates from DD/MM/YYYY to Date objects for comparison
    const [dayA, monthA, yearA] = a.split('/').map(Number);
    const [dayB, monthB, yearB] = b.split('/').map(Number);
    
    return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
  });

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Mobile header - only visible on small screens */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black">
        <div className="flex justify-between items-center p-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg font-bold text-white">{tutor?.first_name || 'Chat'}</h1>
          <div className="w-6"></div> {/* Empty div for alignment */}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-40 pt-16">
          <Header />
          <button 
            className="absolute top-4 right-4 text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Regular header - visible on medium screens and up */}
      <div className="hidden md:block h-20">
        <Header />
      </div>

      <main className="flex-1 container mx-auto px-2 md:px-4 py-4 md:py-8 mt-16 md:mt-0">
        <div className="max-w-4xl mx-auto bg-zinc-900 rounded-lg md:rounded-2xl shadow-xl border border-cyan-900/20 overflow-hidden">
          {/* Chat Header */}
          <div className="p-3 md:p-6 bg-gradient-to-r from-cyan-500 to-cyan-400">
            <div className="flex items-center gap-2 md:gap-4">
              <UserCircle className="w-8 h-8 md:w-12 md:h-12 text-black" />
              <div>
                <h2 className="text-lg md:text-2xl font-bold text-black">Tutor {tutor?.first_name}</h2>
                <div className="flex items-center gap-2 text-black/80 text-sm md:text-base">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container - adjust height based on screen size */}
          <div className="h-[calc(100vh-13rem)] md:h-[60vh] overflow-y-auto p-3 md:p-6 space-y-2 md:space-y-4">
            {sortedDateKeys.map(dateKey => (
              <div key={dateKey} className="mb-4 md:mb-6">
                {/* Date Separator */}
                <div className="flex items-center justify-center mb-2 md:mb-4">
                  <div className="bg-zinc-800 px-3 py-1 rounded-full">
                    <span className="text-xs text-zinc-400">{dateKey}</span>
                  </div>
                </div>
                
                {/* Messages for this date */}
                <div className="space-y-2 md:space-y-4">
                  {groupedMessages[dateKey].map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_email === user?.email ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-xl md:rounded-2xl relative ${
                          message.sender_email === user?.email
                            ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black'
                            : 'bg-zinc-800 text-white'
                        }`}
                      >
                        {message.sender_email === user?.email && (
                          <button
                            onClick={() => handleDeleteConfirm(message.id)}
                            className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200 p-1 md:p-1.5 rounded-full hover:bg-gray-700 text-gray-900 hover:text-red-500"
                            title="Delete message"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        <p className="text-sm md:text-base break-words">{message.content}</p>
                        <div className={`text-xs mt-1 md:mt-2 ${message.sender_email === user?.email ? 'text-black/70' : 'text-zinc-400'}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 p-3 md:p-4 rounded-xl md:rounded-2xl">
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

          {/* Message Input - fixed at bottom on mobile */}
          <div className="p-3 md:p-6 bg-zinc-800 border-t border-zinc-700">
            <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                ref={messageInputRef}
                placeholder="Type your message..."
                className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-zinc-900 text-white text-sm md:text-base rounded-full border border-zinc-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
              <button
                type='submit'
                className="px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 
                  text-black font-semibold rounded-full shadow-lg 
                  transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,236,255,0.3)]
                  flex items-center gap-1 md:gap-2 text-sm md:text-base"
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile footer - simplified version */}
      <div className="md:hidden py-4 px-4 bg-zinc-900 border-t border-zinc-800 mt-auto">
        <p className="text-center text-xs text-zinc-500">© 2025 TutorChat. All rights reserved.</p>
      </div>

      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <ConfirmationModal
            title={'Delete Message'}
            message={'Are you sure you want to delete this message? This action cannot be undone.'}       
            onConfirm={() => handleDeleteMessage(MessageId)}   
            onCancel={() => setShowDeleteModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default StudentChat;