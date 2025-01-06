import { io } from 'socket.io-client';
import store from '../store';
import { addMessage, updateOnlineUsers } from '../store/slices/chatSlice';
import { updateLiveClassStatus } from '../store/slices/liveClassSlice';
import { showNotification } from '../store/slices/uiSlice';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.isConnected) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    this.socket = io(process.env.REACT_APP_SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
    this.isConnected = true;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  setupEventListeners() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      store.dispatch(
        showNotification({
          message: 'Connected to real-time server',
          type: 'success',
        })
      );
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      store.dispatch(
        showNotification({
          message: 'Disconnected from real-time server',
          type: 'error',
        })
      );
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      store.dispatch(
        showNotification({
          message: 'Connection error',
          type: 'error',
        })
      );
    });

    // Chat events
    this.socket.on('chat:message', (message) => {
      store.dispatch(addMessage(message));
    });

    this.socket.on('chat:online_users', (users) => {
      store.dispatch(updateOnlineUsers(users));
    });

    // Live class events
    this.socket.on('live_class:status', (status) => {
      store.dispatch(updateLiveClassStatus(status));
    });

    this.socket.on('live_class:joined', (user) => {
      store.dispatch(
        showNotification({
          message: `${user.name} joined the class`,
          type: 'info',
        })
      );
    });

    this.socket.on('live_class:left', (user) => {
      store.dispatch(
        showNotification({
          message: `${user.name} left the class`,
          type: 'info',
        })
      );
    });

    // Notification events
    this.socket.on('notification', (notification) => {
      store.dispatch(showNotification(notification));
    });
  }

  // Chat methods
  joinChatRoom(roomId) {
    if (this.socket) {
      this.socket.emit('chat:join', { roomId });
    }
  }

  leaveChatRoom(roomId) {
    if (this.socket) {
      this.socket.emit('chat:leave', { roomId });
    }
  }

  sendMessage(roomId, message) {
    if (this.socket) {
      this.socket.emit('chat:message', { roomId, message });
    }
  }

  // Live class methods
  joinLiveClass(classId) {
    if (this.socket) {
      this.socket.emit('live_class:join', { classId });
    }
  }

  leaveLiveClass(classId) {
    if (this.socket) {
      this.socket.emit('live_class:leave', { classId });
    }
  }

  startLiveClass(classId) {
    if (this.socket) {
      this.socket.emit('live_class:start', { classId });
    }
  }

  endLiveClass(classId) {
    if (this.socket) {
      this.socket.emit('live_class:end', { classId });
    }
  }

  // Presence methods
  updatePresence(status) {
    if (this.socket) {
      this.socket.emit('presence', { status });
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;
