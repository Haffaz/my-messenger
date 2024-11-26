import { useQuery } from "@apollo/client";
import { useUser } from "../contexts/UserContext";
import { GET_THREADS } from "../graphql/getThreads";
import ThreadListItem from "./thread/ThreadListItem";

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

  const threads = data?.threads || [];

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading threads</div>;
  if (threads.length === 0) return <div className="p-4">No threads found</div>;

  return (
    <div className="overflow-y-auto">
      {threads.map((thread) => (
        <ThreadListItem
          key={thread.id}
          thread={thread}
          isSelected={selectedThreadId === thread.id}
          currentUserId={userId}
          onSelect={onThreadSelect}
        />
      ))}
    </div>
  );
}
