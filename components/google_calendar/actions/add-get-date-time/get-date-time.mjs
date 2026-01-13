import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-get_date_time",
  name: "Get Date Time",
  description: "Get current date and time...",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    googleCalendar, 
  },
  async run({ $ }) {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const result = {
      date,        
      time,        
      timezone,    
      timestamp: now.getTime(),
      isoString: now.toISOString(),
    };
    
    $.export("$summary", `Retrieved current date time: ${date} ${time}`);
    return result;
  },
};
