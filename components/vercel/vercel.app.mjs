import { axios } from "@pipedream/platform";
import constants from "./constants.mjs";

export default {
  type: "app",
  app: "vercel",
  propDefinitions: {
    project: {
      type: "string",
      label: "Project",
      description: "Filter deployments from the given projectId",
      optional: true,
      async options() {
        const projects = await this.listProjects();
        return projects?.map((project) => ({
          label: project.name,
          value: project.id,
        })) ?? [];
      },
    },
    deployment: {
      type: "string",
      label: "Deployment",
      description: "Select the deployment to cancel",
      async options({ state }) {
        const params = state
          ? {
            state,
          }
          : {};
        const deployments = await this.listDeployments(params);
        return deployments?.map((deployment) => ({
          label: deployment.name,
          value: deployment.uid,
        })) ?? [];
      },
    },
    team: {
      type: "string",
      label: "Team",
      description: "The Team identifier or slug to perform the request on behalf of",
      optional: true,
      async options() {
        try {
          const teams = await this.listTeams();
          return teams?.map((team) => ({
            label: team.slug,
            value: team.id,
          })) ?? [];
        } catch (e) {
          throw new Error(e.message);
        }
      },
    },
    state: {
      type: "string",
      label: "State",
      description: "Filter deployments based on their state",
      optional: true,
      options: constants.DEPLOYMENT_STATES,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "Maximum number of results to return",
      optional: true,
    },
  },
  methods: {
    _auth() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async makeRequest(config, $) {
      config = {
        ...config,
        url: `https://api.vercel.com/${config.endpoint}`,
        headers: {
          ...this._auth(),
          "User-Agent": "@PipedreamHQ/pipedream v0.1",
        },
      };
      delete config.endpoint;
      return axios($ ?? this, config);
    },
    /**
    * Paginate through a list of resources in Vercel
    * @params {String} resource - Resource type (e.g. "projects", "deployments", "teams").
    * The response from makeRequest() will contain an array of results with the specified
    * resource as the key and the array as the value
    * @params {Object} config - configuration variables for the request
    * @params {Integer} max - the maximum number of results to return
    * @returns {Array} An array of results
    */
    async paginate(resource, config, max = constants.MAX_RESULTS, $) {
      const allResults = [];
      config.params = {
        ...config.params,
        limit: constants.PAGE_SIZE,
      };
      let results;
      do {
        results = await this.makeRequest(config, $);
        config.params.from = results?.pagination?.next;
        config.params.since = results?.pagination?.next;
        allResults.push(...results[resource]);
      } while (results?.pagination?.count === config.limit && allResults.length < max);
      if (allResults.length > max) {
        allResults.length = max;
      }
      return allResults;
    },
    async listProjects(max, $) {
      const config = {
        method: "GET",
        endpoint: "v8/projects",
      };
      return this.paginate("projects", config, max, $);
    },
    async listDeployments(params, max, $) {
      const config = {
        method: "GET",
        endpoint: "v6/deployments",
        params,
      };
      return this.paginate("deployments", config, max, $);
    },
    async listTeams(max, $) {
      const config = {
        method: "GET",
        endpoint: "v2/teams",
      };
      return this.paginate("teams", config, max, $);
    },
    async cancelDeployment(id, params, $) {
      const config = {
        method: "PATCH",
        endpoint: `v12/deployments/${id}/cancel`,
        params,
      };
      return this.makeRequest(config, $);
    },
    async createDeployment(data, $) {
      const config = {
        method: "POST",
        endpoint: "v13/deployments",
        data,
      };
      if (data.teamId) {
        config.endpoint += `?teamId=${data.teamId}`;
      }
      delete data.teamId;
      return this.makeRequest(config, $);
    },
  },
};
