import { useQuery } from "@apollo/client";
import { useUser } from "../contexts/UserContext";
import { GET_THREADS } from "../graphql/getThreads";

type ThreadListProps = {
  selectedThreadId: string | null;
  onThreadSelect: (threadId: string) => void;
};

export default function ThreadList({
  selectedThreadId,
  onThreadSelect,
}: ThreadListProps) {
  const { data, loading, error } = useQuery(GET_THREADS);
  const { userId } = useUser();

  if (loading) return <div className="p-4">Loading...</div>;

  if (error) {
    console.error("Error loading threads:", error);
    return <div className="p-4 text-red-500">Error loading threads</div>;
  }

  if (!data?.threads) {
    return <div className="p-4">No threads found</div>;
  }

  return (
    <div className="overflow-y-auto">
      {data.threads.map((thread) => {
        const otherParticipant = thread.participants.find(
          (participant) => participant.id !== userId,
        );
        return (
          <div
            key={thread.id}
            onClick={() => onThreadSelect(thread.id)}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              selectedThreadId === thread.id ? "bg-gray-100" : ""
            }`}
          >
            <div className="font-medium">{otherParticipant?.username}</div>
            {thread.lastMessage && (
              <>
                <div className="text-sm text-gray-500 truncate">
                  {thread.lastMessage.content}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
