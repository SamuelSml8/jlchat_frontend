import React, { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000");
const img_default =
  "https://es.vecteezy.com/arte-vectorial/9734564-predeterminado-avatar-perfil-icono-de-usuario-de-redes-sociales";

const MessageArea = ({ chat, userId, messages = [], onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(messages);
  const [chatDetails, setChatDetails] = useState({
    name: "Loading...",
    profilePicture: img_default,
  });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  const getChatDetails = async (chat) => {
    try {
      if (!chat.isGroup) {
        const otherMemberId = chat.members.find(
          (memberId) => memberId._id !== userId
        );
        const response = await axios.get(
          `http://localhost:3000/users/${otherMemberId._id}`,
          {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          }
        );
        const userData = response.data.data;
        setChatDetails({
          name: userData.name[0].toUpperCase() + userData.name.slice(1),
          profilePicture: userData.profilePicture || img_default,
        });
      } else {
        setChatDetails({
          name: chat.name || "Group Chat",
          profilePicture: img_default,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setChatDetails({
        name: "Unknown User",
        profilePicture: img_default,
      });
    }
  };

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/chats/chat-messages/${chat._id}`,
          {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          }
        );
        setChatMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    if (chat) {
      fetchChatMessages();
    }
  }, [chat]);

  useEffect(() => {
    console.log(chat);
    getChatDetails(chat);
  }, [chat]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (chat) {
      socket.emit("joinChat", chat._id);
    }
  }, [chat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", {
        chatId: chat._id,
        message,
        sender: userId,
      });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg shadow-lg">
      <div className="p-4 bg-purple-600 text-white flex items-center">
        <img
          src={chatDetails.profilePicture}
          alt="Chat avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <h2 className="text-lg font-semibold">{chatDetails.name}</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {chatMessages && chatMessages.length > 0 ? (
          chatMessages.map((msg, index) => {
            const senderName =
              msg.sender === userId
                ? "You"
                : chat.members.find((member) => member._id === msg.sender)
                    ?.name || msg.sender;
            return (
              <div
                key={index}
                className={`mb-2 flex ${
                  msg.sender === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg shadow-sm text-sm max-w-xs ${
                    msg.sender === userId
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <strong>{senderName}</strong>: {msg.content}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-500 text-center">No messages yet</div>
        )}
      </div>
      <div className="p-4 bg-white flex items-center">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring focus:border-purple-600"
        />
        <button
          onClick={handleSendMessage}
          className="bg-purple-600 text-white p-3 rounded-lg ml-2 hover:bg-purple-700 transition duration-300"
        >
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageArea;
