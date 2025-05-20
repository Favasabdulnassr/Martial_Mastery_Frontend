import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
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
import { useTutorSidebar } from '@/Components/TutorSidebarProvider';

const TutorChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [wsService, setWsService] = useState(null);
  const { studentId } = useParams();
  const messagesEndRef = useRef(null);
  const [student, setStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [MessageId, SetMessageId] = useState(null);
  
  const { user } = useSelector((state) => state.login);
  const tutorId = user?.id;
  const { isSidebarTutorOpen } = useTutorSidebar();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
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
        toast.error('Message could not delete');
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
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar - Fixed position on large screens, hidden or overlay on mobile */}
      <div className={`fixed top-0 left-0 h-full w-72 lg:w-80 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 z-20 ${
        isSidebarTutorOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <TutorSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 lg:ml-80">
        {/* Topbar */}
        <TutorTopbar />

        {/* Chat content */}
        <div className="p-4 sm:p-6 h-[calc(100vh-64px)] flex flex-col">
          <div className="flex items-center mb-4 sm:mb-6">
            <button className="mr-4 p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Chat with Student</h1>
              <p className="text-sm sm:text-base text-gray-500">
                {student ? `${student.first_name} ` : 'Loading...'}
              </p>
            </div>
          </div>

          <Card className="flex-1 bg-white border-gray-200 overflow-hidden flex flex-col shadow-sm">
            <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {sortedDateKeys.map(dateKey => (
                <div key={dateKey} className="mb-4 sm:mb-6">
                  {/* Date Separator */}
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <div className="bg-gray-100 px-3 sm:px-4 py-1 rounded-full">
                      <span className="text-xs text-gray-500">{dateKey}</span>
                    </div>
                  </div>
                  
                  {/* Messages for this date */}
                  <div className="space-y-3 sm:space-y-4">
                    {groupedMessages[dateKey].map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_email === user.email ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 relative ${
                            message.sender_email === user?.email
                              ? 'bg-gray-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {message.sender_email === user?.email && (
                            <button
                              onClick={() => handleDeleteConfirm(message.id)}
                              className="absolute -right-1 -top-0.5 opacity-100 transition-opacity duration-200 p-1 sm:p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-red-500"
                              title="Delete message"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}

                          <p className="text-sm sm:text-base break-words">{message.content}</p>
                          <span className="text-xs opacity-75 mt-1 block">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-3 sm:p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2 sm:space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base text-white"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Send</span>
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

export default TutorChat