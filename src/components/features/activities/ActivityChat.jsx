import React, { useState, useEffect, useRef, useContext } from 'react';
import moment from 'moment';
import { Send, RefreshCcw } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { postDiscussionMessage, getActivityById, getUsers } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import SocketContext from '@/context/SocketContext';
import noMessages from '../../../assets/no-messages.svg';
const ActivityChat = ({ activity, loadingg }) => {
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [discussions, setDiscussions] = useState(activity?.discussions || []);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);
  const { socket } = useContext(SocketContext);

  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch all users for mention suggestions
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Update discussions when activity prop changes
  useEffect(() => {
    if (activity?.discussions) {
      setDiscussions(activity.discussions);
    }
  }, [activity]);

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', activity._id);

      socket.on('newDiscussionMessage', (data) => {
        if (data.activityId === activity._id) {
          setDiscussions((prev) => [data.discussion, ...prev]);
        }
      });

      socket.on('connect_error', (err) => {
        console.error("WebSocket Connection Error:", err);
      });

      return () => {
        socket.off('newDiscussionMessage');
      };
    }
  }, [socket, activity._id]);

  // Handle message input changes
  const handleMessageChange = (e) => {
    const message = e.target.value;
    setNewMessage(message);

    // Detect mentions
    const mentionMatch = message.match(/@(\w+)$/);
    if (mentionMatch) {
      const query = mentionMatch[1];
      setMentionQuery(query);
      // Filter users matching the query
      const suggestions = users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setMentionSuggestions(suggestions);
    } else {
      setMentionQuery('');
      setMentionSuggestions([]);
    }
  };

  // Handle mention selection from the dropdown
  const handleMentionSelect = (username) => {
    const message = newMessage.replace(/@(\w+)$/, `@${username} `);
    setNewMessage(message);
    setMentionQuery('');
    setMentionSuggestions([]);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    setSending(true);

    // Extract mentioned users
    const mentions = newMessage.match(/@(\w+)/g) || [];
    const mentionedUsers = mentions.map((mention) => mention.slice(1));

    const data = {
      message: newMessage,
      user: {
        _id: user?.id,
        name: user?.name,
        email: user?.email,
      },
      mentions: mentionedUsers, // Store mentions in the message
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await postDiscussionMessage(activity._id, data);
      setDiscussions(response);

      // Notify mentioned users
      mentionedUsers.forEach((username) => {
        const mentionedUser = users.find((u) => u.name === username);
        if (mentionedUser) {
          // Send a notification to the mentioned user
          console.log(`Notifying ${mentionedUser.name}: You were mentioned by ${user.name}`);
        }
      });
      socket.emit('newDiscussionMessage', {
        activityId: activity._id,
        discussion: data,
      });
      setSending(false);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message:", error);
      setSending(false);
    }
  };

  // Highlight mentions in the message
  const renderMessageWithMentions = (message, mentions) => {
    return message.split(' ').map((word, index) => {
      if (word.startsWith('@')) {
        const mentionedUser = mentions.find((user) => user.name === word.slice(1));
        if (mentionedUser) {
          return (
            <span key={index} className="text-amber-500 font-medium">
              {word}{' '}
            </span>
          );
        }
      }
      return <span key={index}>{word} </span>;
    });
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiObject) => {
    setNewMessage(newMessage + emojiObject.emoji);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await getActivityById(activity._id);
      setDiscussions(response.discussions);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error("Failed to refresh discussions:", error);
    }
  };

  if (loadingg) {
    return (
      <div className="h-full relative flex flex-col">
        <div className="bg-card flex justify-between gap-2 border-b border-neutral-200 dark:border-neutral-700">
          <h1 className="py-4 text-xl font-medium text-neutral-500 dark:text-neutral-400">Discussions</h1>
          <button
            onClick={handleRefresh}
            className="w-8 h-8 flex items-center justify-center  bg-white dark:bg-neutral-800 hover:scale-105 rounded-full cursor-pointer"
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative flex flex-col">
      <div className="bg-card flex justify-between items-center px-2 gap-2 border-b border-neutral-200 dark:border-neutral-700">
        <h1 className="py-4 text-xl font-medium text-neutral-500 dark:text-neutral-400">Discussions</h1>
        <button
          onClick={handleRefresh}
          className="w-8 h-8 flex items-center justify-center bg-white dark:bg-neutral-800 hover:scale-105 rounded-full cursor-pointer"
        >
          <RefreshCcw size={16} />
        </button>
      </div>
      {loading ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className={`flex items-start space-x-2 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {discussions.length === 0 ? (
            <div className="flex flex-col gap-2 items-center justify-center h-full">
                <img src={noMessages} alt="No messages" className="h-40 w-40" />
              <p className="text-gray-500 dark:text-gray-400">No discussions yet. Be the first to comment!</p>
            </div>
          ) : (
            discussions.map((fb) => (
              <div
                key={fb._id}
                className={`p-3 rounded-lg max-w-xs ${fb.user.name === user.name ? 'ml-auto bg-blue-600 text-white rounded-br-none' : 'mr-auto bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none'
                  }`}
              >
                <p className="text-sm font-medium">
                  {fb.user.name ? fb.user.name.slice(0, 20) : 'Unknown User'}{'...'}
                  <span className="text-[10px] font-light ml-2">{moment(fb.timestamp).fromNow()}</span>
                </p>
                <p className="mt-1 text-sm">
                  {renderMessageWithMentions(fb.message, fb.mentions)}
                </p>
              </div>
            ))
          )}
        </div>
      )}
      <div className="flex items-center gap-2 p-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex  justify-evenly w-full gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 bg-blue-100 dark:bg-gray-700 text-black dark:text-white rounded-lg"
          >
            😊
          </button>
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-16 left-4">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <div className="relative flex-1 ">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleMessageChange}
              placeholder="Add your comments..."
              className="no-scrollbar flex-1 w-full px-2 py-[2px] h-full placeholder:text-sm border border-gray-300 dark:border-gray-700 rounded-lg outline-none resize-none"
              rows={1}
            />
            {mentionSuggestions.length > 0 && (
              <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-48">
                {mentionSuggestions.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleMentionSelect(user.name)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {user.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            className="p-2.5 bg-blue-500 flex items-center justify-center text-white rounded-lg"
          >
            {sending ? (
              <svg
                className="w-5 h-5 mr-2 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityChat;