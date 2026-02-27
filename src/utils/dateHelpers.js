import { format, parseISO, differenceInDays, isValid } from "date-fns";

export const formatDate = (date, fmt = "MMM d, yyyy") => {
  if (!date) return "—";
  try {
    return format(typeof date === "string" ? parseISO(date) : date, fmt);
  } catch {
    return "—";
  }
};

export const tripDuration = (start, end) => {
  if (!start || !end) return null;
  const d = differenceInDays(parseISO(end), parseISO(start));
  return d >= 0 ? d + 1 : null;
};

export const today = () => format(new Date(), "yyyy-MM-dd");
