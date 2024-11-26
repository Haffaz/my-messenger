import { useQuery, useSubscription } from "@apollo/client";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Message } from "../graphql/generated/graphql";
import { GET_MESSAGES } from "../graphql/getMessagesByThreadId";
import useSendMessage from "../graphql/hooks/useSendMessage";
import { MESSAGE_SUBSCRIPTION } from "../graphql/messageCreated";
import ChatMessage from "./chat/ChatMessage";
import MessageInput from "./chat/MessageInput";

type ChatViewProps = {
  threadId: string;
};

export default function ChatView({ threadId }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { userId } = useUser();
  const [sendMessage] = useSendMessage();

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

  const handleSendMessage = async (messageContent: string) => {
    await sendMessage({
      variables: {
        input: {
          content: messageContent,
          threadId,
        },
      },
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwnMessage={message.sender.id === userId}
          />
        ))}
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
