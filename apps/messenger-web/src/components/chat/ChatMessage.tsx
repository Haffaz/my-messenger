import { Message } from "../../graphql/generated/graphql";

type ChatMessageProps = {
  message: Message;
  isOwnMessage: boolean;
};

export default function ChatMessage({
  message,
  isOwnMessage,
}: ChatMessageProps) {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        <div className="text-sm font-medium">{message.sender.username}</div>
        <div>{message.content}</div>
      </div>
    </div>
  );
}
