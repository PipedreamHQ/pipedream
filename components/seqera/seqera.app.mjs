import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "seqera",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace to use.",
      optional: true,
      async options() {
        const { user } = await this.getUserInfo();
        const { orgsAndWorkspaces } = await this.listWorkspaces({
          userId: user.id,
        });
        return orgsAndWorkspaces
          .filter(({ workspaceId }) => workspaceId)
          .map(({
            workspaceId: value, workspaceName: label,
          }) => ({
            label,
            value,
          }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the compute environment.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the compute environment.",
    },
    launch: {
      type: "object",
      label: "Launch",
      description: "The launch configuration of the pipeline to create",
    },
    platformId: {
      type: "string",
      label: "Platform ID",
      description: "The ID of the platform to use for the compute environment.",
      async options() {
        const { platforms = [] } = await this.listPlatforms();
        return platforms.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    credentialsId: {
      type: "string",
      label: "Credentials ID",
      description: "The ID of the credentials to use for the compute environment.",
      async options({
        platformId, workspaceId,
      }) {
        const { credentials = [] } = await this.listCredentials({
          params: {
            platformId,
            workspaceId,
          },
        });
        return credentials.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    computeEnvId: {
      type: "string",
      label: "Compute Environment ID",
      description: "The ID of the compute environment to use.",
      async options({ workspaceId }) {
        const { computeEnvs = [] } = await this.listComputeEnvironments({
          params: {
            workspaceId,
          },
        });
        return computeEnvs.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    pipeline: {
      type: "string",
      label: "Pipeline Respository",
      description: "The name of the pipeline repository to use.",
      async options({ workspaceId }) {
        const { pipelines = [] } = await this.listPipelinesRepositories({
          params: {
            workspaceId,
          },
        });
        return pipelines.map((value) => value);
      },
    },
  },
  methods: {
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: constants.BASE_URL + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    getUserInfo(args = {}) {
      return this._makeRequest({
        path: "/user-info",
        ...args,
      });
    },
    listWorkspaces({
      userId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/user/${userId}/workspaces`,
        ...args,
      });
    },
    listPlatforms(args = {}) {
      return this._makeRequest({
        path: "/platforms",
        ...args,
      });
    },
    listCredentials(args = {}) {
      return this._makeRequest({
        path: "/credentials",
        ...args,
      });
    },
    listComputeEnvironments(args = {}) {
      return this._makeRequest({
        path: "/compute-envs",
        ...args,
      });
    },
    listPipelinesRepositories(args = {}) {
      return this._makeRequest({
        path: "/pipelines/repositories",
        ...args,
      });
    },
    listRuns(args = {}) {
      return this._makeRequest({
        path: "/ga4gh/wes/v1/runs",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn,
      resourcesFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let nextPageToken;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              page_size: constants.DEFAULT_LIMIT,
              page_token: nextPageToken,
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

        if (Number(response.next_page_token) === 0) {
          console.log("No more pages found");
          return;
        }

        nextPageToken = response.next_page_token;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
