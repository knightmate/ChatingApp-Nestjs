import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLatestMessages, sendMessage } from '../api/messages';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: string;
  isRead: boolean;
  sender?: {
    username: string;
    id?: number;
  };
}

interface MessagesProps {
  receiverId: number;
}

export default function Messages({ receiverId }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout>();
  const lastMessageIdRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchLatestMessages = async () => {
    try {
      const latestMessages = await getLatestMessages(receiverId, lastMessageIdRef.current);
      if (latestMessages.length > 0) {
        setMessages(prev => {
          const newMessages = [...prev];
          latestMessages.forEach(message => {
            if (!newMessages.some(m => m.id === message.id)) {
              newMessages.push(message);
            }
          });
          lastMessageIdRef.current = Math.max(...newMessages.map(m => m.id));
          return newMessages;
        });
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching latest messages:', error);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      try {
        const initialMessages = await getLatestMessages(receiverId);
        setMessages(initialMessages);
        if (initialMessages.length > 0) {
          lastMessageIdRef.current = Math.max(...initialMessages.map(m => m.id));
        }
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching initial messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    initialFetch();
    pollingIntervalRef.current = setInterval(fetchLatestMessages, 1000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [receiverId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const sentMessage = await sendMessage(receiverId, newMessage.trim());
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      lastMessageIdRef.current = sentMessage.id;
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5]">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-2">
          {messages.map((msg) => {
            const senderId = msg.sender?.id || msg.senderId;
            const isSentByMe = senderId === user?.id;
            console.log('Message:', { senderId, userId: user?.id, msg });
            
            return (
              <div
                key={msg.id}
                className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-[75%] px-4 py-2 ${
                    isSentByMe
                      ? 'bg-[#0084ff] text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md'
                      : 'bg-white text-gray-900 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-md'
                  } shadow-sm`}
                >
                  <p className="break-words text-[15px]">{msg.content}</p>
                  <span 
                    className={`text-[11px] block text-right mt-1 ${
                      isSentByMe ? 'text-white/90' : 'text-[#667781]'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="px-4 py-3 bg-[#f0f0f0] border-t border-[#e0e0e0]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 rounded-full border-none focus:outline-none focus:ring-1 focus:ring-[#128c7e] bg-white text-[15px]"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2.5 bg-[#128c7e] text-white rounded-full hover:bg-[#075e54] disabled:opacity-50 disabled:hover:bg-[#128c7e] min-w-[50px] flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
