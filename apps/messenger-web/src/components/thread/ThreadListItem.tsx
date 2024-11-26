import { Message, Thread } from "../../graphql/generated/graphql";

type ThreadListItemProps = {
  thread: Pick<Thread, "id" | "participants"> & {
    lastMessage: Pick<Message, "content" | "createdAt">;
  };
  isSelected: boolean;
  currentUserId: string;
  onSelect: (threadId: string) => void;
};

export default function ThreadListItem({
  thread,
  isSelected,
  currentUserId,
  onSelect,
}: ThreadListItemProps) {
  const otherParticipant = thread.participants.find(
    (participant) => participant.id !== currentUserId,
  );

  return (
    <div
      onClick={() => onSelect(thread.id)}
      className={`p-4 cursor-pointer hover:bg-gray-50 ${
        isSelected ? "bg-gray-100" : ""
      }`}
    >
      <div className="font-medium">{otherParticipant?.username}</div>
      {thread.lastMessage && (
        <div className="text-sm text-gray-500 truncate">
          {thread.lastMessage.content}
        </div>
      )}
    </div>
  );
}
