import { useState, useEffect } from "react";
import { Check, X, MessageCircle, UserPlus, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const NotificationPanel = ({ isOpen, onClose, onRequestHandled }) => {
    const [activeTab, setActiveTab] = useState("requests");
    const [friendRequests, setFriendRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { getFriendRequests, respondToFriendRequest } = useAuthStore();
    const { getUsers } = useChatStore();

    useEffect(() => {
        if (isOpen) {
            loadFriendRequests();
        }
    }, [isOpen]);

    const loadFriendRequests = async () => {
        setIsLoading(true);
        try {
            const requests = await getFriendRequests();
            setFriendRequests(Array.isArray(requests) ? requests : []);
        } catch (error) {
            console.log("Error loading friend requests:", error);
            setFriendRequests([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        const success = await respondToFriendRequest(requestId, "accept");
        if (success) {
            // Remove from local state
            setFriendRequests(prev => prev.filter(req => req._id !== requestId));
            // Refresh friends list in chat store
            await getUsers();
            // Notify parent to update notification count
            onRequestHandled?.();
        }
    };

    const handleDeclineRequest = async (requestId) => {
        const success = await respondToFriendRequest(requestId, "decline");
        if (success) {
            // Remove from local state
            setFriendRequests(prev => prev.filter(req => req._id !== requestId));
            // Notify parent to update notification count
            onRequestHandled?.();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="absolute right-0 top-full mt-2 w-80 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50">
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-3">Notifications</h3>

                    {/* Tab Toggle */}
                    <div className="flex bg-base-200 rounded-lg p-1 mb-4">
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "requests"
                                ? "bg-base-100 text-primary shadow-sm"
                                : "text-base-content/70 hover:text-base-content"
                                }`}
                        >
                            <UserPlus className="w-4 h-4" />
                            Requests
                            {friendRequests.length > 0 && (
                                <span className="bg-primary text-primary-content text-xs px-2 py-0.5 rounded-full">
                                    {friendRequests.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("messages")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "messages"
                                ? "bg-base-100 text-primary shadow-sm"
                                : "text-base-content/70 hover:text-base-content"
                                }`}
                        >
                            <MessageCircle className="w-4 h-4" />
                            Messages
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-80 overflow-y-auto">
                        {activeTab === "requests" && (
                            <div className="space-y-2">
                                {isLoading ? (
                                    <div className="text-center py-4">
                                        <div className="loading loading-spinner loading-md"></div>
                                    </div>
                                ) : friendRequests.length === 0 ? (
                                    <div className="text-center py-6 text-base-content/60">
                                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No friend requests</p>
                                    </div>
                                ) : (
                                    friendRequests.slice(0, 6).map((request) => (
                                        <div key={request._id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={request.sender.profilePic || "/avatar.png"}
                                                    alt={request.sender.username}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <div className="font-medium text-sm">{request.sender.username}</div>
                                                    <div className="text-xs text-base-content/60">wants to be friends</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleAcceptRequest(request._id)}
                                                    className="p-2 hover:bg-green-100 hover:text-green-600 rounded-lg transition-colors group"
                                                    title="Accept"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    <span className="sr-only">Accept</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeclineRequest(request._id)}
                                                    className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors group"
                                                    title="Decline"
                                                >
                                                    <X className="w-4 h-4" />
                                                    <span className="sr-only">Decline</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === "messages" && (
                            <div className="text-center py-6 text-base-content/60">
                                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No new messages</p>
                                <p className="text-xs mt-1">Message notifications coming soon</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationPanel; 