import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import statusChangeExpressions from "./common/expressions/status-change.mjs";
import taskExpressions from "./common/expressions/task.mjs";
import projectExpressions from "./common/expressions/project.mjs";

export default {
  type: "app",
  app: "ftrack",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to retrieve information about.",
      async options({ prevContext }) {
        const { offset } = prevContext;
        if (offset === null) {
          return [];
        }

        const [
          {
            data,
            metadata,
          },
        ] = await this.listTasks({
          data: {
            offset,
            limit: 2,
          },
        });

        const options = data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            offset: metadata?.next?.offset || null,
          },
        };
      },
    },
  },
  methods: {
    getBaseUrl() {
      const baseUrl =
        constants.BASE_URL
          .replace(constants.SUBDOMAIN_PLACEHOLDER, this.$auth.subdomain);
      return `${baseUrl}${constants.VERSION_PATH}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "ftrack-user": `${this.$auth.username}`,
        "ftrack-api-key": `${this.$auth.api_key}`,
        ...headers,
      };
    },
    async makeRequest({
      step = this, headers, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getBaseUrl(),
        ...args,
      };

      const response = await axios(step, config);

      if (response.exception) {
        console.log("Exception in request", JSON.stringify(response, null, 2));
        throw new Error(response.content);
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    query({
      data = {}, ...args
    } = {}) {
      return this.post({
        data: [
          {
            action: "query",
            ...data,
          },
        ],
        ...args,
      });
    },
    create({
      data = {}, ...args
    } = {}) {
      return this.post({
        data: [
          {
            action: "create",
            ...data,
          },
        ],
        ...args,
      });
    },
    update({
      data = {}, ...args
    } = {}) {
      return this.post({
        data: [
          {
            action: "update",
            ...data,
          },
        ],
        ...args,
      });
    },
    delete({
      data = {}, ...args
    } = {}) {
      return this.post({
        data: [
          {
            action: "delete",
            ...data,
          },
        ],
        ...args,
      });
    },
    listTasks({
      data = {}, ...args
    } = {}) {
      return this.query({
        data: {
          expression: taskExpressions.listTasks(data),
        },
        ...args,
      });
    },
    listStatusChanges({
      data = {}, ...args
    } = {}) {
      return this.query({
        data: {
          expression: statusChangeExpressions.listStatusChanges(data),
        },
        ...args,
      });
    },
    listProjects({
      data = {}, ...args
    } = {}) {
      return this.query({
        data: {
          expression: projectExpressions.listProjects(data),
        },
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.DEFAULT_MAX,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const [
          {
            data: nextResources, metadata,
          },
        ] =
          await resourceFn({
            ...resourceFnArgs,
            data: {
              ...resourceFnArgs?.data,
              offset,
            },
          });

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

        if (!metadata?.next?.offset) {
          console.log("Pagination complete");
          return;
        }

        offset = metadata?.next?.offset;
      }
    },
  },
};
