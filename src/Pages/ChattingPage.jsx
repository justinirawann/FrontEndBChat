import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useOutletContext, useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function ChattingPage() {
  const { currentUser } = useOutletContext();
  const location = useLocation();
  const { matchedUserId } = useParams();  // <-- ambil param matchedUserId dari URL
  const navigate = useNavigate();

  const [matchedUser, setMatchedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatList, setChatList] = useState([]); // untuk daftar user chat / matches
  const messagesEndRef = useRef(null);

  // Fungsi fetch data chat list (user yang pernah match/chat)
  const fetchChatList = async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/conversations?user_id=${currentUser.id}`);
      if (!res.ok) throw new Error('Failed to fetch chat list');
      const data = await res.json();
      setChatList(data);
    } catch (error) {
      console.error('Error fetching chat list:', error);
    }
  };

  // Fungsi fetch detail matched user berdasar matchedUserId param
  const fetchMatchedUserById = async (id) => {
    if (!currentUser?.id || !id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/matched-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_user_id: currentUser.id,
          matched_user_id: id,
        }),
      });
      if (!res.ok) throw new Error('Failed to fetch matched user');
      const data = await res.json();
      setMatchedUser(data.matchedUser);
      localStorage.setItem('matchedUser', JSON.stringify(data.matchedUser));
    } catch (error) {
      console.error('Error validating matched user:', error);
      setMatchedUser(null);
      localStorage.removeItem('matchedUser');
    }
  };

  // Ambil matchedUser berdasarkan param matchedUserId
  useEffect(() => {
    if (matchedUserId) {
      fetchMatchedUserById(matchedUserId);
    } else {
      // Kalau gak ada param, hapus matchedUser biar gak tampil chat room
      setMatchedUser(null);
      // Dan fetch chat list (list orang yg bisa diajak chat)
      fetchChatList();
    }
  }, [matchedUserId, currentUser]);

  // Scroll to bottom tiap ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch pesan chat antara currentUser dan matchedUser
  const fetchMessages = async () => {
    if (!currentUser?.id || !matchedUser?.id) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/chats?user1_id=${currentUser.id}&user2_id=${matchedUser.id}`
      );
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Fetch messages dan update berkala setiap 5 detik
  useEffect(() => {
    if (matchedUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [matchedUser]);

  // Kirim pesan baru
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!currentUser?.id || !matchedUser?.id) {
      alert('User information is missing!');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: currentUser.id,
          receiver_id: matchedUser.id,
          message: newMessage.trim(),
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!currentUser) {
    return <p>Loading user information...</p>;
  }

  // Kalau matchedUserId gak ada, berarti tampilkan list chat
  if (!matchedUserId) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        <h2>Your Chats</h2>
        {chatList.length === 0 && <p>You have no chats yet.</p>}
        <ul>
          {chatList.map((chat) => (
            <li
              key={chat.id}
              onClick={() => {
                // Navigate ke route /messages/:matchedUserId supaya chat room muncul
                navigate(`/messages/${chat.matchedUser.id}`);
              }}
              style={{
                cursor: 'pointer',
                padding: '10px',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src={
                  chat.matchedUser.photos && chat.matchedUser.photos.length > 0
                    ? `http://127.0.0.1:8000/storage/${chat.matchedUser.photos[0]}`
                    : '/default-avatar.png'
                }
                alt={chat.matchedUser.name}
                style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>{chat.matchedUser.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {chat.lastMessage || 'No messages yet.'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Kalau matchedUserId ada dan matchedUser sudah valid, tampilkan chat room
  if (!matchedUser) {
    return <p>Loading chat room...</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Chat with {matchedUser.name}</h2>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 10,
          height: 400,
          overflowY: 'auto',
          marginBottom: 20,
          background: '#f9f9f9',
        }}
      >
        {messages.length === 0 && <p>No messages yet. Say hi!</p>}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.sender_id === currentUser.id ? 'flex-end' : 'flex-start',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender_id === currentUser.id ? '#4caf50' : '#e0e0e0',
                color: msg.sender_id === currentUser.id ? 'white' : 'black',
                padding: '8px 12px',
                borderRadius: 20,
                maxWidth: '70%',
                wordBreak: 'break-word',
              }}
            >
              {msg.message}
              <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7, textAlign: 'right' }}>
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex' }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          style={{ flex: 1, padding: 10, borderRadius: 20, border: '1px solid #ccc' }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            marginLeft: 10,
            padding: '10px 20px',
            borderRadius: 20,
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
