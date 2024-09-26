import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "qualaroo",
  propDefinitions: {
    survey: {
      type: "string",
      label: "Survey",
      description: "The ID of a survey",
      async options({ prevContext }) {
        const offset = prevContext?.nextOffset ?? 0;
        const limit = constants.ASYNC_OPTIONS_LIMIT;

        const surveys = await this.listSurveys({
          params: {
            offset,
            limit,
          },
        });

        return {
          options: surveys.map((survey) => ({
            label: survey.name,
            value: survey.id,
          })),
          context: {
            nextOffset: offset + limit,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.qualaroo.com/api/v1";
    },
    _auth() {
      return {
        auth: {
          username: this.$auth.api_key,
          password: this.$auth.api_secret,
        },
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        ...this._auth(),
        url: this._baseUrl() + path,
      });
    },
    async listSurveys(opts = {}) {
      return this._makeRequest({
        path: "/nudges",
        ...opts,
      });
    },
    async listSurveyResponses({
      paginate = false, survey, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          fn: this.listSurveyResponses,
          survey,
          ...opts,
        });
      }
      return this._makeRequest({
        path: `/nudges/${survey}/responses`,
        ...opts,
      });
    },
    async paginate({
      fn, ...opts
    }) {
      let offset = 0;
      const limit = constants.MAX_LIMIT;
      const data = [];

      while (true) {
        const response = await fn.call(this, {
          ...opts,
          params: {
            ...opts.params,
            limit,
            offset,
          },
        });

        if (response.length === 0) {
          return data;
        }

        data.push(...response);
        offset += limit;
      }
    },
  },
};
