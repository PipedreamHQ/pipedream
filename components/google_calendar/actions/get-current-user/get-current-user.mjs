import googleCalendar from "../../google_calendar.app.mjs";
import constants from "../../common/constants.mjs";

const DEFAULT_CALENDAR_SAMPLE_LIMIT = 25;

export default {
  key: "google_calendar-get-current-user",
  name: "Get Current User",
  description: "Retrieve information about the authenticated Google Calendar account, including the primary calendar (summary, timezone, ACL flags), a list of accessible calendars, user-level settings (timezone, locale, week start), and the color palette that controls events and calendars. Ideal for confirming which calendar account is in use, customizing downstream scheduling, or equipping LLMs with the user’s context (timezones, available calendars) prior to creating or updating events. [See the documentation](https://developers.google.com/calendar/api/v3/reference/calendars/get).",
  version: "0.0.2",
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
    const [
      primaryCalendar,
      calendarList,
      settings,
      colors,
    ] = await Promise.all([
      this.googleCalendar.getCalendar({
        calendarId: "primary",
      }),
      this.googleCalendar.listCalendars({
        maxResults: DEFAULT_CALENDAR_SAMPLE_LIMIT,
      }),
      this.googleCalendar.requestHandler({
        api: constants.API.SETTINGS.NAME,
        method: constants.API.SETTINGS.METHOD.LIST,
      }),
      this.googleCalendar.requestHandler({
        api: constants.API.COLORS.NAME,
        method: constants.API.COLORS.METHOD.GET,
      }),
    ]);

    const timezoneSetting = settings?.items?.find?.((setting) => setting.id === "timezone")?.value;
    const localeSetting = settings?.items?.find?.((setting) => setting.id === "locale")?.value;

    const summaryName = primaryCalendar?.summary || primaryCalendar?.id;
    $.export("$summary", `Retrieved Google Calendar user ${summaryName}`);

    return {
      primaryCalendar,
      calendars: calendarList?.items ?? [],
      settings: settings?.items ?? [],
      timezone: timezoneSetting || primaryCalendar?.timeZone,
      locale: localeSetting,
      colors,
    };
  },
};
