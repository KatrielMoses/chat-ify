import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Edit3, Check, X } from "lucide-react";

const ProfilePage = () => {

  const { authUser, isUpdatingProfile, updateProfile, updateUsername, updateFullName, checkUsernameAvailability } = useAuthStore();

  // Username editing state
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameValue, setUsernameValue] = useState(authUser?.username || "");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Full name editing state
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [fullNameValue, setFullNameValue] = useState(authUser?.fullName || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    }
  };
  const [selectedImg, setSelectedImg] = useState(null);

  // Real-time username validation
  useEffect(() => {
    const checkUsername = async () => {
      if (usernameValue && usernameValue !== authUser?.username && usernameValue.length > 0) {
        setIsCheckingUsername(true);
        const available = await checkUsernameAvailability(usernameValue);
        setIsUsernameAvailable(available);
        setIsCheckingUsername(false);
      } else {
        setIsUsernameAvailable(true);
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500); // Debounce for 500ms
    return () => clearTimeout(timeoutId);
  }, [usernameValue, authUser?.username, checkUsernameAvailability]);

  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
    setUsernameValue(authUser?.username || "");
  };

  const handleUsernameCancel = () => {
    setIsEditingUsername(false);
    setUsernameValue(authUser?.username || "");
    setIsUsernameAvailable(true);
  };

  const handleUsernameUpdate = async () => {
    if (usernameValue && isUsernameAvailable && usernameValue !== authUser?.username) {
      await updateUsername({ username: usernameValue });
      setIsEditingUsername(false);
    }
  };

  const handleFullNameEdit = () => {
    setIsEditingFullName(true);
    setFullNameValue(authUser?.fullName || "");
  };

  const handleFullNameCancel = () => {
    setIsEditingFullName(false);
    setFullNameValue(authUser?.fullName || "");
  };

  const handleFullNameUpdate = async () => {
    if (fullNameValue !== authUser?.fullName) {
      await updateFullName({ fullName: fullNameValue });
      setIsEditingFullName(false);
    }
  };

  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2'>Your Profile Info</p>
          </div>

          {/*avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* user info section */}

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="flex items-center gap-2">
                {isEditingFullName ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={fullNameValue}
                      onChange={(e) => setFullNameValue(e.target.value)}
                      className="px-4 py-2.5 bg-base-200 rounded-lg border border-gray-300 w-full focus:border-blue-500"
                      placeholder="Enter your full name"
                      autoFocus
                    />
                  </div>
                ) : (
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex-1 text-gray-500">
                    {authUser?.fullName || "Enter your full name"}
                  </p>
                )}

                <div className="flex items-center gap-1">
                  {isEditingFullName ? (
                    <>
                      <button
                        onClick={handleFullNameUpdate}
                        disabled={fullNameValue === authUser?.fullName || isUpdatingProfile}
                        className={`p-2 rounded-lg transition-colors ${fullNameValue !== authUser?.fullName && !isUpdatingProfile
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-400 text-gray-600 cursor-not-allowed"
                          }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleFullNameCancel}
                        disabled={isUpdatingProfile}
                        className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleFullNameEdit}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </div>
              <div className="flex items-center gap-2">
                {isEditingUsername ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={usernameValue}
                      onChange={(e) => setUsernameValue(e.target.value)}
                      className={`px-4 py-2.5 bg-base-200 rounded-lg border w-full ${!isUsernameAvailable ? "border-red-500" : "border-green-500"
                        }`}
                      placeholder={authUser?.username}
                      autoFocus
                    />
                    {usernameValue && usernameValue !== authUser?.username && (
                      <div className="mt-1 text-xs">
                        {isCheckingUsername ? (
                          <span className="text-yellow-500">Checking availability...</span>
                        ) : isUsernameAvailable ? (
                          <span className="text-green-500">✓ Username available</span>
                        ) : (
                          <span className="text-red-500">✗ Username not available</span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex-1">{authUser?.username}</p>
                )}

                <div className="flex items-center gap-1">
                  {isEditingUsername ? (
                    <>
                      <button
                        onClick={handleUsernameUpdate}
                        disabled={!usernameValue || !isUsernameAvailable || usernameValue === authUser?.username || isUpdatingProfile}
                        className={`p-2 rounded-lg transition-colors ${usernameValue && isUsernameAvailable && usernameValue !== authUser?.username && !isUpdatingProfile
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-400 text-gray-600 cursor-not-allowed"
                          }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleUsernameCancel}
                        disabled={isUpdatingProfile}
                        className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleUsernameEdit}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage