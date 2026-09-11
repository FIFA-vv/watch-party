import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import LobbyModal from './components/LobbyModal';
import VideoPlayer from './components/VideoPlayer';
import VideoGrid from './components/VideoGrid';
import CallControls from './components/CallControls';
import ChatSidebar from './components/ChatSidebar';
import ParticipantList from './components/ParticipantList';
import InviteModal from './components/InviteModal';
import SessionRecorder from './components/SessionRecorder';
import ReactionsOverlay from './components/ReactionsOverlay';

import { rtcService } from './services/rtcService';

export default function App() {
  // Room & User State
  const [roomId, setRoomId] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: 'Guest', avatar: '🎬', isMuted: false, isCameraOff: false, isHandRaised: false });
  const [myPeerId, setMyPeerId] = useState(null);

  // Streams
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map()); // peerId -> { stream, userInfo }
  const [participants, setParticipants] = useState([]);

  // Modals & Panels
  const [showLobby, setShowLobby] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  // Real-Time Messaging & Sync
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [videoSyncAction, setVideoSyncAction] = useState(null);
  const [reactionEvent, setReactionEvent] = useState(null);

  // Session Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Read ?room= param from URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlRoomId = urlParams.get('room');

  // Join Room Handler
  const handleJoinRoom = async ({ roomId: selectedRoomId, userInfo: user, isHost: hostFlag, stream }) => {
    setRoomId(selectedRoomId);
    setIsHost(hostFlag);
    setUserInfo({ ...user, isHost: hostFlag });
    setShowLobby(false);

    if (stream) {
      setLocalStream(stream);
      rtcService.setLocalStream(stream);
    }

    try {
      const peerId = await rtcService.init(selectedRoomId, user, hostFlag);
      setMyPeerId(peerId);

      // Add self to participant list
      const selfParticipant = {
        id: peerId,
        ...user,
        isHost: hostFlag
      };
      setParticipants([selfParticipant]);

      // Add system message
      addSystemMessage(`Welcome to watch party room "${selectedRoomId}"!`);
    } catch (err) {
      console.warn('RTC Init Warning:', err);
    }
  };

  // Set up RTC Service Event Listeners
  useEffect(() => {
    if (!roomId) return;

    // 1. Remote Stream Received
    const handleRemoteStream = ({ peerId, stream }) => {
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        const existing = next.get(peerId) || {};
        next.set(peerId, { ...existing, stream });
        return next;
      });
    };

    // 2. Remote Stream Removed
    const handleStreamRemoved = ({ peerId }) => {
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        next.delete(peerId);
        return next;
      });
    };

    // 3. Peer Joined
    const handlePeerJoined = ({ peerId, metadata }) => {
      const peerUser = metadata?.userInfo || { name: 'Friend', avatar: '🍿', isHost: false };
      setParticipants((prev) => {
        if (prev.some(p => p.id === peerId)) return prev;
        return [...prev, { id: peerId, ...peerUser }];
      });
      addSystemMessage(`${peerUser.name || 'A friend'} joined the party! 🎉`);
    };

    // 4. Peer Left
    const handlePeerLeft = ({ peerId }) => {
      setParticipants((prev) => {
        const target = prev.find(p => p.id === peerId);
        if (target) addSystemMessage(`${target.name} left the room.`);
        return prev.filter(p => p.id !== peerId);
      });
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        next.delete(peerId);
        return next;
      });
    };

    // 5. Data Message Handler
    const handleDataMessage = (data, senderId) => {
      if (data.type === 'VIDEO_ACTION') {
        setVideoSyncAction(data);
      } else if (data.type === 'CHAT_MESSAGE') {
        setMessages(prev => [...prev, data.message]);
        if (!showChat) setUnreadCount(prev => prev + 1);
      } else if (data.type === 'USER_UPDATE') {
        setParticipants(prev => prev.map(p => p.id === data.peerId ? { ...p, ...data.userInfo } : p));
        setRemoteStreams(prev => {
          const next = new Map(prev);
          if (next.has(data.peerId)) {
            next.set(data.peerId, { ...next.get(data.peerId), userInfo: data.userInfo });
          }
          return next;
        });
      } else if (data.type === 'REACTION') {
        setReactionEvent({ emoji: data.emoji, senderName: data.senderName, id: Date.now() });
      } else if (data.type === 'REQUEST_HOST_SYNC_STATE' && isHost && videoSyncAction) {
        // Host broadcasts current video state to newly connected peer
        rtcService.broadcast(videoSyncAction);
      }
    };

    rtcService.on('onRemoteStream', handleRemoteStream);
    rtcService.on('onStreamRemoved', handleStreamRemoved);
    rtcService.on('onPeerJoined', handlePeerJoined);
    rtcService.on('onPeerLeft', handlePeerLeft);
    rtcService.on('onDataMessage', handleDataMessage);

    return () => {
      rtcService.off('onRemoteStream', handleRemoteStream);
      rtcService.off('onStreamRemoved', handleStreamRemoved);
      rtcService.off('onPeerJoined', handlePeerJoined);
      rtcService.off('onPeerLeft', handlePeerLeft);
      rtcService.off('onDataMessage', handleDataMessage);
    };
  }, [roomId, isHost, showChat, videoSyncAction]);

  const addSystemMessage = (text) => {
    setMessages(prev => [
      ...prev,
      { isSystem: true, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  };

  // Video Action Dispatcher (From Player)
  const handleSendVideoAction = (action) => {
    setVideoSyncAction(action);
    rtcService.broadcast({
      type: 'VIDEO_ACTION',
      ...action
    });
  };

  // Chat Message Dispatcher
  const handleSendMessage = (text) => {
    const msgObj = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: myPeerId,
      senderName: userInfo.name,
      avatar: userInfo.avatar,
      isHost,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, msgObj]);

    rtcService.broadcast({
      type: 'CHAT_MESSAGE',
      message: msgObj
    });
  };

  // Quick Emoji Reaction Trigger
  const handleTriggerReaction = (emoji) => {
    setReactionEvent({ emoji, senderName: userInfo.name, id: Date.now() });
    rtcService.broadcast({
      type: 'REACTION',
      emoji,
      senderName: userInfo.name
    });
  };

  // Controls Handlers
  const handleToggleMic = () => {
    const nextMuted = !userInfo.isMuted;
    const nextUser = { ...userInfo, isMuted: nextMuted };
    setUserInfo(nextUser);

    if (localStream) {
      localStream.getAudioTracks().forEach(t => (t.enabled = !nextMuted));
    }
    rtcService.updateUserInfo(nextUser);
  };

  const handleToggleCamera = () => {
    const nextCamOff = !userInfo.isCameraOff;
    const nextUser = { ...userInfo, isCameraOff: nextCamOff };
    setUserInfo(nextUser);

    if (localStream) {
      localStream.getVideoTracks().forEach(t => (t.enabled = !nextCamOff));
    }
    rtcService.updateUserInfo(nextUser);
  };

  const handleToggleHand = () => {
    const nextHand = !userInfo.isHandRaised;
    const nextUser = { ...userInfo, isHandRaised: nextHand };
    setUserInfo(nextUser);
    rtcService.updateUserInfo(nextUser);
  };

  const handleToggleScreenShare = async () => {
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        setScreenStream(stream);

        stream.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
        };
      } catch (err) {
        console.warn('Screen share cancelled:', err);
      }
    }
  };

  // Session Recording Handlers
  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop Recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start Recording
      try {
        const streamToRecord = screenStream || localStream;
        if (!streamToRecord) {
          alert('Please enable camera or share screen to record session.');
          return;
        }

        recordedChunksRef.current = [];
        const recorder = new MediaRecorder(streamToRecord, { mimeType: 'video/webm;codecs=vp8,opus' });

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          setRecordedBlob(blob);
        };

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (err) {
        console.error('Recording error:', err);
        alert('Recording feature requires browser screen or camera permission.');
      }
    }
  };

  const handleLeaveCall = () => {
    if (window.confirm('Are you sure you want to leave the watch party?')) {
      rtcService.destroy();
      window.location.href = window.location.pathname;
    }
  };

  const handleKickUser = (peerIdToKick) => {
    rtcService.broadcast({
      type: 'KICK_USER',
      targetPeerId: peerIdToKick
    });
    setParticipants(prev => prev.filter(p => p.id !== peerIdToKick));
  };

  return (
    <div className="app-root-container">
      {/* Top Navbar Header */}
      <Navbar
        roomId={roomId}
        isHost={isHost}
        participantCount={participants.length}
        onOpenInvite={() => setShowInvite(true)}
        onLeaveCall={handleLeaveCall}
        onToggleParticipants={() => setShowParticipants(!showParticipants)}
        isRecording={isRecording}
      />

      {/* Main Content Area */}
      <main className="app-main-layout">
        {!roomId ? (
          <LobbyModal onJoinRoom={handleJoinRoom} defaultRoomId={urlRoomId} />
        ) : (
          <div className="party-content-grid">
            {/* Left Column: Synchronized Video Player */}
            <div className="player-column">
              <VideoPlayer
                isHost={isHost}
                syncAction={videoSyncAction}
                onSendVideoAction={handleSendVideoAction}
                onHostStateRequest={() => {
                  rtcService.broadcast({ type: 'REQUEST_HOST_SYNC_STATE' });
                }}
                hostInfo={participants.find(p => p.isHost)}
              />
            </div>

            {/* Right Column: WebRTC Video Call Grid */}
            <div className="call-grid-column">
              <div className="column-header">
                <h3>Live Call ({participants.length})</h3>
              </div>
              <VideoGrid
                localStream={localStream}
                localUserInfo={userInfo}
                remoteStreams={remoteStreams}
                screenStream={screenStream}
                isHost={isHost}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Call Controls Toolbar */}
      {roomId && (
        <CallControls
          isMuted={userInfo.isMuted}
          isCameraOff={userInfo.isCameraOff}
          isScreenSharing={!!screenStream}
          isRecording={isRecording}
          isHandRaised={userInfo.isHandRaised}
          unreadCount={unreadCount}
          onToggleMic={handleToggleMic}
          onToggleCamera={handleToggleCamera}
          onToggleScreenShare={handleToggleScreenShare}
          onToggleRecording={handleToggleRecording}
          onToggleHand={handleToggleHand}
          onToggleChat={() => {
            setShowChat(!showChat);
            setUnreadCount(0);
          }}
          onLeaveCall={handleLeaveCall}
          onTriggerReaction={handleTriggerReaction}
        />
      )}

      {/* Chat Sidebar Panel */}
      {showChat && (
        <ChatSidebar
          messages={messages}
          onSendMessage={handleSendMessage}
          onClose={() => setShowChat(false)}
          currentUserId={myPeerId}
        />
      )}

      {/* Participants Drawer Panel */}
      {showParticipants && (
        <ParticipantList
          participants={participants}
          currentUserId={myPeerId}
          isHost={isHost}
          onKickUser={handleKickUser}
          onClose={() => setShowParticipants(false)}
        />
      )}

      {/* Invite Friends Modal */}
      {showInvite && (
        <InviteModal
          roomId={roomId}
          onClose={() => setShowInvite(false)}
        />
      )}

      {/* Session Recorder Component */}
      <SessionRecorder
        isRecording={isRecording}
        onStopRecording={handleToggleRecording}
        recordedBlob={recordedBlob}
        onClearBlob={() => setRecordedBlob(null)}
      />

      {/* Floating Emoji Burst Overlay */}
      <ReactionsOverlay reactionEvent={reactionEvent} />

      <style>{`
        .app-root-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .app-main-layout {
          flex: 1;
          padding: 24px;
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
        }
        .party-content-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: start;
          padding-bottom: 90px;
        }
        .player-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .call-grid-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-lg);
          padding: 16px;
        }
        .column-header h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        @media (max-width: 1024px) {
          .party-content-grid {
            grid-template-columns: 1fr;
          }
          .app-main-layout {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}
