const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n: number) => String(n).padStart(2, "0");
const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = () => isoOf(new Date());

export const addDaysISO = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return isoOf(d);
};

export const shortDay = (isoDate: string) =>
  DAY_NAMES[new Date(`${isoDate}T00:00:00`).getDay()];

export const prettyDate = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export const prettyShort = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
