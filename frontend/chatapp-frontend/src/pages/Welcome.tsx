/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Send, LogOut, Search, Menu, X, UserPlus, Bell, Users, Check, X as Cross } from 'lucide-react';
import toast from 'react-hot-toast';
import { Friend, FriendRequest, getFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend } from '../api/friends';
import { Message, getMessages, sendMessage } from '../api/messages';
import { User, getAllUsers, searchUsers } from '../api/users';
import { useAuth } from '../context/AuthContext';
import Messages from '../components/Messages';

type Tab = 'chats' | 'users' | 'requests';

function Welcome() {
  const { logout, user } = useAuth();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab>('chats');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [friends, setFriends] = useState<Friend[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const friendsId=friends.map(({id})=>id)
  console.log('friends',friendsId)
  // Load initial data
  useEffect(() => {
    loadFriends();
    loadFriendRequests();
    loadUsers();
  }, []);

  // Load messages when a friend is selected
  useEffect(() => {
    if (selectedFriend) {
      loadMessages(selectedFriend.id);
    }
  }, [selectedFriend]);

  // Search users when query changes
  useEffect(() => {
    if (currentTab === 'users' && searchQuery) {
      const delayDebounceFn = setTimeout(() => {
        searchForUsers(searchQuery);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, currentTab]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const loadFriends = async () => {
    try {
      const data = await getFriends();
      setFriends(data);
    } catch (error) {
      toast.error('Failed to load friends');
    }
  };

  
  const loadFriendRequests = async () => {
    try {
      const data = await getFriendRequests();
      setFriendRequests(data);
    } catch (error) {
      toast.error('Failed to load friend requests');
    }
  };

  const loadMessages = async (friendId: number) => {
    try {
      const data = await getMessages(friendId);
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const handleUnfriend = async (friendId: number) => {
    try {
      await removeFriend(friendId);
      setFriends(friends.filter(friend => friend.id !== friendId));
      if (selectedFriend?.id === friendId) {
        setSelectedFriend(null);
      }
      // Refresh the users list after unfriending
      loadUsers();
      toast.success('Friend removed');
    } catch (error) {
      toast.error('Failed to remove friend');
    }
  };

  const searchForUsers = async (query: string) => {
    try {
      const data = await searchUsers(query);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to search users');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedFriend) return;

    try {
      const newMessage = await sendMessage(selectedFriend.id, message.trim());
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      toast.success('Message sent');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleSendFriendRequest = async (userId: number) => {
    try {
      await sendFriendRequest(userId);
      toast.success('Friend request sent');
      // Refresh the users list to update the UI
      if (searchQuery) {
        searchForUsers(searchQuery);
      }
    } catch (error) {
      toast.error('Failed to send friend request');
    }
  };

  const handleFriendRequest = async (requestId: number, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await acceptFriendRequest(requestId);
        toast.success('Friend request accepted');
      } else {
        await rejectFriendRequest(requestId);
        toast.success('Friend request rejected');
      }
      // Refresh both friend requests and friends list
      loadFriendRequests();
      loadFriends();
    } catch (error) {
      toast.error(`Failed to ${action} friend request`);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'users':
        return (
          <div className="space-y-2">
            {users.map(user =>{
              const isFriend=friendsId.some((id ) => id === user.id);
              console.log('isFriend',friendsId,isFriend)

              return(
                <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xl text-gray-600">{user.username[0].toUpperCase()}</span>
                  </div>
                  <span className="font-medium">{user.username}</span>
                </div>
               {isFriend?<><span>Friends</span></>:(<>
                <button
                  onClick={() => handleSendFriendRequest(user.id)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                  title="Send Friend Request"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
               </>)}
              </div>
              )
            })}
            {searchQuery && users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            )}
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-2">
            {friendRequests
              .filter(request => request.status === 'pending')
              .map(request => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xl text-gray-600">
                        {request.sender.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium block">{request.sender.username}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleFriendRequest(request.id, 'accept')}
                      className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                      title="Accept"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleFriendRequest(request.id, 'reject')}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Reject"
                    >
                      <Cross className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            {friendRequests.filter(request => request.status === 'pending').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending friend requests
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-1">
            {friends
              .filter(friend => 
                friend.username.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((friend) => (
                <div
                  key={friend.id}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    selectedFriend?.id === friend.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div 
                    className="flex-1"
                    onClick={() => setSelectedFriend(friend)}
                  >
                    <h4 className="font-medium text-gray-900">{friend.username}</h4>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnfriend(friend.id);
                    }}
                    className="ml-2 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Unfriend
                  </button>
                </div>
              ))}
            {friends.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No friends yet. Add some friends to start chatting!
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className={`bg-white w-80 border-r flex-shrink-0 ${showSidebar ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} md:relative md:block`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Welcome, {user?.username}</h2>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentTab === 'users' ? 'users' : 'friends'}...`}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-1 mt-4">
            <button
              onClick={() => setCurrentTab('chats')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                currentTab === 'chats'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-1" />
              Chats
            </button>
            <button
              onClick={() => setCurrentTab('users')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                currentTab === 'users'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserPlus className="w-4 h-4 inline-block mr-1" />
              Add
            </button>
            <button
              onClick={() => setCurrentTab('requests')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                currentTab === 'requests'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bell className="w-4 h-4 inline-block mr-1" />
              Requests
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-200px)]">
          {renderTabContent()}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            {selectedFriend ? (
              <>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl text-gray-600">
                    {selectedFriend.username[0].toUpperCase()}
                  </span>
                </div>
                <h2 className="font-medium">{selectedFriend.username}</h2>
              </>
            ) : (
              <h2 className="font-medium">Select a conversation</h2>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedFriend ? (
            <div className="flex-1">
              <div className="bg-[#128c7e] text-white px-4 py-3">
                <h3 className="text-lg font-medium">{selectedFriend.username}</h3>
              </div>
              <div className="flex-1 h-[calc(100vh-64px)]">
                <Messages 
                  receiverId={selectedFriend.id} 
                  receiverName={selectedFriend.username}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a friend to start chatting
            </div>
          )}
        </div>

        {/* Message Input */}
        {/* {selectedFriend && (
          <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
                disabled={!message.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        )} */}
      </div>
    </div>
  );
}

export default Welcome;