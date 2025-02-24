import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "homerun",
  propDefinitions: {
    vacancyId: {
      type: "string",
      label: "Vacancy ID",
      description: "The ID of the vacancy.",
      async options({ page }) {
        const { data } = await this.listVacancies({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value,
          title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    jobApplicationId: {
      type: "string",
      label: "Job Application ID",
      description: "The ID of the job application.",
      async options({ page }) {
        const { data } = await this.listJobApplications({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value,
          personal_info: {
            first_name: firstName,
            last_name: lastName,
            email,
          },
        }) => ({
          label: `${firstName} ${lastName} (${email})`,
          value,
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
        Authorization: `Bearer ${this.$auth.api_key}`,
        ...headers,
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
    listVacancies(args = {}) {
      return this._makeRequest({
        path: "/vacancies",
        ...args,
      });
    },
    listJobApplications(args = {}) {
      return this._makeRequest({
        path: "/job-applications",
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
              perPage: constants.DEFAULT_LIMIT,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const isDateGreaterThanLasDate =
            lastDateAt
              && Date.parse(resource[dateField]) > Date.parse(lastDateAt);

          if (!lastDateAt || isDateGreaterThanLasDate) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
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
