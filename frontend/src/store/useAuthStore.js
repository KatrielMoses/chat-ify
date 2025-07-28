import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth: ", error)
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

      get().connectSocket();

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {

    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out!")

      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.error);
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In successfully");

      get().connectSocket();

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Updated succesfully")
    } catch (error) {
      console.log("error in update profile");
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateUsername: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-username", data);
      set({ authUser: res.data });
      toast.success("Username updated successfully")
    } catch (error) {
      console.log("error in update username");
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateFullName: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-fullname", data);
      set({ authUser: res.data });
      toast.success("Full name updated successfully")
    } catch (error) {
      console.log("error in update full name");
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  checkUsernameAvailability: async (username) => {
    try {
      const res = await axiosInstance.get(`/auth/check-username?username=${username}`);
      return res.data.available;
    } catch (error) {
      console.log("error in check username availability");
      return false;
    }
  },

  searchUsers: async (query) => {
    try {
      const res = await axiosInstance.get(`/friends/search?query=${query}`);
      return res.data;
    } catch (error) {
      console.log("error in search users");
      return [];
    }
  },

  sendFriendRequest: async (receiverId) => {
    try {
      const res = await axiosInstance.post("/friends/request", { receiverId });
      toast.success("Friend request sent successfully");
      return true;
    } catch (error) {
      console.log("error in send friend request");
      toast.error(error.response?.data?.message || "Failed to send friend request");
      return false;
    }
  },

  getFriendRequests: async () => {
    try {
      const res = await axiosInstance.get("/friends/requests");
      return res.data;
    } catch (error) {
      console.log("error in get friend requests");
      return [];
    }
  },

  respondToFriendRequest: async (requestId, action) => {
    try {
      const res = await axiosInstance.post("/friends/respond", { requestId, action });
      toast.success(`Friend request ${action}ed successfully`);
      return true;
    } catch (error) {
      console.log("error in respond to friend request");
      toast.error(error.response?.data?.message || "Failed to respond to friend request");
      return false;
    }
  },

  connectSocket: () => {

    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      }
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
