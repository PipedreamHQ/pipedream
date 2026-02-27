/* eslint-disable camelcase */
import { axios } from "@pipedream/platform";
import flatten from "lodash/flatten.js";
import get from "lodash/get.js";
import sortBy from "lodash/sortBy.js";
import { doubleEncode } from "./common/utils.mjs";
import consts from "./consts.mjs";
import zoomCountries from "./zoom_countries.mjs";

export default {
  type: "app",
  app: "zoom_admin",
  propDefinitions: {
    cloudRecording: {
      type: "string",
      label: "Recording",
      description: "The ID of the cloud recording. Please use a valid object with `meetingId` and `value` with \"Structured Mode\" disabled. `value` means the recording ID. (Eg. `{ label: \"example\", value: { meetingId:123, value:123 } }`)",
      withLabel: true,
      async options({
        page,
        prevContext,
      }) {
        const pageNumber = page + 1;
        const data = await this.listUserRecordings(
          prevContext.nextPageToken,
          pageNumber,
        );

        if (!data.meetings || pageNumber > data?.page_count) {
          return [];
        }
        const options = [];
        data.meetings.forEach((meeting) => {
          meeting.recording_files.forEach((recording) => {
            const label = `${meeting.topic} - (Format: ${recording.file_type}) (From ${recording.recording_start} to ${recording.recording_end})`;
            options.push({
              label,
              value: {
                meetingId: meeting.id,
                id: recording.id,
              },
            });
          });
        });

        return {
          options,
          context: {
            nextPageToken: data.next_page_token,
          },
        };
      },
    },
    meeting: {
      type: "string",
      label: "Meeting",
      description: "The meeting ID or meeting topic",
      withLabel: true,
      async options({
        prevContext,
        page,
      }) {
        if (!prevContext.nextPageToken && page > 0) {
          return [];
        }
        const data = await this.listMeetings(
          {},
          prevContext.nextPageToken,
        );
        return {
          options: data?.meetings.map((meeting) => ({
            label: meeting.topic,
            value: meeting.id,
          })),
          context: {
            nextPageToken: data.next_page_token,
          },
        };
      },
    },
    panelist: {
      type: "string",
      label: "Panelist",
      description: "The panelist ID or panelist email",
      withLabel: true,
      async options({
        webinar,
        page,
        prevContext,
      }) {
        if (!webinar) {
          return [];
        }
        try {
          if (!prevContext.nextPageToken && page > 0) {
            return [];
          }
          const data = await this.listWebinarPanelists(get(webinar, "value", webinar), prevContext.nextPageToken);
          return {
            options: data?.panelists.map((panelist) => ({
              label: `${panelist.name} <${panelist.email}>`,
              value: panelist.id,
            })),
            context: {
              nextPageToken: data.next_page_token,
            },
          };
        } catch {
          return [];
        }
      },
    },
    occurrence: {
      type: "string",
      label: "Occurrence ID",
      description: "Provide this field to view meeting details of a particular occurrence of a [recurring meeting](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings).",
      optional: true,
      async options({
        meeting,
        isWebinar,
      }) {
        if (!meeting) {
          return [];
        }
        const occurrences = await this.listMeetingsOccurrences(
          get(meeting, "value", meeting),
          isWebinar,
        );
        return occurrences.map((occurrence) => ({
          label: `${occurrence.start_time} (${occurrence.status})`,
          value: occurrence.occurrence_id,
        }));
      },
    },
    registrants: {
      type: "string[]",
      label: "Registrants",
      description: "Disable \"Structured Mode\", to pass an array of objects with `id` and `email` (e.g., `[ { id: 123, email: \"123@mail.com\" } ]`).",
      async options({
        page,
        meeting,
        occurrenceId,
        isWebinar,
      }) {
        const promises = consts.REGISTRANT_STATUSES_OPTIONS.map((status) => (
          this.listMeetingOrWebinarRegistrants(
            get(meeting, "value", meeting),
            occurrenceId,
            page + 1,
            status,
            isWebinar,
          )
        ));

        const registrantsPromisesResult = await Promise.all(promises);
        const registrants = flatten(registrantsPromisesResult);

        return registrants.map((registrant) => ({
          label: `${registrant.first_name} <${registrant.email}> (${registrant.status})`,
          value: {
            email: registrant.email,
            id: registrant.id,
          },
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
      description: "The number of records returned within a single API call (defaults to `30`).",
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
    webinar: {
      type: "string",
      label: "Webinar",
      description: "The webinar ID or webinar topic",
      optional: true,
      withLabel: true,
      async options({
        prevContext,
        page,
      }) {
        if (!prevContext.nextPageToken && page > 0) {
          return [];
        }

        const {
          webinars,
          next_page_token: nextPageToken,
        } = await this.listWebinars(30, prevContext.nextPageToken);
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
            nextPageToken,
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
      return {
        ...opts,
        url: this._apiUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async _makeRequest({
      $ = this, ...opts
    }) {
      return axios($, this._getAxiosParams({
        ...opts,
        returnFullResponse: true,
      }));
    },
    async listMeetingsOccurrences(meetingId, isWebinar) {
      try {
        meetingId = doubleEncode(meetingId);
        const path = isWebinar
          ? `/webinars/${meetingId}`
          : `/meetings/${meetingId}`;
        const res = await this._makeRequest({
          path,
        });
        return get(res, "data.occurrences", []);
      } catch {
        return [];
      }
    },
    async listWebinars(pageSize, nextPageToken) {
      const { data } = await this._makeRequest({
        path: "/users/me/webinars",
        params: {
          page_size: pageSize || 300,
          next_page_token: nextPageToken,
        },
      });
      return data;
    },
    listAccountCallLogs(nextPageToken) {
      return this._makeRequest({
        path: "/phone/call_history",
        params: {
          next_page_token: nextPageToken,
        },
      });
    },
    async listWebinarPanelists(webinarID, nextPageToken) {
      const { data } = await this._makeRequest({
        path: `/webinars/${doubleEncode(webinarID)}/panelists`,
        params: {
          page_size: 100,
          next_page_token: nextPageToken,
        },
      });
      return data;
    },
    async listMeetingOrWebinarRegistrants(meetingId, occurrenceId, pageNumber, status, isWebinar) {
      meetingId = doubleEncode(meetingId);
      const path = isWebinar
        ? `/webinars/${meetingId}/registrants`
        : `/meetings/${meetingId}/registrants`;
      try {
        const res = await this._makeRequest({
          path,
          params: {
            occurrence_id: occurrenceId,
            page_size: 30,
            page_number: pageNumber,
            status,
          },
        });

        if (pageNumber > get(res, ("data.page_count"))) {
          return [];
        }

        return get(res, "data.registrants", []);
      } catch (err) {
        return [];
      }
    },
    async listUserRecordings(nextPageToken) {
      const res = await this._makeRequest({
        path: "/users/me/recordings",
        params: {
          page_size: 100,
          next_page_token: nextPageToken,
        },
      });
      return get(res, "data");
    },
    async listWebinarParticipants(webinarID, nextPageToken) {
      const { data } = await this._makeRequest({
        path: `/past_webinars/${doubleEncode(webinarID)}/participants`,
        params: {
          page_size: 100,
          next_page_token: nextPageToken,
        },
      });
      return data;
    },
    async listCloudRecordings(params, nextPageToken) {
      const { data } = await this._makeRequest({
        path: "/users/me/recordings",
        params: {
          page_size: 100,
          next_page_token: nextPageToken,
          ...params,
        },
      });
      return data;
    },
    async listUserCloudRecordings(userId, params) {
      const { data } = await this._makeRequest({
        path: `/users/${userId}/recordings`,
        params: {
          page_size: 100,
          ...params,
        },
      });
      return data;
    },
    async listMeetingRegistrants(meetingId, params, nextPageToken) {
      const { data } = await this._makeRequest({
        path: `/meetings/${doubleEncode(meetingId)}/registrants`,
        params: {
          page_size: 100,
          next_page_token: nextPageToken,
          ...params,
        },
      });
      return data;
    },
    async listMeetings(params, nextPageToken) {
      const { data } = await this._makeRequest({
        path: "/users/me/meetings",
        params: {
          page_size: 100,
          next_page_token: nextPageToken,
          ...params,
        },
      });
      return data;
    },
    async listWebinarRegistrants(webinarId, params, nextPageToken) {
      const { data } = await this._makeRequest({
        path: `/webinars/${doubleEncode(webinarId)}/registrants`,
        params: {
          page_size: 100,
          next_page_token: nextPageToken,
          ...params,
        },
      });
      return data;
    },
    async listUsers(params, nextPageToken) {
      const { data } = await this._makeRequest({
        path: "/users",
        params: {
          page_size: 100,
          next_page_token: nextPageToken,
          ...params,
        },
      });
      return data;
    },
    async listPastMeetingParticipants(meetingId, nextPageToken) {
      const { data } = await this._makeRequest({
        path: `/past_meetings/${doubleEncode(meetingId)}/participants`,
        params: {
          page_size: 100,
          next_page_token: nextPageToken,
        },
      });
      return data;
    },
    async listMeetingRecordings(meetingId, params, nextPageToken) {
      const { data } = await this._makeRequest({
        path: `/meetings/${doubleEncode(meetingId)}/recordings`,
        params: {
          page_size: 100,
          next_page_token: nextPageToken,
          ...params,
        },
      });
      return data;
    },
    getMeetingSummary({
      meetingId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/meetings/${doubleEncode(meetingId)}/meeting_summary`,
        ...opts,
      });
    },
    getMeetingSummaries(opts = {}) {
      return this._makeRequest({
        path: "/meetings/meeting_summaries",
        ...opts,
      });
    },
    listAllRecordings({
      userId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/users/${userId || "me"}/recordings`,
        ...opts,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max,
    } = {}) {
      let nextPageToken;
      let resourcesCount = 0;

      while (true) {
        const { data: response } = await resourceFn({
          ...resourceFnArgs,
          params: {
            ...resourceFnArgs.params,
            next_page_token: nextPageToken,
          },
        });

        const nextResources = response[resourceName];

        if (!nextResources?.length) {
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (max && resourcesCount >= max) {
            return;
          }
        }

        nextPageToken = response.next_page_token;
        if (!nextPageToken) {
          return;
        }
      }
    },
  },
};
