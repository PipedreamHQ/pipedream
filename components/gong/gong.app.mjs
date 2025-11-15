import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "gong",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The id of the user.",
      async options({ prevContext }) {
        const { cursor } = prevContext;
        if (cursor === null) {
          return [];
        }

        const {
          records,
          users,
        } = await this.listUsers({
          params: {
            cursor,
          },
        });

        const options = users.map(({
          id: value, firstName, lastName,
        }) => ({
          label: `${firstName} ${lastName}`.trim(),
          value,
        }));

        return {
          options,
          context: {
            cursor: records.cursor || null,
          },
        };
      },
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The id of the workspace.",
      async options() {
        const { workspaces } = await this.listWorkspaces();
        return workspaces.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    fromDateTime: {
      type: "string",
      label: "From Date Time",
      description: "Date and time (in ISO-8601 format: `2018-02-18T02:30:00-07:00` or `2018-02-18T08:00:00Z`, where Z stands for UTC) from which to list recorded calls. Returns calls that started on or after the specified date and time. If not provided, list starts with earliest call.",
    },
    toDateTime: {
      type: "string",
      label: "To Date Time",
      description: "Date and time (in ISO-8601 format: `2018-02-18T02:30:00-07:00` or `2018-02-18T08:00:00Z`, where Z stands for UTC) until which to list recorded calls. Returns calls that started up to but excluding specified date and time. If not provided, list ends with most recent call.",
    },
    callIds: {
      type: "string[]",
      label: "Call IDs",
      description: "List of calls Ids to be filtered. If not supplied, returns all calls between **From Date Time** and **To Date Time**.",
      optional: true,
      async options() {
        const { calls } = await this.listCalls();
        return calls.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    exportSummary(step) {
      if (!step?.export) {
        throw new ConfigurationError("The summary method should be bind to the step object aka `$`");
      }
      return (msg = "") => step.export(constants.SUMMARY_LABEL, msg);
    },
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    async makeRequest({
      step = this, path, headers, summary, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      };

      const response = await axios(step, config);

      if (typeof summary === "function") {
        this.exportSummary(step)(summary(response));
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this.makeRequest({
        path: "/users",
        ...args,
      });
    },
    listWorkspaces(args = {}) {
      return this.makeRequest({
        path: "/workspaces",
        ...args,
      });
    },
    listCalls(args = {}) {
      return this.makeRequest({
        path: "/calls",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let cursor;
      let resourcesCount = 0;
      let response;

      while (true) {
        try {
          response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs?.params,
              cursor,
            },
          });
        } catch (error) {
          if (error.response.status === 404) {
            console.log("No more resources");
            return;
          }
          throw error;
        }

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

        if (!response.records?.cursor) {
          console.log("Stop pagination because no cursor is returned");
          return;
        }

        cursor = response.records.cursor;
      }
    },
    paginate(args = {}) {
      const stream = this.getResourcesStream(args);
      return utils.streamIterator(stream);
    },
  },
};
