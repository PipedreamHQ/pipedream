import { axios } from "@pipedream/platform";
import ical2json from "ical2json";
import helper from "./common/helper.mjs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ical",
  propDefinitions: {
    eventUID: {
      type: "string",
      label: "Event UID",
      description: "The UID of the event",
      async options({ $ }) {
        const response = await this.getEvents({
          $,
        });

        return response?.VCALENDAR?.filter(
          (event) => event.VEVENT && event.VEVENT[0].UID,
        ).map((event) => ({
          label: event.VEVENT[0].SUMMARY || event.VEVENT[0].UID,
          value: event.VEVENT[0].UID,
        })) || [];
      },
    },
    calendarProtocol: {
      type: "string",
      label: "Calendar Protocol",
      description: "The protocol for the request, public calendar commonly use `iCal`.`",
      options: constants.CALENDAR_PROTOCOLS,
      default: constants.CALENDAR_PROTOCOLS[0].value,
    },
  },
  methods: {
    getAuth() {
      return {
        username: this.$auth.username,
        password: this.$auth.password,
      };
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this.$auth.url}${path}`,
        auth: this.getAuth(),
        ...args,
        headers: {
          ...args.headers,
          "Content-Type": "text/calendar",
        },
      });
    },
    async _makeRequestIcal({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this.$auth.url}${path}`,
        ...args,
      });
    },
    async getEvents(args = {}) {
      const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
        <c:calendar-query xmlns:c="urn:ietf:params:xml:ns:caldav"
                          xmlns:d="DAV:">
          <d:prop>
            <d:getetag/>
            <c:calendar-data/>
          </d:prop>
          <c:filter>
            <c:comp-filter name="VCALENDAR">
              <c:comp-filter name="VEVENT"/>
            </c:comp-filter>
          </c:filter>
        </c:calendar-query>`;

      const response = await this._makeRequest({
        method: "REPORT",
        path: "/",
        ...args,
        headers: {
          ...args.headers,
          "Content-Type": "application/xml",
          "Depth": "1",
        },
        data: xmlData,
      });

      const sanitazedResponse = helper.caldavToIcs(response);
      return ical2json.convert(sanitazedResponse);
    },
    async getEventsIcal(args = {}) {
      return this._makeRequestIcal({
        path: "",
        ...args,
      });
    },
    async createEvent({
      uid, ...args
    }) {
      return this._makeRequest({
        path: `/${uid}.ics`,
        method: "PUT",
        ...args,
      });
    },
    async updateEvent({
      uid, ...args
    }) {
      return this._makeRequest({
        path: `/${uid}.ics`,
        method: "PUT",
        ...args,
      });
    },
    async deleteEvent({
      uid, ...args
    }) {
      return this._makeRequest({
        path: `/${uid}.ics`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
