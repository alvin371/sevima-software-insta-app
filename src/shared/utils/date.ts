import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "now",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1w",
    MM: "%dw",
    y: "1y",
    yy: "%dy",
  },
});

export function timeAgo(date: string | Date): string {
  return dayjs(date).fromNow();
}

export function formatDate(date: string | Date, format = "MMMM D, YYYY"): string {
  return dayjs(date).format(format);
}

export function formatTimestamp(date: string | Date): string {
  const d = dayjs(date);
  const now = dayjs();
  if (now.diff(d, "day") < 7) return d.fromNow();
  if (now.diff(d, "year") < 1) return d.format("MMM D");
  return d.format("MMM D, YYYY");
}
