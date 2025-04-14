import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setCurrentChat } from '../store/messagesSlice';

interface Friend {
  id: number;
  username: string;
  email: string;
}

const Friends: React.FC = () => {
  const dispatch = useDispatch();
  const friends = useSelector((state: RootState) => state.friends.friends);
  const currentChat = useSelector((state: RootState) => state.messages.currentChat);

  const handleSelectFriend = (friendId: number) => {
    dispatch(setCurrentChat(friendId));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Friends</h2>
      <div className="space-y-2">
        {friends.map((friend: Friend) => (
          <div
            key={friend.id}
            className={`p-3 rounded-lg cursor-pointer ${
              currentChat === friend.id
                ? 'bg-blue-100 border border-blue-500'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleSelectFriend(friend.id)}
          >
            <p className="font-medium">{friend.username}</p>
            <p className="text-sm text-gray-500">{friend.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends; 