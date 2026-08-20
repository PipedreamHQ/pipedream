// x-pd-ai: optimized
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ashby_job_postings_api",
  propDefinitions: {
    includeCompensation: {
      type: "boolean",
      label: "Include Compensation",
      description: "Set to `true` to include each posting's `compensation` object (tier summary and pay range breakdown) in the response. Defaults to `false`.",
      optional: true,
    },
    jobUrl: {
      type: "string",
      label: "Job URL",
      description: "The exact public URL of one specific job posting, e.g. `https://jobs.ashbyhq.com/Ashby/f050b8c1-243f-4841-b47e-e13cd2a49af0`. Use **List Job Postings** to find the `jobUrl` of the posting you want.",
    },
  },
  methods: {
    _baseUrl() {
      return constants.BASE_URL;
    },
    _boardName() {
      const { job_board_name: boardName } = this.$auth;
      if (!boardName) {
        throw new ConfigurationError("Board Name is required. Configure the **Board Name** field when connecting your Ashby Job Postings account.");
      }
      return boardName;
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
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: `/job-board/${this._boardName()}`,
        params,
      });
    },
  },
};
