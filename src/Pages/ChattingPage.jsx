import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function ChattingPage() {
  const { currentUser } = useOutletContext();
  const { matchedUserId } = useParams();
  const navigate = useNavigate();

  const [matchedUser, setMatchedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatList, setChatList] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState(null); // ⬅️ Zoom modal state

  const messagesEndRef = useRef(null);

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
      console.log('Matched User Data:', data.matchedUser);
      setMatchedUser(data.matchedUser);
      localStorage.setItem('matchedUser', JSON.stringify(data.matchedUser));
    } catch (error) {
      console.error('Error validating matched user:', error);
      setMatchedUser(null);
      localStorage.removeItem('matchedUser');
    }
  };

  useEffect(() => {
    if (matchedUserId) {
      fetchMatchedUserById(matchedUserId);
    } else {
      setMatchedUser(null);
      fetchChatList();
    }
  }, [matchedUserId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  useEffect(() => {
    if (matchedUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [matchedUser]);

  const photosArray = Array.isArray(matchedUser?.photos)
    ? matchedUser.photos
    : matchedUser?.photos
    ? JSON.parse(matchedUser.photos)
    : [];

  function calculateAge(birthday) {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function InfoRow({ label, value }) {
    return (
      <div className="flex items-start gap-2">
        <span className="font-semibold w-28">{label}:</span>
        <span>{value}</span>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!currentUser?.id || !matchedUser?.id) return alert('User missing');

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

  if (!currentUser) return <p className="text-center mt-10">Loading user info...</p>;

  if (!matchedUserId) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
        {chatList.length === 0 && <p className="text-gray-500">You have no chats yet.</p>}
        <ul>
          {chatList.map((chat) => (
            <li
              key={chat.id}
              onClick={() => navigate(`/messages/${chat.matchedUser.id}`)}
              className="flex items-center gap-4 p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 rounded-lg"
            >
              <img
                src={
                  chat.matchedUser.photos && chat.matchedUser.photos.length > 0
                    ? `http://127.0.0.1:8000/storage/${chat.matchedUser.photos[0]}`
                    : '/default-avatar.png'
                }
                alt={chat.matchedUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{chat.matchedUser.name}</p>
                <p className="text-sm text-gray-500">
                  {chat.lastMessage || 'No messages yet.'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!matchedUser) return <p className="text-center mt-10">Loading chat room...</p>;

  return (
    <div className="w-full h-screen flex flex-col px-4 py-6">
      <div
        onClick={() => setShowInfo(true)}
        className="flex items-center space-x-4 mb-4 p-4 rounded-xl bg-white shadow-md cursor-pointer hover:bg-gray-50"
      >
        <img
          src={
            photosArray.length > 0
              ? `http://127.0.0.1:8000/storage/${photosArray[0]}`
              : '/default-avatar.png'
          }
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold">{matchedUser.name}</h2>
          <p className="text-sm text-gray-500">You're now connected 💬</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-100 rounded-xl p-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-gray-500">No messages yet. Say hi!</p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-2xl px-4 py-2 max-w-xs break-words text-sm shadow-sm
                ${msg.sender_id === currentUser.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {msg.message}
              <div className="text-[10px] text-right text-gray-400 mt-1">
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendMessage}
          className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none"
        >
          <FaPaperPlane size={16} />
        </motion.button>
      </div>

      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>

            {/* Galeri foto */}
            <div className="flex gap-2 overflow-x-auto mb-4">
              {photosArray.length > 0 ? (
                photosArray.map((photo, index) => (
                  <img
                    key={index}
                    src={`http://127.0.0.1:8000/storage/${photo}`}
                    alt={`Photo ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-xl cursor-pointer"
                    onClick={() =>{
                      setShowInfo(false);
                      setZoomedPhoto(`http://127.0.0.1:8000/storage/${photo}`)
                    }}
                  />
                ))
              ) : (
                <img
                  src="/default-avatar.png"
                  alt="Default"
                  className="w-24 h-24 object-cover rounded-xl mx-auto"
                />
              )}
            </div>

            <h3 className="text-xl font-semibold text-center">{matchedUser.name}</h3>
            <p className="text-sm text-center text-gray-600 mb-2">{matchedUser.campus}</p>

            <div className="text-sm text-gray-700 space-y-1">
              <InfoRow label="🎂 Age" value={calculateAge(matchedUser.birthdate) || "-"} />
              <InfoRow label="🎓 Faculty" value={matchedUser.faculty?.name || "-"} />
              <InfoRow label="📘 Major" value={matchedUser.major?.name || "-"} />
              <InfoRow label="📝 Bio" value={matchedUser.description || "No bio provided."} />
            </div>
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {zoomedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center overflow-y-auto">
          {/* Close button tetap di atas layar */}
          <button
            onClick={() => {
              setZoomedPhoto(null);
              setShowInfo(true);
            }}
            className="fixed top-4 right-6 text-white text-4xl font-bold z-[61] hover:text-red-400"
          >
            &times;
          </button>

          <div className="max-w-3xl w-full px-4 py-10 flex justify-center items-center">
            <img
              src={zoomedPhoto}
              alt="Zoomed"
              className="w-auto max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
