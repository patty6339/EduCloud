import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import websocketService from '../services/websocket';

export const useWebSocket = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      websocketService.connect();
    } else {
      websocketService.disconnect();
    }

    return () => {
      websocketService.disconnect();
    };
  }, [isAuthenticated]);

  return websocketService;
};

export const useChatRoom = (roomId) => {
  const websocket = useWebSocket();

  useEffect(() => {
    if (roomId) {
      websocket.joinChatRoom(roomId);
      return () => {
        websocket.leaveChatRoom(roomId);
      };
    }
  }, [roomId, websocket]);

  return {
    sendMessage: (message) => websocket.sendMessage(roomId, message),
  };
};

export const useLiveClass = (classId) => {
  const websocket = useWebSocket();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (classId) {
      websocket.joinLiveClass(classId);
      return () => {
        websocket.leaveLiveClass(classId);
      };
    }
  }, [classId, websocket]);

  return {
    startClass: () => {
      if (user?.role === 'teacher') {
        websocket.startLiveClass(classId);
      }
    },
    endClass: () => {
      if (user?.role === 'teacher') {
        websocket.endLiveClass(classId);
      }
    },
  };
};
