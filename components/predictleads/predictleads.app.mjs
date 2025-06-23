import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "predictleads",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the company to lookup (e.g., `google.com`).",
    },
    technologyId: {
      type: "string",
      label: "Technology",
      description: "Select a technology to search for.",
      async options({ page }) {
        const { data: technologies } = await this.retrieveTechnologies({
          params: {
            page,
            limit: 100,
          },
        });
        return technologies.map(({
          id: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://predictleads.com/api/v3${path}`;
    },
    getHeaders(headers) {
      return {
        "X-Api-Key": this.$auth.api_key,
        "X-Api-Token": this.$auth.api_token,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...args,
      });
    },
    retrieveCompany({
      domain, ...args
    } = {}) {
      return this._makeRequest({
        path: `/companies/${domain}`,
        ...args,
      });
    },
    retrieveTechnologies(args = {}) {
      return this._makeRequest({
        path: "/technologies",
        ...args,
      });
    },
    retrieveCompaniesByTechnology({
      technologyId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/discover/technologies/${technologyId}/technology_detections`,
        ...args,
      });
    },
    retrieveJobOpenings({
      domain, ...args
    } = {}) {
      return this._makeRequest({
        path: `/companies/${domain}/job_openings`,
        ...args,
      });
    },
    retrieveNewsEvents({
      domain, ...args
    } = {}) {
      return this._makeRequest({
        path: `/companies/${domain}/news_events`,
        ...args,
      });
    },
    retrieveTechnologyDetections({
      domain, ...args
    } = {}) {
      return this._makeRequest({
        path: `/companies/${domain}/technology_detections`,
        ...args,
      });
    },
    retrieveFinancingEvents({
      domain, ...args
    } = {}) {
      return this._makeRequest({
        path: `/companies/${domain}/financing_events`,
        ...args,
      });
    },
    async *getIterations({
      resourceFn,
      resourceFnArgs,
      max = 300,
    }) {
      let page = 1;
      let resourcesCount = 0;
      const limit = 100;

      while (true) {
        const response = await resourceFn({
          ...resourceFnArgs,
          params: {
            ...resourceFnArgs?.params,
            page,
            limit,
          },
        });

        const resources = response.data;

        if (!resources?.length) {
          console.log("No resources found");
          return;
        }

        for (const resource of resources) {
          yield resource;
          resourcesCount += 1;
          if (resourcesCount >= max) {
            console.log("Max resources reached");
            return;
          }
        }

        if (page * limit > response.meta.count) {
          console.log("Page limit reached");
          return;
        }

        page += 1;
      }
    },
    async paginate(args) {
      const resources = [];
      for await (const resource of this.getIterations(args)) {
        resources.push(resource);
      }
      return resources;
    },
  },
};
