import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "linearb",
  propDefinitions: {
    repoUrl: {
      type: "string",
      label: "Repository URL",
      description: "The git repository URL ending with .git",
      pattern: "^https://[a-zA-Z0-9./+^@_-]{15,250}\\.git$",
    },
    refName: {
      type: "string",
      label: "Reference Name",
      description: "Ref name of the release, accepts any Git ref (i.e., commit short or long SHA/tag name)",
      pattern: "^[a-zA-Z0-9._-]*$",
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "The deployment or custom pre-deployment stage occurred at this specific time (timestamp ISO 8601 format)",
      optional: true,
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "The key of the custom pre-deployment stage (lowercase only)",
      optional: true,
      pattern: "^[a-z]+$",
    },
    services: {
      type: "string[]",
      label: "Services",
      description: "The list of LinearB services names monitoring this (lowercase only)",
      optional: true,
      pattern: "^[a-z]+$",
    },
    issueData: {
      type: "object",
      label: "Issue Data",
      description: "The data for the issue to be sent to GitHub",
    },
    githubRepo: {
      type: "string",
      label: "GitHub Repository",
      description: "The GitHub repository to send the issue to",
    },
    githubToken: {
      type: "string",
      label: "GitHub Token",
      description: "The GitHub token for authentication",
      secret: true,
    },
    data: {
      type: "object",
      label: "Data",
      description: "The data to report to other apps",
    },
    destinationUrl: {
      type: "string",
      label: "Destination URL",
      description: "The URL of the app to report the data to",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.linearb.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async createDeployment({
      repoUrl, refName, timestamp, stage, services,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/deployments",
        data: {
          repo_url: repoUrl,
          ref_name: refName,
          ...(timestamp && {
            timestamp,
          }),
          ...(stage && {
            stage,
          }),
          ...(services && {
            services,
          }),
        },
      });
    },
    async sendIssueToGitHub({
      issueData, githubRepo, githubToken,
    }) {
      return axios(this, {
        method: "POST",
        url: `https://api.github.com/repos/${githubRepo}/issues`,
        headers: {
          "Authorization": `token ${githubToken}`,
          "Accept": "application/vnd.github.v3+json",
        },
        data: issueData,
      });
    },
    async reportDataToOtherApps({
      data, destinationUrl,
    }) {
      return axios(this, {
        method: "POST",
        url: destinationUrl,
        data,
      });
    },
    // Additional methods to emit events for deploy, merge, pickup, pull request, review can be added here.
  },
  version: "0.0.{{ts}}",
};
