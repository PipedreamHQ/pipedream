import qs from "qs";
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pinecone",
  propDefinitions: {
    indexName: {
      type: "string",
      label: "Index Name",
      description: "The name of the index. E.g. `my-index`",
      options() {
        return this.listIndexes();
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project. You can get the project from the Pinecone URL, for example https://app.pinecone.io/organizations/abcde/projects/us-east-1-aws:611e7f9/indexes, then the Project ID is `611e7f9`",
    },
    vectorId: {
      type: "string",
      label: "Vector ID",
      description: "The ID of the vector.",
      async options({
        indexName, projectId,
      }) {
        if (!indexName || !projectId) {
          return [];
        }

        const { database: { dimension } } = await this.describeIndex({
          indexName,
        });

        const { matches } = await this.query({
          projectId,
          indexName,
          data: {
            topK: dimension,
            vector: Array.from({
              length: dimension,
            }).map(() => 0),
          },
        });

        return matches?.map(({ id }) => id);
      },
    },
    namespace: {
      type: "string",
      label: "Namespace",
      description: "The namespace to use.",
      optional: true,
    },
    vectorValues: {
      type: "string[]",
      label: "Vector Values",
      description: "The values of the vector.",
    },
    vectorMetadata: {
      type: "object",
      label: "Vector Metadata",
      description: "The metadata of the vector. E.g. `{\"color\": \"red\"}`",
      optional: true,
    },
  },
  methods: {
    getBaseUrl({
      api, projectId, indexName,
    } = {}) {
      const { environment } = this.$auth;
      return api === constants.API.CONTROLLER
        ? constants.CONTROLLER_URL
          .replace(constants.ENV_PLACEHOLDER, environment)
        : constants.BASE_URL
          .replace(constants.INDEX_NAME_PLACEHOLDER, indexName)
          .replace(constants.PROJECT_ID_PLACEHOLDER, projectId)
          .replace(constants.ENV_PLACEHOLDER, environment);
    },
    getUrl({
      api, path, projectId, indexName,
    } = {}) {
      const baseUrl = this.getBaseUrl({
        api,
        projectId,
        indexName,
      });
      return `${baseUrl}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Api-Key": this.$auth.api_key,
        ...headers,
      };
    },
    paramsSerializer(params) {
      return qs.stringify(params, {
        arrayFormat: "repeat",
      });
    },
    makeRequest({
      step = this, api, headers, projectId, indexName, path, ...args
    } = {}) {

      const config = {
        paramsSerializer: this.paramsSerializer,
        headers: this.getHeaders(headers),
        url: this.getUrl({
          api,
          indexName,
          projectId,
          path,
        }),
        ...args,
      };

      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    update(args = {}) {
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
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    query(args = {}) {
      return this.create({
        path: "/query",
        ...args,
      });
    },
    describeIndex({
      indexName, ...args
    } = {}) {
      return this.makeRequest({
        api: constants.API.CONTROLLER,
        path: `/databases/${indexName}`,
        ...args,
      });
    },
    listIndexes() {
      return this.makeRequest({
        api: constants.API.CONTROLLER,
        path: "/databases",
      });
    },
    fetchVectors(args = {}) {
      return this.makeRequest({
        path: "/vectors/fetch",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      lastCreatedAt,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              page,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const dateFilter =
            lastCreatedAt
            && Date.parse(resource.created_at) > Date.parse(lastCreatedAt);

          if (!lastCreatedAt || dateFilter) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            return;
          }
        }

        page += 1;
      }
    },
  },
};
