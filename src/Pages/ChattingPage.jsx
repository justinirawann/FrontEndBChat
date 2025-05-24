import React, { useEffect, useState, useRef } from 'react';

export default function ChattingPage({ currentUser, matchedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fungsi untuk scroll otomatis ke pesan terbaru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch chat messages antara currentUser dan matchedUser
  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `/api/chat/messages?user1_id=${currentUser.id}&user2_id=${matchedUser.id}`
      );
      const data = await res.json();
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (currentUser && matchedUser) {
      fetchMessages();
      
      // Optional: polling tiap 5 detik biar chat realtime sederhana
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser, matchedUser]);

  // Kirim pesan baru
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: currentUser.id,
          receiver_id: matchedUser.id,
          message: newMessage.trim(),
        }),
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!matchedUser) {
    return <p>You have no matches to chat with yet.</p>;
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
              justifyContent:
                msg.sender_id === currentUser.id ? 'flex-end' : 'flex-start',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                backgroundColor:
                  msg.sender_id === currentUser.id ? '#4caf50' : '#e0e0e0',
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
