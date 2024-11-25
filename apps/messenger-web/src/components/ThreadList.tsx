import { gql, useQuery } from '@apollo/client';
import { useUser } from '../contexts/UserContext';

const GET_THREADS = gql`
  query GetThreads {
    threads {
      id
      participants {
        id
        username
      }
      lastMessage {
        content
        createdAt
      }
    }
  }
`;

interface ThreadListProps {
  selectedThreadId: string | null;
  onThreadSelect: (threadId: string) => void;
}

export default function ThreadList({ selectedThreadId, onThreadSelect }: ThreadListProps) {
  const { data, loading, error } = useQuery(GET_THREADS);
  const { user } = useUser();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading threads</div>;

  return (
    <div className="overflow-y-auto">
      {data?.threads.map((thread: any) => {
        const otherParticipant = thread.participants.find(
          (p: any) => p.id !== user?.id
        );

        return (
          <div
            key={thread.id}
            onClick={() => onThreadSelect(thread.id)}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              selectedThreadId === thread.id ? 'bg-gray-100' : ''
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