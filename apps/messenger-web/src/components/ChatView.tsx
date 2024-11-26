import { useQuery, useSubscription } from "@apollo/client";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Message } from "../graphql/generated/graphql";
import { GET_MESSAGES } from "../graphql/getMessagesByThreadId";
import useSendMessage from "../graphql/hooks/useSendMessage";
import { MESSAGE_SUBSCRIPTION } from "../graphql/messageCreated";

type ChatViewProps = {
  threadId: string;
};

export default function ChatView({ threadId }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const { loading } = useQuery(GET_MESSAGES, {
    variables: { threadId },
    onCompleted: (data) => {
      if (data?.messages) {
        setMessages(data.messages);
      }
    },
  });

  useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { threadId },
    onData: ({ data }) => {
      if (!data?.data) return;
      const newMessage = data.data.messageCreated;
      if (newMessage) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    },
  });

  const [message, setMessage] = useState("");

  const { userId } = useUser();

  const [sendMessage] = useSendMessage();

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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender.id === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender.id === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <div className="text-sm font-medium">
                {message.sender.username}
              </div>
              <div>{message.content}</div>
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
