export default {
  key: "google_calendar-get_date_time",
  name: "Get Date Time",
  description: "Get current date and time for use in Google Calendar actions. Useful for agents that need datetime awareness and timezone context before calling other Google Calendar tools.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },

  async run({ $ }) {
    const now = new Date();

    // Date in local timezone (YYYY-MM-DD)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    // Time in local timezone (HH:MM:SS)
    const time = now.toTimeString().split(" ")[0];

    // Timezone (IANA name)
    // eslint-disable-next-line no-undef
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Timezone offset (±HH:MM)
    const tzDate = new Date();
    const tzDateUTC = new Date(tzDate.toLocaleString("en-US", {
      timeZone: "UTC",
    }));
    const diff = (tzDate - tzDateUTC) / 60000;
    const hours = Math.floor(Math.abs(diff) / 60);
    const mins = Math.abs(diff) % 60;
    const offsetSign = diff >= 0 ? "+" : "-";
    const timezoneOffset = `${offsetSign}${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;

    const result = {
      date,
      time,
      timezone,
      timezoneOffset,
      timestamp: now.getTime(),
      isoString: now.toISOString(),
      rfc3339: `${date}T${time}${timezoneOffset}`,
    };

    $.export("$summary", `Retrieved current date time: ${date} ${time} (${timezone} ${timezoneOffset})`);
    return result;
  },
};
