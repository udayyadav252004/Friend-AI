import { Flame, Pin, Search } from "lucide-react";
import { demoConversations, demoMemories } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function ChatSidebarRail() {
  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">Conversation history</p>
        </div>
        <Input placeholder="Search conversations" />
        <div className="mt-4 space-y-3">
          {demoConversations.map((conversation) => (
            <div key={conversation.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{conversation.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{conversation.lastMessage}</p>
                </div>
                {conversation.pinned ? <Pin className="h-4 w-4 text-primary" /> : null}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{conversation.updatedAt}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Memory highlights</p>
        </div>
        <div className="space-y-3">
          {demoMemories.slice(0, 3).map((memory) => (
            <div key={memory.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{memory.title}</p>
                <Badge variant="primary">{Math.round(memory.confidence * 100)}%</Badge>
              </div>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{memory.summary}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
