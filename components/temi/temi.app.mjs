import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "temi",
  propDefinitions: {
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "Media URL link from popular services like **YouTube**, **Vimeo**, **Dropbox** and **Facebook**.",
    },
    metadata: {
      type: "string",
      label: "Metadata",
      description: "Optional medatada text to filter out jobs.",
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    async makeRequest({
      step = this, path, headers, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      };

      return axios(step, config);
    },
    getJobs(args = {}) {
      return this.makeRequest({
        path: "/jobs",
        ...args,
      });
    },
    submitJob(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/jobs",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      limit = constants.DEFAULT_PAGE_LIMIT,
      max = constants.DEFAULT_MAX_ITEMS,
      lastDateTime,
    }) {
      let startingAfter;
      let resourcesCount = 0;

      while (true) {
        const nextResources =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              limit,
              starting_after: startingAfter,
              ...resourceFnArgs?.params,
            },
          });

        if (!nextResources.length) {
          console.log("No more records to fetch.");
          return;
        }

        startingAfter = nextResources[nextResources.length - 1]?.id;

        for (const resource of nextResources) {
          resourcesCount += 1;

          if (lastDateTime && Date.parse(lastDateTime) === Date.parse(resource.created_on)) {
            console.log("No more records to fetch because of last created date time.");
            return;
          }

          yield resource;
        }

        if (!startingAfter || resourcesCount >= max) {
          return;
        }
      }
    },
  },
};
