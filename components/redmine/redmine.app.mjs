import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "redmine",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const response = await this.listProjects();
        console.log(response);
        const { projects } = response;
        return projects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    trackerId: {
      type: "integer",
      label: "Tracker ID",
      description: "The ID of the tracker",
      async options() {
        const { trackers } = await this.listTrackers();
        return trackers.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    statusId: {
      type: "integer",
      label: "Status ID",
      description: "The ID of the status",
      async options() {
        const { issue_statuses: statuses } = await this.listIssueStatuses();
        return statuses.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    priorityId: {
      type: "integer",
      label: "Priority ID",
      description: "The ID of the priority",
      async options() {
        const { issue_priorities: priorities } = await this.listIssuePriorities();
        return priorities.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "The ID of the user",
      async options() {
        const { users } = await this.listUsers();
        return users.map(({
          id: value, login: label,
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
    getUrl(path) {
      const baseUrl = constants.BASE_URL
        .replace(constants.DOMAIN_PLACEHOLDER, this.$auth.hostname);
      return `${baseUrl}${path}`;
    },
    async makeRequest({
      step = this, path, headers, summary, ...args
    } = {}) {
      const {
        getUrl,
        exportSummary,
        $auth: { api_key: apiKey },
      } = this;

      const config = {
        ...args,
        url: getUrl(path),
        headers: {
          ...headers,
          "X-Redmine-API-Key": apiKey,
        },
      };

      const response = await axios(step, config);

      if (typeof(summary) === "function") {
        exportSummary(step)(summary(response));
      }

      return response || {
        success: true,
      };
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    listIssues(args = {}) {
      return this.makeRequest({
        path: "/issues.json",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this.makeRequest({
        path: "/projects.json",
        ...args,
      });
    },
    listTrackers(args = {}) {
      return this.makeRequest({
        path: "/trackers.json",
        ...args,
      });
    },
    listIssueStatuses(args = {}) {
      return this.makeRequest({
        path: "/issue_statuses.json",
        ...args,
      });
    },
    listIssuePriorities(args = {}) {
      return this.makeRequest({
        path: "/enumerations/issue_priorities.json",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this.makeRequest({
        path: "/users.json",
        ...args,
      });
    },
    async *getIterations({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              offset,
              limit: constants.DEFAULT_LIMIT,
              ...resourceFnArgs?.params,
            },
          });

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

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("Less resources than the limit found, no more resources to fetch");
          return;
        }

        offset += constants.DEFAULT_LIMIT;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
