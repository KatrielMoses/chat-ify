import { useState } from "react";
import { X, Search, UserPlus, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const AddFriendModal = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [sentRequests, setSentRequests] = useState(new Set());

    const { searchUsers, sendFriendRequest } = useAuthStore();

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
    };

    const handleSendRequest = async (userId) => {
        const success = await sendFriendRequest(userId);
        if (success) {
            setSentRequests(prev => new Set([...prev, userId]));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const resetModal = () => {
        setSearchQuery("");
        setSearchResults([]);
        setSentRequests(new Set());
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Add Friend</h2>
                    <button onClick={handleClose} className="p-1 hover:bg-base-200 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Search by username or email"
                                className="input input-bordered w-full pl-10"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={isSearching || !searchQuery.trim()}
                            className="btn btn-primary"
                        >
                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="max-h-60 overflow-y-auto">
                    {searchResults.length === 0 && searchQuery && !isSearching && (
                        <div className="text-center text-base-content/60 py-4">
                            No users found
                        </div>
                    )}

                    {searchResults.map((user) => (
                        <div key={user._id} className="flex items-center justify-between p-3 hover:bg-base-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <img
                                    src={user.profilePic || "/avatar.png"}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <div className="font-medium">{user.username}</div>
                                    <div className="text-sm text-base-content/60">{user.email}</div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleSendRequest(user._id)}
                                disabled={sentRequests.has(user._id)}
                                className={`btn btn-sm ${sentRequests.has(user._id)
                                        ? "btn-disabled"
                                        : "btn-primary"
                                    }`}
                            >
                                {sentRequests.has(user._id) ? (
                                    "Sent"
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        Add
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddFriendModal; 