class WebRTCService {
  constructor() {
    this.peerConnections = new Map();
    this.localStream = null;
    this.onTrack = null;
    this.onParticipantLeft = null;
  }

  async initializeStream(videoEnabled = true, audioEnabled = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled,
      });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  async initializeScreenShare() {
    try {
      this.localStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      return this.localStream;
    } catch (error) {
      console.error('Error sharing screen:', error);
      throw error;
    }
  }

  async createPeerConnection(participantId, websocket) {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:your-turn-server.com:3478',
          username: 'username',
          credential: 'password',
        },
      ],
    };

    const peerConnection = new RTCPeerConnection(configuration);

    // Add local stream tracks to peer connection
    this.localStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, this.localStream);
    });

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        websocket.emit('webrtc:ice_candidate', {
          candidate: event.candidate,
          participantId,
        });
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'disconnected') {
        this.handleParticipantDisconnected(participantId);
      }
    };

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      if (this.onTrack) {
        this.onTrack(participantId, event.streams[0]);
      }
    };

    this.peerConnections.set(participantId, peerConnection);
    return peerConnection;
  }

  async handleOffer(participantId, offer, websocket) {
    const peerConnection = await this.createPeerConnection(participantId, websocket);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    websocket.emit('webrtc:answer', {
      answer,
      participantId,
    });
  }

  async handleAnswer(participantId, answer) {
    const peerConnection = this.peerConnections.get(participantId);
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async handleIceCandidate(participantId, candidate) {
    const peerConnection = this.peerConnections.get(participantId);
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  async initiateCall(participantId, websocket) {
    const peerConnection = await this.createPeerConnection(participantId, websocket);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    websocket.emit('webrtc:offer', {
      offer,
      participantId,
    });
  }

  handleParticipantDisconnected(participantId) {
    const peerConnection = this.peerConnections.get(participantId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(participantId);
    }

    if (this.onParticipantLeft) {
      this.onParticipantLeft(participantId);
    }
  }

  async toggleAudio(enabled) {
    this.localStream?.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  async toggleVideo(enabled) {
    this.localStream?.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  async switchToScreenShare() {
    try {
      const screenStream = await this.initializeScreenShare();
      const [videoTrack] = screenStream.getVideoTracks();

      // Replace video track in all peer connections
      this.peerConnections.forEach((peerConnection) => {
        const sender = peerConnection
          .getSenders()
          .find((s) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      // Handle screen share stop
      videoTrack.onended = () => {
        this.switchToCamera();
      };

      return screenStream;
    } catch (error) {
      console.error('Error switching to screen share:', error);
      throw error;
    }
  }

  async switchToCamera() {
    try {
      const cameraStream = await this.initializeStream();
      const [videoTrack] = cameraStream.getVideoTracks();

      // Replace video track in all peer connections
      this.peerConnections.forEach((peerConnection) => {
        const sender = peerConnection
          .getSenders()
          .find((s) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      return cameraStream;
    } catch (error) {
      console.error('Error switching to camera:', error);
      throw error;
    }
  }

  cleanup() {
    // Stop all tracks
    this.localStream?.getTracks().forEach((track) => track.stop());

    // Close all peer connections
    this.peerConnections.forEach((peerConnection) => {
      peerConnection.close();
    });
    this.peerConnections.clear();

    this.localStream = null;
  }
}

const webRTCService = new WebRTCService();
export default webRTCService;
