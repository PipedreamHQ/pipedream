import calendar from "@googleapis/calendar";
import timezones from "moment-timezone";

export default {
  type: "app",
  app: "google_meet",
  propDefinitions: {
    calendarId: {
      label: "Calendar ID",
      type: "string",
      description: "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
      default: "primary",
      optional: true,
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        if (nextPageToken === false) {
          return [];
        }
        const response = await this.listCalendars({
          pageToken: nextPageToken,
        });
        const options = response.items.map((item) => ({
          label: item.summary,
          value: item.id,
        }));
        return {
          options,
          context: {
            nextPageToken: response.nextPageToken ?? false,
          },
        };
      },
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "Time zone used in the response. Optional. The default is the time zone of the calendar.",
      optional: true,
      options() {
        const timeZonesList = timezones.tz.names().map((timezone) => {
          return {
            label: timezone,
            value: timezone,
          };
        });
        return timeZonesList;
      },
    },
    sendUpdates: {
      label: "Send Updates",
      type: "string",
      description: "Configure whether to send notifications about the event",
      optional: true,
      options: [
        "all",
        "externalOnly",
        "none",
      ],
    },
    sendNotifications: {
      label: "Send Notifications",
      type: "boolean",
      description: "Whether to send notifications about the event update",
      optional: true,
    },
    colorId: {
      label: "Color ID",
      type: "string",
      description: "The color of the event. This is an ID referring to an entry in the event section of the colors definition (see the colors endpoint).",
      optional: true,
      async options() {
        const response = await this.listColors();
        return Object.entries(response.event).map(([
          key,
          value,
        ]) => ({
          label: `Background ${value.background} | Foreground ${value.foreground}`,
          value: key,
        }));
      },
    },
  },
  methods: {
    client() {
      const auth = new calendar.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return calendar.calendar({
        version: "v3",
        auth,
      });
    },
    async requestHandler({
      api, method, args = {},
    }) {
      const {
        returnOnlyData = true,
        ...otherArgs
      } = args;
      try {
        const calendar = this.client();
        const response = await calendar[api][method](otherArgs);
        return returnOnlyData
          ? response.data
          : response;
      } catch (error) {
        console.error(JSON.stringify(error.response?.data, null, 2));
        throw error.response?.data?.error?.message ?? error;
      }
    },
    listCalendars(args = {}) {
      return this.requestHandler({
        api: "calendarList",
        method: "list",
        args,
      });
    },
    listColors(args = {}) {
      return this.requestHandler({
        api: "colors",
        method: "get",
        args,
      });
    },
    getSettings(args = {}) {
      return this.requestHandler({
        api: "settings",
        method: "get",
        args,
      });
    },
    createEvent(args = {}) {
      return this.requestHandler({
        api: "events",
        method: "insert",
        args,
      });
    },
  },
};
