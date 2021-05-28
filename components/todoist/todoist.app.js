const axios = require("axios");
const querystring = require("querystring");
const resourceTypes = require("./resource-types.js")

module.exports = {
  type: "app",
  app: "todoist",
  propDefinitions: {
    includeResourceTypes: {
      type: "string[]",
      label: "Resource Types",
      description: "Select one or more resources to include",
      async options() {
        resourceTypes.unshift("all");
        return resourceTypes;
      },
    },
    selectProjects: {
      type: "integer[]",
      label: "Select Projects",
      description:
        "Filter for events that match one or more projects. Leave this blank to emit results for any project.",
      optional: true,
      async options() {
        return (await this.getProjects()).map((project) => {
          return { label: project.name, value: project.id };
        });
      },
    },
  },
  methods: {
    /**
     * Make a request to Todoist's sync API.
     * @params {Object} opts - An object representing the configuration options for this method
     * @params {String} opts.path [opts.path=/sync/v8/sync] - The path for the sync request
     * @params {String} opts.payload - The data to send in the API request at the POST body. This data will converted to `application/x-www-form-urlencoded`
     * @returns {Object} When the request succeeds, an HTTP 200 response will be returned with a JSON object containing the requested resources and also a new `sync_token`.
     */
    async _makeSyncRequest(opts) {
      const { path = `/sync/v8/sync` } = opts;
      delete opts.path;
      opts.url = `https://api.todoist.com${path[0] === "/" ? "" : "/"}${path}`;
      opts.payload.token = this.$auth.oauth_access_token;
      opts.data = querystring.stringify(opts.payload);
      delete opts.payload;
      return await axios(opts);
    },
    /**
     * Make a request to Todoist's REST API.
     * @params {Object} opts - An object representing the Axios configuration options for this method
     * @params {String} opts.path - The path for the REST API request
     * @returns {*} The response may vary depending the specific API request.
     */
    async _makeRestRequest(opts) {
      const { path } = opts;
      delete opts.path;
      opts.url = `https://api.todoist.com${path[0] === "/" ? "" : "/"}${path}`;
      opts.headers = {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
      return await axios(opts);
    },
    /**
     * Check whether an array of project IDs contains the given proejct ID. This method is used in multiple sources to validate if an event matches the selection in the project filter.
     * @params {Integer} project_id - The ID for a Todoist project
     * @params {Array} selectedProjectIds - An array of Todoist project IDs
     * @returns {Boolean} Returns `true` if the `project_id` matches a value in the arrar or if the array is empty. Otherwise returns `false`.
     */
    isProjectInList(projectId, selectedProjectIds) {
      return (
        selectedProjectIds.length === 0 ||
        selectedProjectIds.includes(projectId)
      );
    },
    /**
     * Public method to make a sync request.
     * @params {Object} opts - The configuration for an axios request with a `path` key.
     * @returns {Object} When the request succeeds, an HTTP 200 response will be returned with a JSON object containing the requested resources and also a new `sync_token`.
     */
    async sync(opts) {
      return (
        await this._makeSyncRequest({
          path: `/sync/v8/sync`,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          payload: opts,
        })
      ).data;
    },
    /**
     * Get the list of project for the authenticated user
     * @returns {Array} Returns a JSON-encoded array containing all user projects
     */
    async getProjects() {
      return (
        await this._makeRestRequest({
          path: `/rest/v1/projects`,
          method: "GET",
        })
      ).data;
    },
    async syncItems(db) {
      return await this.syncResources(db, ["items"]);
    },
    async syncProjects(db) {
      return await this.syncResources(db, ["projects"]);
    },
    async syncResources(db, resourceTypes) {
      const syncToken = db.get("syncToken") || "*";
      const result = await this.sync({
        resource_types: JSON.stringify(resourceTypes),
        sync_token: syncToken,
      });
      db.set("syncToken", result.sync_token);
      return result;
    },
  },
};