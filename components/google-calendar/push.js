const _ = require("lodash");
const { v4: uuidv4 } = require("uuid")
const googleCalendar = require("https://github.com/PipedreamHQ/pipedream/components/google-calendar/google-calendar.app.js");


module.exports = {
  name: "google-calendar-push",
  version: "0.0.1",
  dedupe: "unique", // Dedupe events based on the Google Calendar event ID
  props: {
    googleCalendar,
    calendarId: {
      type: "string",
      async options() {
        const calListResp = await this.googleCalendar.calendarList();
        const calendars = _.get(calListResp, "data.items");
        if (calendars) {
          const calendarIds = calendars.map((item) => {
            return { value: item.id, label: item.summary };
          });
          return calendarIds;
        }
        return [];
      },
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 5 * 60, // five minutes
      },
    },
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const id = uuidv4()
      const config = {
        calendarId: this.calendarId,
        requestBody: {
          id,
          type: "web_hook",
          address: this.http.endpoint
        }
      }
      console.log(config)
      const resp = await this.googleCalendar.watch(config)
      console.log(resp)
    }
  },
  async run(event) {
    console.log(event)
  },
};
