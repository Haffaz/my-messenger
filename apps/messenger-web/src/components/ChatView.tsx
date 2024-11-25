import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";

const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageSent($threadId: ID!) {
    messageCreated(threadId: $threadId) {
      content
      id
      createdAt
      threadId
      sender {
        id
        username
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query GetMessages($threadId: ID!) {
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
  const [messages, setMessages] = useState([]);

  // Query initial messages
  const { loading } = useQuery(GET_MESSAGES, {
    variables: { threadId },
    onCompleted: (data) => {
      setMessages(data.messages);
    },
  });

  // Subscribe to new messages
  useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { threadId },
    onData: ({ data }) => {
      console.log("new message", data.data.messageCreated);
      if (data?.data?.messageCreated) {
        setMessages((prevMessages) => [
          ...prevMessages,
          data.data.messageCreated,
        ]);
      }
    },
  });

  const [message, setMessage] = useState("");

  const { userId } = useUser();

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    refetchQueries: [{ query: GET_MESSAGES, variables: { threadId } }],
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage({
        variables: {
          input: {
            content: message,
            threadId,
          },
        },
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender.id === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.sender.id === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
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
