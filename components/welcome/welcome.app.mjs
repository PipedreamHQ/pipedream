import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";
import timeZones from "./common/time-zones.mjs";

export default {
  type: "app",
  app: "welcome",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the event.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the event.",
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the event. Eg `2024-08-15T22:34:58.692Z`.",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the event. Eg `2024-08-15T22:34:58.692Z`.",
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The time zone of the event.",
      options: timeZones,
    },
    data: {
      type: "object",
      label: "Event Data",
      description: "The data for creating or updating an event. This should be an object containing the event fields.",
      optional: true,
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The unique identifier for the event.",
      async options({ page }) {
        const { events } =
          await this.listEvents({
            params: {
              page: page + 1,
              per_page: constants.DEFAULT_LIMIT,
            },
          });
        return events.map(({
          id, name: label,
        }) => ({
          label,
          value: String(id),
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Accept": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    listEvents(args = {}) {
      return this._makeRequest({
        path: "/events",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      lastDateAt, dateField,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              page,
              per_page: constants.DEFAULT_LIMIT,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const isDateGreater =
            lastDateAt
              && Date.parse(resource[dateField]) >= Date.parse(lastDateAt);

          if (!lastDateAt || isDateGreater) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page");
          return;
        }

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
