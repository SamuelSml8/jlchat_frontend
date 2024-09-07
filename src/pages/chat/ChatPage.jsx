import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { FaUsers, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import ChatList from "../../components/ChatList";
import MessageArea from "../../components/MessageArea";
import CreateGroupModal from "../../components/CreateGroupModal";
import AddFriendModal from "../../components/AddFriendModal";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [chats, setChats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  const fetchUsernameFromToken = () => {
    const token = getCookie("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const name =
          decodedToken.name[0].toUpperCase() +
          decodedToken.name.slice(1) +
          " " +
          decodedToken.lastName[0].toUpperCase() +
          decodedToken.lastName.slice(1);
        setUsername(name);
        setUserId(decodedToken.sub);
        return decodedToken.sub;
      } catch (error) {
        toast.error("Failed to decode token");
      }
    }
    return null;
  };

  const fetchChats = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/chats/user-chats`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      setChats(response.data);
    } catch (error) {
      toast.error("Error fetching chats");
    }
  };

  const fetchUserFriends = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/getAllUserFriends/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      console.log("Amigos", response.data.data);
      setFriends(response.data.data);
    } catch (error) {
      toast.error("Error fetching friends");
    }
  };

  useEffect(() => {
    const userId = fetchUsernameFromToken();
    if (userId) {
      fetchChats(userId);
      fetchUserFriends(userId);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      if (response.data.ok) {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.setItem("logoutSuccess", "true");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Logout failed");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/findByName/${searchName}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      setSearchResults(response.data.data);
      setIsSearchPerformed(true);
    } catch (error) {
      toast.error("Error searching for user");
      setSearchResults([]);
      setIsSearchPerformed(false);
    }
  };

  const handleAddFriend = async (friendId) => {
    const userId = fetchUsernameFromToken();
    if (!userId) return;

    try {
      await axios.post(
        "http://localhost:3000/chats/add-friend",
        { userId, friendId },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      closeAddFriendModal();
      toast.success("Friend added");
      fetchChats(userId);
      fetchUserFriends(userId);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "Friend already added"
      ) {
        toast.error("Friend already added");
      } else {
        toast.error("Error adding friend");
      }
    }
  };

  const handleCreateGroup = async (groupName, members) => {
    const userId = fetchUsernameFromToken();
    if (!userId) return;

    if (members.length === 0) {
      toast.error("Select at least one member");
      return;
    }

    if (!groupName) {
      toast.error("Group name cannot be empty");
      return;
    }
    try {
      const allMembers = [...members, userId];
      await axios.post(
        "http://localhost:3000/chats/create-group",
        { name: groupName, members: allMembers },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      closeCreateGroupModal();
      toast.success("Group created successfully");
      fetchChats(userId);
    } catch (error) {
      toast.error("Error creating group");
    }
  };

  const openCreateGroupModal = () => setShowCreateGroupModal(true);
  const closeCreateGroupModal = () => setShowCreateGroupModal(false);
  const openAddFriendModal = () => setShowAddFriendModal(true);
  const closeAddFriendModal = () => setShowAddFriendModal(false);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="flex h-screen bg-white text-black">
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        <div className="flex flex-col items-center py-6 border-b border-gray-200 bg-purple-600">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-purple-400 mb-4 shadow-md"
          />
          <h2 className="text-lg font-semibold mb-2 text-white">{username}</h2>
          <div className="flex space-x-3">
            <button
              onClick={openCreateGroupModal}
              className="p-3 bg-purple-500 text-white rounded-full hover:bg-purple-700 shadow-md transition duration-300"
            >
              <FaUsers size={18} />
            </button>
            <button
              onClick={openAddFriendModal}
              className="p-3 bg-purple-500 text-white rounded-full hover:bg-purple-700 shadow-md transition duration-300"
            >
              <FaUserPlus size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition duration-300"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="py-2 px-4 border-b border-gray-300">
            <h2 className="text-black font-semibold">Chats</h2>
          </div>
          <ChatList chats={chats} onChatSelect={handleChatSelect} />
        </div>
      </div>

      <div className="flex-1 bg-gray-50 p-6">
        {selectedChat ? (
          <MessageArea chat={selectedChat} userId={userId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-400">Select a chat to start</p>
          </div>
        )}
      </div>

      {showCreateGroupModal && (
        <CreateGroupModal
          isOpen={showCreateGroupModal}
          closeModal={closeCreateGroupModal}
          groupName={newGroupName}
          setGroupName={setNewGroupName}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          friends={friends}
          createGroup={handleCreateGroup}
        />
      )}
      {showAddFriendModal && (
        <AddFriendModal
          isOpen={showAddFriendModal}
          closeModal={closeAddFriendModal}
          onClose={closeAddFriendModal}
          onSubmit={handleAddFriend}
          searchName={searchName}
          setSearchName={setSearchName}
          handleSearch={handleSearch}
          searchResults={searchResults}
          isSearchPerformed={isSearchPerformed}
          handleAddFriend={handleAddFriend}
        />
      )}
    </div>
  );
};

export default ChatPage;
