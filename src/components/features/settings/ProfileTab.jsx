import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileTab = ({ loading }) => {
  const { user } = useAuth();
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
  }
  return (
    <div className="bg-[#f5f5f5] dark:bg-muted p-6 rounded-lg md:mx-5 h-max">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="flex flex-col space-y-4">
        {/* Profile Picture */}
        {loading ? (
          <Skeleton className="w-40 h-40 rounded-md" />
        ) : (
          <img
            src={user?.profilePic || `https://eu.ui-avatars.com/api/?name=${getInitials(user?.name)}`}
            alt="Profile"
            className="w-40 h-40 rounded-md object-contain aspect-square"
          />
        )}

        {/* User Details */}
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" /> {/* Name */}
            <Skeleton className="h-4 w-64" /> {/* Email */}
            <Skeleton className="h-4 w-32" /> {/* Role */}
          </div>
        ) : (
          <div>
            <p className="text-xl font-semibold">{user?.name}</p>
            <p className="text-gray-800 dark:text-gray-200">{user?.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{user?.role}</p>
          </div>
        )}
      </div>
    </div>
 
  );
};

export default ProfileTab;