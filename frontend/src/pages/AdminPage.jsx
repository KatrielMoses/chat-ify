import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Shield, AlertTriangle } from "lucide-react";

const AdminPage = () => {
    const { authUser } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Simulate admin data fetch
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setUsers([
                { id: 1, username: "admin", email: "admin@example.com", role: "admin", status: "active" },
                { id: 2, username: "user1", email: "user1@example.com", role: "user", status: "active" },
                { id: 3, username: "user2", email: "user2@example.com", role: "user", status: "inactive" },
                { id: 4, username: "moderator", email: "mod@example.com", role: "moderator", status: "active" },
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen pt-20">
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-base-100 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold">Admin Panel</h1>
                    </div>

                    {/* XSS VULNERABILITY: Display search term without sanitization */}
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-12 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        </div>
                        {searchTerm && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600">
                                    Searching for: <span dangerouslySetInnerHTML={{ __html: searchTerm }}></span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* XSS VULNERABILITY: Display user data without sanitization */}
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>
                                            <span dangerouslySetInnerHTML={{ __html: user.username }}></span>
                                        </td>
                                        <td>
                                            <span dangerouslySetInnerHTML={{ __html: user.email }}></span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.role === 'admin' ? 'badge-error' : user.role === 'moderator' ? 'badge-warning' : 'badge-info'}`}>
                                                <span dangerouslySetInnerHTML={{ __html: user.role }}></span>
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                                                <span dangerouslySetInnerHTML={{ __html: user.status }}></span>
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* XSS VULNERABILITY: Display current user info without sanitization */}
                    <div className="mt-8 p-4 bg-base-200 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-warning" />
                            Current User Info
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-base-content/60">Username:</label>
                                <p className="text-base-content" dangerouslySetInnerHTML={{ __html: authUser?.username || 'N/A' }}></p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-base-content/60">Email:</label>
                                <p className="text-base-content" dangerouslySetInnerHTML={{ __html: authUser?.email || 'N/A' }}></p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-base-content/60">Full Name:</label>
                                <p className="text-base-content" dangerouslySetInnerHTML={{ __html: authUser?.fullName || 'N/A' }}></p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-base-content/60">User ID:</label>
                                <p className="text-base-content" dangerouslySetInnerHTML={{ __html: authUser?._id || 'N/A' }}></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
