import Peer from 'peerjs';

class RTCService {
  constructor() {
    this.peer = null;
    this.myPeerId = null;
    this.roomId = null;
    this.isHost = false;
    this.userInfo = { name: 'Guest', avatar: '🎬', isMuted: false, isCameraOff: false, isHandRaised: false };
    this.localStream = null;
    this.screenStream = null;
    
    this.dataConnections = new Map(); // peerId -> DataConnection
    this.mediaConnections = new Map(); // peerId -> MediaConnection
    this.remoteStreams = new Map(); // peerId -> Stream
    
    this.broadcastChannel = null;
    this.listeners = {
      onRemoteStream: [],
      onStreamRemoved: [],
      onDataMessage: [],
      onPeerJoined: [],
      onPeerLeft: [],
      onStatusChange: []
    };
  }

  // Initialize RTC Node / Room
  init(roomId, userInfo, isHost = false) {
    this.roomId = roomId;
    this.userInfo = { ...userInfo, isHost };
    this.isHost = isHost;

    // Set up BroadcastChannel for zero-latency same-browser / multi-tab synchronization
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel(`cinesync_${roomId}`);
      this.broadcastChannel.onmessage = (event) => {
        const { senderId, data } = event.data;
        if (senderId !== this.myPeerId) {
          this._handleIncomingData(data, senderId);
        }
      };
    }

    return new Promise((resolve, reject) => {
      // Clean peer ID for readability
      const peerIdPrefix = isHost ? `host-${roomId}` : `peer-${roomId}-${Math.random().toString(36).substring(2, 7)}`;
      
      this.peer = new Peer(peerIdPrefix, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
          ]
        }
      });

      this.peer.on('open', (id) => {
        this.myPeerId = id;
        this.notifyStatus('connected', { peerId: id });
        
        if (!isHost) {
          // Joiner connects to host
          const hostPeerId = `host-${roomId}`;
          this.connectToPeer(hostPeerId);
        }
        resolve(id);
      });

      this.peer.on('connection', (conn) => {
        this._setupDataConnection(conn);
      });

      this.peer.on('call', (call) => {
        // Answer incoming call with local stream (or fallback empty stream if camera muted)
        const streamToSend = this.localStream || this._createSilentAudioVideoStream();
        call.answer(streamToSend);
        
        call.on('stream', (remoteStream) => {
          this.remoteStreams.set(call.peer, remoteStream);
          this._emit('onRemoteStream', { peerId: call.peer, stream: remoteStream });
        });

        call.on('close', () => {
          this.remoteStreams.delete(call.peer);
          this._emit('onStreamRemoved', { peerId: call.peer });
        });

        this.mediaConnections.set(call.peer, call);
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS event notice:', err.type, err.message);
        this.notifyStatus('error', err);
        // If host ID was already taken, or peer failed, handle gracefully
        if (err.type === 'unavailable-id' && isHost) {
          // Continue as connected host if peer already registered
          resolve(peerIdPrefix);
        } else {
          resolve(peerIdPrefix);
        }
      });
    });
  }

  // Set Local Camera & Audio Stream
  setLocalStream(stream) {
    this.localStream = stream;
    // Update active media connections with new stream track if needed
    this.mediaConnections.forEach((call) => {
      if (call.peerConnection) {
        const senders = call.peerConnection.getSenders();
        stream.getTracks().forEach((track) => {
          const sender = senders.find(s => s.track && s.track.kind === track.kind);
          if (sender) {
            sender.replaceTrack(track);
          }
        });
      }
    });
  }

  // Connect to a peer (Data + Media)
  connectToPeer(targetPeerId) {
    if (targetPeerId === this.myPeerId || this.dataConnections.has(targetPeerId)) return;

    // 1. Data Connection
    const conn = this.peer.connect(targetPeerId, {
      metadata: { userInfo: this.userInfo }
    });
    this._setupDataConnection(conn);

    // 2. Media Call
    if (this.localStream) {
      const call = this.peer.call(targetPeerId, this.localStream);
      if (call) {
        call.on('stream', (remoteStream) => {
          this.remoteStreams.set(targetPeerId, remoteStream);
          this._emit('onRemoteStream', { peerId: targetPeerId, stream: remoteStream });
        });
        call.on('close', () => {
          this.remoteStreams.delete(targetPeerId);
          this._emit('onStreamRemoved', { peerId: targetPeerId });
        });
        this.mediaConnections.set(targetPeerId, call);
      }
    }
  }

  // Setup data connection handlers
  _setupDataConnection(conn) {
    conn.on('open', () => {
      this.dataConnections.set(conn.peer, conn);
      this._emit('onPeerJoined', { peerId: conn.peer, metadata: conn.metadata });

      // Send my user info
      conn.send({
        type: 'USER_INFO',
        userInfo: { ...this.userInfo, peerId: this.myPeerId }
      });

      // If host, request sync state send
      if (this.isHost) {
        this._emit('onDataMessage', {
          type: 'REQUEST_HOST_SYNC_STATE',
          targetPeerId: conn.peer
        }, conn.peer);
      }
    });

    conn.on('data', (data) => {
      this._handleIncomingData(data, conn.peer);
    });

    conn.on('close', () => {
      this.dataConnections.delete(conn.peer);
      this.mediaConnections.delete(conn.peer);
      this.remoteStreams.delete(conn.peer);
      this._emit('onPeerLeft', { peerId: conn.peer });
    });
  }

  _handleIncomingData(data, senderId) {
    this._emit('onDataMessage', data, senderId);
  }

  // Broadcast data payload to all connected peers & broadcast channel
  broadcast(data) {
    // 1. Send via PeerJS DataConnections
    this.dataConnections.forEach((conn) => {
      if (conn.open) {
        try {
          conn.send(data);
        } catch (e) {
          console.warn('Failed sending peer data:', e);
        }
      }
    });

    // 2. Send via BroadcastChannel for multi-tab testing
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          senderId: this.myPeerId,
          data
        });
      } catch (e) {
        console.warn('BroadcastChannel notice:', e);
      }
    }
  }

  // Update User Status (Mute, Camera, Hand Raise)
  updateUserInfo(updates) {
    this.userInfo = { ...this.userInfo, ...updates };
    this.broadcast({
      type: 'USER_UPDATE',
      peerId: this.myPeerId,
      userInfo: this.userInfo
    });
  }

  // Event Subscription
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  _emit(event, payload, senderId) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload, senderId));
    }
  }

  notifyStatus(status, details) {
    this._emit('onStatusChange', { status, details });
  }

  // Fallback empty audio/video stream if mic/cam unavailable
  _createSilentAudioVideoStream() {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 320, 240);

    const stream = canvas.captureStream(10);
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const dst = audioCtx.createMediaStreamDestination();
      osc.connect(dst);
      const audioTrack = dst.stream.getAudioTracks()[0];
      audioTrack.enabled = false;
      stream.addTrack(audioTrack);
    } catch (e) {
      console.warn('AudioContext stream notice:', e);
    }
    return stream;
  }

  // Destroy session
  destroy() {
    this.mediaConnections.forEach(call => call.close());
    this.dataConnections.forEach(conn => conn.close());
    if (this.peer) this.peer.destroy();
    if (this.broadcastChannel) this.broadcastChannel.close();
    if (this.localStream) {
      this.localStream.getTracks().forEach(t => t.stop());
    }
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(t => t.stop());
    }
    this.remoteStreams.clear();
  }
}

export const rtcService = new RTCService();
