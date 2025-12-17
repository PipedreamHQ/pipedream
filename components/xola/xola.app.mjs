import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "xola",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of the user",
      async options() {
        const {
          id: value,
          name: label,
        } = await this.getUser();
        return [
          {
            label,
            value,
          },
        ];
      },
    },
    sellerId: {
      type: "string",
      label: "Seller ID",
      description: "The unique identifier of the seller",
      async options({ page }) {
        const { data } = await this.listSellers({
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return data.map(({
          id: value, name, company,
        }) => ({
          label: company || name,
          value,
        }));
      },
    },
    experienceId: {
      type: "string",
      label: "Experience ID",
      description: "The unique identifier of the experience",
      async options({
        page, sellerId,
      }) {
        try {
          const { data } = await this.listExperiences({
            params: {
              limit: constants.DEFAULT_LIMIT,
              skip: page * constants.DEFAULT_LIMIT,
              seller: sellerId,
            },
          });
          return data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }));

        } catch (error) {
          console.error(error);
          return [];
        }
      },
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The unique identifier of the event",
      async options({
        page, sellerId,
      }) {
        const data = await this.listEvents({
          params: {
            seller: sellerId,
            limit: constants.DEFAULT_LIMIT,
            skip: page * constants.DEFAULT_LIMIT,
          },
        });
        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    scheduleId: {
      type: "string",
      label: "Schedule ID",
      description: "The unique identifier of the schedule",
      async options({ experienceId }) {
        if (!experienceId) {
          return [];
        }
        const experience = await this.getExperience({
          experienceId,
          params: {
            expand: "schedules",
          },
        });
        const schedules = experience?.schedules || [];
        return schedules.map(({
          id: value, name, type,
        }) => ({
          label: name || `${type} schedule`,
          value,
        }));
      },
    },
    guideId: {
      type: "string",
      label: "Guide ID",
      description: "The unique identifier of the guide",
      async options({
        page, sellerId,
      }) {
        const { data } = await this.listGuides({
          sellerId,
          params: {
            limit: constants.DEFAULT_LIMIT,
            skip: page * constants.DEFAULT_LIMIT,
          },
        });
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name for this schedule",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Can be for an open (`available`) schedule or a `blackout` schedule",
      options: [
        "available",
        "blackout",
      ],
    },
    days: {
      type: "string[]",
      label: "Days",
      description: "Days of week",
      optional: true,
      options: [
        {
          label: "Sunday",
          value: "0",
        },
        {
          label: "Monday",
          value: "1",
        },
        {
          label: "Tuesday",
          value: "2",
        },
        {
          label: "Wednesday",
          value: "3",
        },
        {
          label: "Thursday",
          value: "4",
        },
        {
          label: "Friday",
          value: "5",
        },
        {
          label: "Saturday",
          value: "6",
        },
      ],
    },
    departure: {
      type: "string",
      label: "Departure",
      description: "Whether departure time is fixed or varies",
      options: [
        "fixed",
        "varies",
      ],
      optional: true,
    },
    times: {
      type: "string[]",
      label: "Times",
      description: "Start times in HHMM format (e.g., `900` = 9:00 AM, `1400` = 2:00 PM, `1800` = 6:00 PM).",
      options: [
        {
          label: "9:00 AM",
          value: "900",
        },
        {
          label: "2:00 PM",
          value: "1400",
        },
        {
          label: "6:00 PM",
          value: "1800",
        },
      ],
      optional: true,
    },
    priceDelta: {
      type: "string",
      label: "Price Delta",
      description: "Price adjustment for this schedule (can be positive or negative). Only available when **Type** is `available`",
      optional: true,
    },
    repeat: {
      type: "string",
      label: "Repeat",
      description: "When and how the schedule should repeat. Options are `weekly` (repeat the same schedule every week until **End**, if specified), or custom, which can be used in conjunction with **Dates** to specify individual days for the schedule to run",
      optional: true,
      options: [
        "weekly",
        "custom",
      ],
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start date of the schedule in ISO 8601 format. Example: `2024-01-01T00:00:00Z`",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "End date of the schedule in ISO 8601 format. Example: `2024-12-31T23:59:59Z`",
      optional: true,
    },
    dates: {
      type: "string[]",
      label: "Dates",
      description: "Specific dates when this schedule applies. Only available when **Repeat** is `custom`. Format is `YYYY-MM-DD`. Cannot be combined with **End**.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      const { api_url: apiUrl } = this.$auth;
      return `${apiUrl}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        "x-api-key": this.$auth.api_key,
        "x-api-version": constants.API_VERSION,
        ...headers,
      };
    },
    makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...opts,
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "PUT",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listExperiences(args = {}) {
      return this.makeRequest({
        path: "/experiences",
        ...args,
      });
    },
    getExperience({
      experienceId, ...args
    }) {
      return this.makeRequest({
        path: `/experiences/${experienceId}`,
        ...args,
      });
    },
    listGuides({
      sellerId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/sellers/${sellerId}/guides`,
        ...args,
      });
    },
    listEvents(args = {}) {
      return this.makeRequest({
        path: "/events",
        ...args,
      });
    },
    listSellers(args = {}) {
      return this.makeRequest({
        path: "/sellers",
        ...args,
      });
    },
    listPurchases(args = {}) {
      return this.makeRequest({
        path: "/purchases",
        ...args,
      });
    },
    createExperienceSchedule({
      experienceId, ...args
    }) {
      return this.post({
        path: `/experiences/${experienceId}/schedules`,
        ...args,
      });
    },
    updateExperienceSchedule({
      experienceId, scheduleId, ...args
    }) {
      return this.put({
        path: `/experiences/${experienceId}/schedules/${scheduleId}`,
        ...args,
      });
    },
    deleteExperienceSchedule({
      experienceId, scheduleId, ...args
    }) {
      return this.delete({
        path: `/experiences/${experienceId}/schedules/${scheduleId}`,
        ...args,
      });
    },
    patchEvent({
      eventId, ...args
    }) {
      return this.patch({
        path: `/events/${eventId}`,
        ...args,
      });
    },
    addEventGuide({
      eventId, ...args
    }) {
      return this.post({
        path: `/events/${eventId}/guides`,
        ...args,
      });
    },
    removeEventGuide({
      eventId, guideId, ...args
    }) {
      return this.delete({
        path: `/events/${eventId}/guides/${guideId}`,
        ...args,
      });
    },
    getUser({
      userId = "me", ...args
    } = {}) {
      return this.makeRequest({
        path: `/users/${userId}`,
        ...args,
      });
    },
  },
};
