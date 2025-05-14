import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Trash2 } from "lucide-react";

const Notifications = () => {
  const { getNotifications, notifications,deleteNotification } = useAuthStore();

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const handleDelete = (id) => {
    deleteNotification(id)
    // TODO: Integrate actual delete logic here (e.g., API call or store action)
  };
  

  // Loading state
  if (!notifications) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications</p>
      ) : (
        notifications.map((notification) => {
          const {
            _id,
            message,
            createdAt,
            userImage,
            read
          } = notification;

          const formattedDate = new Date(createdAt).toLocaleString();

          return (
            <div
              key={_id}
              className={`flex items-start gap-4 p-4 rounded-2xl shadow-md border ${
                read ? "bg-white" : "bg-gray-100"
              } hover:shadow-lg transition-all duration-200`}
            >
              <img
                src={userImage || '/default-avatar.png'} // fallback image
                alt="User"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-800">{message}</p>
                <span className="text-xs text-gray-500">{formattedDate}</span>
              </div>
              <button
                onClick={() => handleDelete(_id)}
                className="text-red-500 hover:text-red-700"
                title="Delete Notification"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Notifications;
