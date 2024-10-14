import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "copper",
  propDefinitions: {
    personData: {
      type: "object",
      label: "Person Data",
      description: "Provide person data for creating or criteria for the update",
    },
    projectData: {
      type: "object",
      label: "Project Data",
      description: "Provide project data for creating or criteria for the update",
    },
    crmId: {
      type: "string",
      label: "CRM ID",
      description: "The ID of the CRM record",
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project you wish to relate",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.copper.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "get",
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createOrUpdatePerson(personData) {
      return this._makeRequest({
        method: "post",
        path: "/person",
        data: personData,
      });
    },
    async createOrUpdateProject(projectData) {
      return this._makeRequest({
        method: "post",
        path: "/project",
        data: projectData,
      });
    },
    async relateProjectToCrm(crmId, projectId) {
      return this._makeRequest({
        method: "post",
        path: `/project/${projectId}/relate`,
        data: {
          crmId,
        },
      });
    },
    async getNewPerson() {
      return this._makeRequest({
        path: "/person/new",
      });
    },
    async getNewLead() {
      return this._makeRequest({
        path: "/lead/new",
      });
    },
    async getNewOpportunity() {
      return this._makeRequest({
        path: "/opportunity/new",
      });
    },
  },
};
