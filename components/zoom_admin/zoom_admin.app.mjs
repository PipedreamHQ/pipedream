/* eslint-disable camelcase */
import axios from "axios";
import get from "lodash/get.js";
import sortBy from "lodash/sortBy.js";
import zoomCountries from "./zoom_countries.mjs";

export default {
  type: "app",
  app: "zoom_admin",
  propDefinitions: {
    meeting: {
      type: "string",
      label: "Meeting",
      description: "The ID of the meeting",
      async options({ page }) {
        const meetings = await this.listMeetings(page + 1);
        return meetings.map((meeting) => ({
          label: meeting.topic,
          value: {
            label: meeting.topic,
            value: meeting.id,
          },
        }));
      },
    },
    occurrenceId: {
      type: "string",
      label: "Occurrence ID",
      description: "Provide this field to view meeting details of a particular occurrence of the [recurring meeting](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings).",
      optional: true,
      async options({ meeting }) {
        if (!meeting) {
          return [];
        }
        const occurrences = await this.listMeetingsOccurrences(get(meeting, "value", meeting));
        return occurrences.map((occurrence) => ({
          label: `${occurrence.start_time} (${occurrence.status})`,
          value: occurrence.occurrence_id,
        }));
      },
    },
    locationId: {
      type: "string",
      label: "LocationId",
      description: "Location ID of the lowest level location in the (location hierarchy)[https://support.zoom.us/hc/en-us/articles/115000342983-Zoom-Rooms-Location-Hierarchy] where the Zoom Room is to be added. For instance if the structure of the location hierarchy is set up as “country, states, city, campus, building, floor”, a room can only be added under the floor level location.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Registrant’s country. The value of this field must be in two-letter abbreviated form and must match the ID field provided in the [Countries](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#countries) table.",
      optional: true,
      options: zoomCountries,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of records returned within a single API call. Defaults to `30`",
      optional: true,
      min: 1,
      max: 300,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "The page number of the current page in the returned records.",
      optional: true,
      min: 1,
    },
    nextPageToken: {
      type: "string",
      label: "Next Page Token",
      description: "The next page token is used to paginate through large result sets. A next page token will be returned whenever the set of available results exceeds the current page size. The expiration period for this token is 15 minutes.",
      optional: true,
    },
    webinars: {
      type: "string[]",
      label: "Webinars",
      optional: true,
      description:
        "Webinars you want to watch for new events. **Leave blank to watch all webinars**.",
      async options({ nextPageToken }) {
        const {
          webinars,
          next_page_token,
        } = await this.listWebinars({
          nextPageToken,
        });
        if (!webinars.length) {
          return [];
        }
        const rawOptions = webinars.map((w) => ({
          label: w.topic,
          value: w.id,
        }));
        const options = sortBy(rawOptions, [
          "label",
        ]);

        return {
          options,
          context: {
            nextPageToken: next_page_token,
          },
        };
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.zoom.us/v2";
    },
    _getHeaders() {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "user-agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    _getAxiosParams(opts = {}) {
      console.log(opts);
      return {
        ...opts,
        url: this._apiUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers["Accept"] = "application/json";
      opts.headers["Content-Type"] = "application/json";
      opts.headers["Authorization"] = `Bearer ${this.$auth.oauth_access_token}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      // eslint-disable-next-line multiline-ternary
      opts.url = `${this._apiUrl()}${path[0] === "/" ? "" : "/"}${path}`;
      return await axios(opts);
    },
    async listMeetings(pageNumber) {
      const res = await this._makeRequest({
        path: "/users/me/meetings",
        params: {
          page_size: 30,
          page_number: pageNumber,
        },
      });
      if (pageNumber > get(res, ("data.page_count"))) {
        return [];
      }
      return get(res, "data.meetings", []);
    },
    async listMeetingsOccurrences(meetingId) {
      const res = await this._makeRequest({
        path: `/meetings/${meetingId}`,
      });

      return get(res, "data.occurrences", []);
    },
    async listWebinars({
      pageSize,
      nextPageToken,
    }) {
      const { data } = await this._makeRequest({
        path: "/users/me/webinars",
        params: {
          page_size: pageSize || 300,
          next_page_token: nextPageToken,
        },
      });
      return data;
    },
    async listWebinarPanelists(webinarID) {
      const { data } = await this._makeRequest({
        path: `/webinars/${webinarID}/panelists`,
      });
      return data;
    },
  },
};
