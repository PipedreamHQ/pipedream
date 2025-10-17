import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "xola",
  propDefinitions: {
    experienceId: {
      type: "string",
      label: "Experience ID",
      description: "The unique identifier of the experience",
      async options({ page }) {
        const { data } = await this.listExperiences({
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
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The unique identifier of the event",
      async options({ page }) {
        const { data } = await this.listEvents({
          params: {
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
    },
    guideId: {
      type: "string",
      label: "Guide ID",
      description: "The unique identifier of the guide",
      async options({ page }) {
        const { data } = await this.listGuides({
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
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of the user. If not provided, will use the authenticated user's ID.",
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
    listGuides(args = {}) {
      return this.makeRequest({
        path: "/guides",
        ...args,
      });
    },
    listEvents(args = {}) {
      return this.makeRequest({
        path: "/events",
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
    createWebhook({
      userId, ...args
    }) {
      return this.post({
        path: `/users/${userId}/hooks`,
        ...args,
      });
    },
    deleteWebhook({
      userId, hookId, ...args
    }) {
      return this.delete({
        path: `/users/${userId}/hooks/${hookId}`,
        ...args,
      });
    },
  },
};
