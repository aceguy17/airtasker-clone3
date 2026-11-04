import Link from "next/link";
import type { Category, Task, User } from "@/lib/db";
import { budgetLabel, dateLabel } from "@/lib/format";
import { CARD, StatusBadge } from "./ui";

export function TaskCard({
  task,
  category,
  poster,
  offerCount,
}: {
  task: Task;
  category?: Category;
  poster?: User;
  offerCount?: number;
}) {
  return (
    <Link href={`/tasks/${task.id}`} className={`${CARD} block transition hover:border-teal-400 hover:shadow-md`}>
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
        {category && (
          <span>
            {category.icon} {category.name}
          </span>
        )}
        <span aria-hidden="true">·</span>
        <span>{task.mode === "remote" ? "Remote" : task.suburb}</span>
        <span className="ml-auto">
          <StatusBadge status={task.status} />
        </span>
      </div>
      <h3 className="mt-2 text-base font-semibold text-gray-900">{task.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-gray-600">{task.description}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-teal-800">{budgetLabel(task)}</span>
        <span className="text-gray-500">
          {poster ? `by ${poster.name} · ` : ""}
          {offerCount != null ? `${offerCount} offer${offerCount === 1 ? "" : "s"} · ` : ""}
          {dateLabel(task.createdAt)}
        </span>
      </div>
    </Link>
  );
}
