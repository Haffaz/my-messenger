import { useState } from "react";
import ChatView from "../components/ChatView";
import NewThreadDialog from "../components/NewThreadDialog";
import ThreadList from "../components/ThreadList";

export default function Messages() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isNewThreadDialogOpen, setIsNewThreadDialogOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Threads Sidebar */}
      <div className="w-1/4 border-r bg-white">
        <div className="p-4">
          <button
            onClick={() => setIsNewThreadDialogOpen(true)}
            className="w-full bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600"
          >
            New Message
          </button>
        </div>
        <ThreadList
          selectedThreadId={selectedThreadId}
          onThreadSelect={setSelectedThreadId}
        />
      </div>

      {/* Chat View */}
      <div className="flex-1">
        {selectedThreadId ? (
          <ChatView threadId={selectedThreadId} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation or start a new one
          </div>
        )}
      </div>

      {/* New Thread Dialog */}
      <NewThreadDialog
        open={isNewThreadDialogOpen}
        onClose={() => setIsNewThreadDialogOpen(false)}
        onThreadCreated={(threadId) => {
          setSelectedThreadId(threadId);
          setIsNewThreadDialogOpen(false);
        }}
      />
    </div>
  );
}
