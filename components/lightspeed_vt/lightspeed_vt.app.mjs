import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lightspeed_vt",
  propDefinitions: {
    contentRole: {
      type: "integer[]",
      label: "Content Role Id",
      description: "List of content roles Ids.",
      async options({ page }) {
        const contentRoles = await this.listContentRoles({
          params: {
            page: page + 1,
          },
        });

        return contentRoles.map(({
          roleId: value, contentRole: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    jobPositionId: {
      type: "string",
      label: "Job Position Id",
      description: "Id for job position assigned to user.",
      async options({ page }) {
        const jobPositions = await this.listJobPositions({
          params: {
            page: page + 1,
          },
        });

        return jobPositions.map(({
          jobPositionId: value, jobPosition: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    locationId: {
      type: "string",
      label: "Location Id",
      description: "Specifies the location Id.",
      async options({ page }) {
        const locations = await this.listLocations({
          params: {
            page: page + 1,
          },
        });

        return locations.map(({
          locationId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    teamId: {
      type: "string",
      label: "Team Id",
      description: "Id for team assigned to user.",
      async options({ page }) {
        const teams = await this.listTeams({
          params: {
            page: page + 1,
          },
        });

        return teams.map(({
          teamId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://webservices.lightspeedvt.net/REST/V1";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiSecret() {
      return this.$auth.api_secret;
    },
    _getAuth() {
      return {
        username: `${this._apiKey()}`,
        password: `${this._apiSecret()}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      const config = {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: this._getAuth(),
      };

      return axios($, config);
    },
    listContentRoles(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/contentRoles",
      });
    },
    listJobPositions(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/jobPositions",
      });
    },
    listLocations(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/locations/",
      });
    },
    listTeams(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/teams",
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/users/",
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/users/",
      });
    },
  },
};
