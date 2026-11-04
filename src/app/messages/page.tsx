import type { Metadata } from "next";
import Link from "next/link";
import { readData } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Avatar, CARD, Container, PageTitle, StatusBadge } from "@/components/ui";
import { dateTimeLabel } from "@/lib/format";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const user = await requireUser("/messages");
  const d = readData();

  // A conversation exists for every task where the user is the poster or the hired Tasker.
  const threads = d.tasks
    .filter(
      (t) =>
        (t.posterId === user.id || t.hiredTaskerId === user.id) &&
        t.hiredTaskerId !== null,
    )
    .map((t) => {
      const msgs = d.messages.filter((m) => m.taskId === t.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const otherId = t.posterId === user.id ? t.hiredTaskerId! : t.posterId;
      const other = d.users.find((u) => u.id === otherId);
      return { task: t, last: msgs[0], other };
    })
    .sort((a, b) => (b.last?.createdAt ?? b.task.createdAt).localeCompare(a.last?.createdAt ?? a.task.createdAt));

  return (
    <Container className="max-w-3xl">
      <PageTitle title="Messages" subtitle="Conversations open once a Tasker is hired." />
      <div className={`${CARD} divide-y divide-gray-100 p-0`}>
        {threads.length === 0 && (
          <p className="p-6 text-sm text-gray-600">
            No conversations yet. Once you hire someone (or get hired), your chats will show up here.
          </p>
        )}
        {threads.map(({ task, last, other }) => (
          <Link key={task.id} href={`/tasks/${task.id}#chat`} className="flex items-start gap-4 p-5 hover:bg-gray-50">
            <Avatar name={other?.name ?? "?"} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-semibold text-gray-900">{other?.name}</p>
                <StatusBadge status={task.status} />
              </div>
              <p className="truncate text-sm text-gray-600">{task.title}</p>
              <p className="mt-1 truncate text-sm text-gray-500">
                {last ? last.body : "No messages yet"}
              </p>
              {last && <p className="mt-1 text-xs text-gray-400">{dateTimeLabel(last.createdAt)}</p>}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
