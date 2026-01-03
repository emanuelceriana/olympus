import { useState, useEffect } from "react";
import socket from "../socket";
import "./Lobby.css";

export default function Lobby({ onGameStart }) {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(null);
  const [error, setError] = useState(null);

  // Fetch rooms on mount and when updated
  useEffect(() => {
    // Connect socket if not connected
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("get-rooms");

    socket.on("rooms-list", ({ rooms }) => {
      setRooms(rooms);
    });

    socket.on("rooms-updated", () => {
      socket.emit("get-rooms");
    });

    socket.on("room-created", ({ roomId, roomName }) => {
      setWaitingRoom({ id: roomId, name: roomName });
      setIsCreating(false);
    });

    socket.on("room-error", ({ message }) => {
      setError(message);
      setTimeout(() => setError(null), 3000);
    });

    socket.on("room-closed", () => {
      setWaitingRoom(null);
    });

    socket.on("game-start", (data) => {
      onGameStart(data);
    });

    return () => {
      socket.off("rooms-list");
      socket.off("rooms-updated");
      socket.off("room-created");
      socket.off("room-error");
      socket.off("room-closed");
      socket.off("game-start");
    };
  }, [onGameStart]);

  const handleCreateRoom = () => {
    socket.emit("create-room", { roomName: roomName || undefined });
    setRoomName("");
  };

  const handleJoinRoom = (roomId) => {
    socket.emit("join-room", { roomId });
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room");
    setWaitingRoom(null);
  };

  // Waiting screen when in a room
  if (waitingRoom) {
    return (
      <div className="lobby">
        <div className="lobby-container">
          <div className="waiting-room">
            <div className="waiting-icon">⏳</div>
            <h2>Waiting for Opponent</h2>
            <p className="room-code">Room: <strong>{waitingRoom.name}</strong></p>
            <p className="room-id">Code: {waitingRoom.id}</p>
            <div className="loader"></div>
            <button className="btn-secondary" onClick={handleLeaveRoom}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lobby">
      <div className="lobby-container">
        <div className="lobby-header">
          <h1>⚡ OLYMPUS</h1>
          <p className="subtitle">Battle of the Gods</p>
        </div>

        {error && <div className="error-toast">{error}</div>}

        <div className="create-room-section">
          <h3>Create New Room</h3>
          <div className="create-form">
            <input
              type="text"
              placeholder="Room name (optional)"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              maxLength={20}
            />
            <button 
              className="btn-primary" 
              onClick={handleCreateRoom}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Room"}
            </button>
          </div>
        </div>

        <div className="rooms-section">
          <h3>Available Rooms</h3>
          <div className="rooms-list">
            {rooms.length === 0 ? (
              <div className="no-rooms">
                <p>No rooms available</p>
                <p className="hint">Create a room and invite a friend!</p>
              </div>
            ) : (
              rooms.filter(r => r.playerCount < 2).map((room) => (
                <div key={room.id} className="room-card">
                  <div className="room-info">
                    <span className="room-name">{room.name}</span>
                    <span className="room-players">
                      <span className="player-dot active"></span>
                      {room.playerCount}/2
                    </span>
                  </div>
                  <button 
                    className="btn-join"
                    onClick={() => handleJoinRoom(room.id)}
                  >
                    Join
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="lobby-footer">
           <p>Based on the game <strong>Hanamikoji</strong> by Kota Nakayama</p>
        </div>
      </div>
    </div>
  );
}
