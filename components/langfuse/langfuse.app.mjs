import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "langfuse",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Trace ID",
      description: "The ID of the trace to attach feedback to or to filter by for events.",
      async options() {
        const { data } = await this.listProjects();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The type of object to attach feedback to.",
      options: Object.values(constants.OBJECT_TYPE),
    },
    objectId: {
      type: "string",
      label: "Object ID",
      description: "The id of the object to attach the comment to. If this does not reference a valid existing object, an error will be thrown.",
      async options({
        objectType, page,
      }) {
        if (!objectType) {
          return [];
        }

        const resourcesFn = {
          [constants.OBJECT_TYPE.TRACE]: this.listTraces,
          [constants.OBJECT_TYPE.OBSERVATION]: this.listObservations,
          [constants.OBJECT_TYPE.SESSION]: this.listSessions,
          [constants.OBJECT_TYPE.PROMPT]: this.listPrompts,
        }[objectType];

        if (!resourcesFn) {
          return [];
        }

        const { data } = await resourcesFn({
          params: {
            page: page + 1,
            limit: constants.DEFAULT_LIMIT,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value: value || label,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      const baseUrl = constants.BASE_URL
        .replace(constants.REGION_PLACEHOLDER, this.$auth.region);
      return `${baseUrl}${constants.VERSION_PATH}${path}`;
    },
    getAuth() {
      const {
        public_key: username,
        secret_key: password,
      } = this.$auth;
      return {
        username,
        password,
      };
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        auth: this.getAuth(),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    listTraces(args = {}) {
      return this._makeRequest({
        path: "/traces",
        ...args,
      });
    },
    listScores(args = {}) {
      return this._makeRequest({
        path: "/scores",
        ...args,
      });
    },
    listObservations(args = {}) {
      return this._makeRequest({
        path: "/observations",
        ...args,
      });
    },
    listSessions(args = {}) {
      return this._makeRequest({
        path: "/sessions",
        ...args,
      });
    },
    listPrompts(args = {}) {
      return this._makeRequest({
        path: "/v2/prompts",
        ...args,
      });
    },
    getPrompt({
      promptName, ...args
    } = {}) {
      return this._makeRequest({
        path: `/v2/prompts/${encodeURIComponent(promptName)}`,
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
              limit: constants.DEFAULT_LIMIT,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const isDateGreater =
            lastDateAt
              && Date.parse(resource[dateField]) >= Date.parse(lastDateAt);

          if (!lastDateAt || isDateGreater) {
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
