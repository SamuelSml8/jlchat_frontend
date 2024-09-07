const CreateGroupModal = ({
  isOpen,
  closeModal,
  friends,
  createGroup,
  groupName,
  setGroupName,
  selectedMembers,
  setSelectedMembers,
}) => {
  const handleGroupNameChange = (e) => setGroupName(e.target.value);

  const handleMemberChange = (e, friendId) => {
    if (e.target.checked) {
      setSelectedMembers((prev) => [...prev, friendId]);
    } else {
      setSelectedMembers((prev) => prev.filter((id) => id !== friendId));
    }
  };

  const handleCreateGroup = async () => {
    try {
      await createGroup(groupName, selectedMembers);
      toast.success("Group created successfully");
      closeModal();
    } catch (error) {
      toast.error("Failed to create group");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Create New Group
        </h2>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={handleGroupNameChange}
          className="border border-gray-300 rounded-lg p-3 mb-6 w-full focus:outline-none focus:border-purple-500 transition duration-300"
        />
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-600">
            Select Members
          </h3>
          <div className="max-h-40 overflow-y-auto space-y-3">
            {friends.map((friend) => (
              <label
                key={friend._id}
                htmlFor={`friend-${friend._id}`}
                className="flex items-center space-x-3 bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition duration-300"
              >
                <input
                  type="checkbox"
                  id={`friend-${friend._id}`}
                  checked={selectedMembers.includes(friend._id)}
                  onChange={(e) => handleMemberChange(e, friend._id)}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500 transition duration-300"
                />
                <span className="text-gray-700">{friend.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCreateGroup}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:ring focus:ring-purple-300 transition duration-300"
          >
            Create
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 focus:ring focus:ring-gray-300 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
