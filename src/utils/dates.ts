export interface DateEntry {
  date: string;
  day: string;
  num: number;
}

export function generateUpcomingDates(count = 7): DateEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en", { weekday: "short" }),
      num: d.getDate(),
    };
  });
}

export function formatDateLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
