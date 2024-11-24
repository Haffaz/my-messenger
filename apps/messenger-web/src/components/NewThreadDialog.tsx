import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';

const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
      threadId
      senderId
    }
  }
`;

interface NewThreadDialogProps {
  open: boolean;
  onClose: () => void;
  onThreadCreated: (threadId: string) => void;
}

export default function NewThreadDialog({
  open,
  onClose,
  onThreadCreated,
}: NewThreadDialogProps) {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const [sendMessage] = useMutation(SEND_MESSAGE);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !message.trim() || !user) return;

    try {
      const result = await sendMessage({
        variables: {
          input: {
            content: message,
            senderId: user.id,
            receiverUsername: username,
          },
        },
      });

      onThreadCreated(result.data.sendMessage.threadId);
      setUsername('');
      setMessage('');
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">New Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">To:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border p-2"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border p-2"
              rows={4}
              placeholder="Type your message..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 