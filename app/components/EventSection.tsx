import EventCard, { isFinished } from "./EventCard";
import { SectionHeader } from "./ui/SectionHeader";
import CardGrid from "./ui/CardGrid";
import EmptyState from "./ui/EmptyState";
import type { SportEvent } from "~/api/sportsdb/sportsdb-schema";

export default function EventSection({
  title,
  events,
  showLeague = false,
  emptyMessage,
  cols = 2,
}: {
  title: string;
  events: SportEvent[];
  showLeague?: boolean;
  emptyMessage?: string;
  cols?: 2 | 3;
}) {
  return (
    <section>
      <SectionHeader title={title} />
      {events.length > 0 ? (
        <CardGrid cols={cols}>
          {events.map((event) => (
            <EventCard key={event.idEvent} event={event} showLeague={showLeague} />
          ))}
        </CardGrid>
      ) : (
        <EmptyState
          title={`No ${title.toLowerCase()}`}
          message={emptyMessage ?? "Nothing to show in this section."}
        />
      )}
    </section>
  );
}

export { isFinished };
