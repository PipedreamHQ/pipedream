// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ashby_job_postings_api",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return constants.BASE_URL;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        ...args,
      });
    },
    listJobPostings({
      $, boardName, params,
    }) {
      return this._makeRequest({
        $,
        path: `/job-board/${boardName}`,
        params,
      });
    },
  },
};