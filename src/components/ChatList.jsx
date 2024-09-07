import React from "react";

const defaultProfilePic = "https://via.placeholder.com/40";

const ChatList = ({ chats, userId, onChatSelect }) => {
  return (
    <ul className="divide-y divide-gray-300">
      {chats.map((chat) => (
        <li
          key={chat._id}
          className="flex items-center py-3 px-4 hover:bg-purple-500 cursor-pointer"
          onClick={() => onChatSelect(chat)}
        >
          <img
            src={
              chat.isGroup
                ? defaultProfilePic
                : chat.members[0]?.profilePicture || defaultProfilePic
            }
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-black">
              {chat.isGroup
                ? chat.name
                : chat.members
                    .filter((member) => member._id !== userId)
                    .map((member) => member.name)
                    .join(", ")}
            </div>
            <div className="text-sm text-gray-800">
              {chat.isGroup ? `${chat.members.length} members` : "Private chat"}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
