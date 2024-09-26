import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "webinarkit",
  propDefinitions: {
    webinarId: {
      type: "string",
      label: "Webinar ID",
      description: "The ID of the webinar to retrieve.",
      async options() {
        const { results: webinars } = await this.listWebinars();
        return webinars.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    webinarDate: {
      type: "string",
      label: "Date",
      description: "The date of the webinar. If you are passing an arbitrary date/time, make sure it is in the ISO 8601 format. You can learn more about that [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString). Eg: `2022-06-22T02:45:00.000Z`.",
      async options({ webinarId }) {
        const { results: dates } = await this.listWebinarDates({
          webinarId,
        });
        return dates.map(({
          id: value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    listWebinars(args = {}) {
      return this.makeRequest({
        path: "/webinars",
        ...args,
      });
    },
    listWebinarDates({
      webinarId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/webinar/dates/${webinarId}`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let resourcesCount = 0;

      const response = await resourceFn(resourceFnArgs);

      const nextResources = resourceName && response[resourceName] || response;

      if (!nextResources?.length) {
        console.log("No more resources found");
        return;
      }

      for (const resource of nextResources) {
        yield resource;
        resourcesCount += 1;

        if (resourcesCount >= max) {
          return;
        }
      }
    },
  },
};
