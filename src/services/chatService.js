import axiosInstance from "./interceptor"


export const createOrGetChatRoom = async(studentId,tutorId) => {
    try {
        const response = await axiosInstance.post('chat/api/chats/create_or_get_room/',{
            student_id:studentId,
            tutor_id :tutorId

        });
        return response.data;
        
    } catch (error) {
        console.error('Error creating/getting chat room:', error);

        
    }
}


export const fetchMessages = async (roomId) => {
    try {
        const response = await axiosInstance.get(`chat/api/chats/${roomId}/messages/`);
        return response.data;
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

}
export class WebSocketService {
  constructor(roomId, token) {
      this.socket = null;
      this.roomId = roomId;
      this.token = token || JSON.parse(localStorage.getItem('authTokens'))?.access;
      this.messageHandlers = null
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.isConnecting = false;
      
  }



    // Add this new method
    addMessageHandler(handler) {
        this.messageHandler = handler;
    }
  
    // Add this new method to remove handlers if needed
    removeMessageHandler(handler) {
        this.messageHandlers = null;
    }





  connect() {
      if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) return;
      this.isConnecting = true;

     const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NODE_ENV === 'development' ? '127.0.0.1:8000' : window.location.host;
      // Remove trailing slash from URL
      const wsUrl = `${wsProtocol}//${host}/ws/chat/${this.roomId}?token=${this.token}`;
      
      console.log('Attempting to connect to:', wsUrl);
      
      try {
          this.socket = new WebSocket(wsUrl);
          
          this.socket.onopen = () => {
              console.log('WebSocket connected successfully');
              this.isConnecting = false;
              this.reconnectAttempts = 0;
          };
          
          this.socket.onmessage = (event) => {
              try {
                  const data = JSON.parse(event.data);
                  if (this.messageHandler) {
                    this.messageHandler(data);
                }
              } catch (error) {
                  console.error('Error parsing message:', error);
              }
          };
          
          this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.isConnecting = false;
        };
          
          this.socket.onclose = (event) => {
              console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
              this.isConnecting = false;
              
              if (this.reconnectAttempts < this.maxReconnectAttempts) {
                  this.reconnectAttempts++;
                  const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
                  console.log(`Attempting to reconnect in ${delay}ms... Attempt ${this.reconnectAttempts}`);
                  setTimeout(() => this.connect(), delay);
              } else {
                  console.log('Maximum reconnection attempts reached');
              }
          };
      } catch (error) {
          console.error('Error creating WebSocket:', error);
          this.isConnecting = false;
      }
  }

  sendMessage(message) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
          console.error('WebSocket is not connected. Ready state:', this.socket?.readyState);
          return false;
      }

    try {
          const messageData = {
             type: 'send_message', 
              message: message,
              timestamp: new Date().toISOString()
          };
          console.log('Sending message:', messageData);
          this.socket.send(JSON.stringify(messageData));
          return true;
      } catch (error) {
          console.error('Error sending message:', error);
          return false;
      }


  }



  sendDeleteMessage(messageId) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not connected.');
        return false;
    }

    try {
        const deleteData = {
            type: 'delete_message',
            message_id: messageId,
            timestamp: new Date().toISOString()
        };
        this.socket.send(JSON.stringify(deleteData));
        return true;
    } catch (error) {
        console.error('Error sending delete message:', error);
        return false;
    }
}

  disconnect() {
      if (this.socket) {
          this.socket.close(1000, 'Normal closure');
          this.socket = null;
      }
  }
}