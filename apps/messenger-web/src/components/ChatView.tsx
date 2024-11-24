import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';

const GET_MESSAGES = gql`
  query GetMessages($threadId: String!) {
    messages(threadId: $threadId) {
      id
      content
      createdAt
      sender {
        id
        username
      }
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
      createdAt
    }
  }
`;

interface ChatViewProps {
  threadId: string;
}

export default function ChatView({ threadId }: ChatViewProps) {
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const { data, loading } = useQuery(GET_MESSAGES, {
    variables: { threadId },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    refetchQueries: [{ query: GET_MESSAGES, variables: { threadId } }],
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    try {
      await sendMessage({
        variables: {
          input: {
            content: message,
            threadId,
            senderId: user.id,
          },
        },
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {data?.messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender.id === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.sender.id === user?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              <div className="text-sm font-medium">{msg.sender.username}</div>
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-lg border p-2"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 