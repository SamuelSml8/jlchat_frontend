import axios from "axios";
import React, { useState, useEffect } from "react";

const AddFriendModal = ({ isOpen, closeModal, handleAddFriend }) => {
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  useEffect(() => {
    if (searchName) {
      const fetchSearchResults = async () => {
        setIsSearchPerformed(true);
        const response = await axios.get(
          `http://localhost:3000/users/findByName/${searchName}`,
          {
            headers: { Authorization: `Bearer ${getCookie("token")}` },
          }
        );
        setSearchResults(response.data.data);
      };

      fetchSearchResults();
    } else {
      setSearchResults([]);
      setIsSearchPerformed(false);
    }
  }, [searchName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Add New Friend
        </h2>
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-gray-300 rounded-md p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <div className="mt-4 max-h-60 overflow-y-auto">
          {searchName && isSearchPerformed && (
            <>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Search Results
              </h3>
              <div className="space-y-2">
                {searchResults.length ? (
                  searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-2 border-b border-gray-200"
                    >
                      <span className="text-gray-800 font-medium">
                        {user.name}
                      </span>
                      <button
                        onClick={() => handleAddFriend(user._id)}
                        className="bg-purple-600 text-white px-4 py-1 rounded-md hover:bg-purple-700 transition duration-300"
                      >
                        Add
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No results found</p>
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
