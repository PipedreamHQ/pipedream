import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dayschedule",
  propDefinitions: {
    event: {
      type: "string",
      label: "Event",
      description: "The identifier of an event",
      async options() {
        const events = await this.paginateResources();
        return events?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    page: {
      type: "string",
      label: "Page",
      description: "The identifier of a scheduling page",
      async options({ page }) {
        const limit = constants.DEFAULT_PAGE_LIMIT;
        const params = {
          limit,
          offset: page * limit,
        };
        const { result: pages } = await this.listPages({
          params,
        });
        return pages?.map(({
          page_id, name,
        }) => ({
          label: name,
          value: page_id,
        })) || [];
      },
    },
    schedule: {
      type: "string",
      label: "Schedule",
      description: "The identifier of a schedule",
      async options({ page }) {
        const limit = constants.DEFAULT_PAGE_LIMIT;
        const params = {
          limit,
          offset: page * limit,
        };
        const schedules = await this.listSchedules({
          params,
        });
        return schedules?.map(({
          schedule_id, name,
        }) => ({
          label: name,
          value: schedule_id,
        })) || [];
      },
    },
    locations: {
      type: "string[]",
      label: "Locations",
      description: "An array of locations",
      options: constants.LOCATION_TYPES,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of event",
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "Duration of the event in minutes",
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "The type of event",
      options: constants.EVENT_TYPES,
    },
    questions: {
      type: "string[]",
      label: "Invitee Questions",
      description: "An array of questions to ask invitees of this event",
    },
    skipForm: {
      type: "boolean",
      label: "Skip Registration Form",
      description: "Set to `true` to skip the invitee registration form for quick confirm",
      optional: true,
      default: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dayschedule.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getResource({
      resourceId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/resources/${resourceId}`,
        ...args,
      });
    },
    listResources(args = {}) {
      return this._makeRequest({
        path: "/resources",
        ...args,
      });
    },
    listPages(args = {}) {
      return this._makeRequest({
        path: "/pages",
        ...args,
      });
    },
    listSchedules(args = {}) {
      return this._makeRequest({
        path: "/schedules",
        ...args,
      });
    },
    createResource(args = {}) {
      return this._makeRequest({
        path: "/resources",
        method: "POST",
        ...args,
      });
    },
    updateResource({
      resourceId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/resources/${resourceId}`,
        method: "PUT",
        ...args,
      });
    },
    deleteResource({
      resourceId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/resources/${resourceId}`,
        method: "DELETE",
        ...args,
      });
    },
    async paginateResources({
      params = {}, type = "event", maxResults = 1000,
    } = {}) {
      const results = [];
      let total = 0;
      let count = 0;
      params = {
        ...params,
        limit: constants.DEFAULT_PAGE_LIMIT,
        offset: 0,
      };

      do {
        try {
          const response = await this.listResources({
            params,
          });
          total = response.total;
          count += response.result.length;

          const relevantResources = response.result.filter((resource) => resource.type === type);
          results.push(...relevantResources);
        } catch (e) {
          const {
            statusCode, message,
          } = JSON.parse(e.message);
          if (statusCode === 404 && message === "No resources found") {
            console.log(message);
            break;
          }
          throw new Error(e);
        }

        params.offset += params.limit;
      } while (count < total && results.length < maxResults);

      return results;
    },
  },
};
