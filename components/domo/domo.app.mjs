import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "domo",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Emit new event when a new dataset is added
    datasetOwner: {
      type: "string",
      label: "Dataset Owner",
      description: "Filter datasets by owner.",
      optional: true,
    },
    datasetTags: {
      type: "string[]",
      label: "Dataset Tags",
      description: "Filter datasets by tags.",
      optional: true,
    },
    // Emit new event when data within a specific card is updated
    cardId: {
      type: "string",
      label: "Card ID",
      description: "The ID of the card to monitor for data updates.",
    },
    thresholds: {
      type: "string[]",
      label: "Thresholds",
      description: "Conditions or thresholds for data updates, in JSON format.",
      optional: true,
    },
    conditions: {
      type: "string[]",
      label: "Conditions",
      description: "Conditions for data updates, in JSON format.",
      optional: true,
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project.",
      optional: true,
      async options() {
        const projects = await this.listProjects();
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list.",
      optional: true,
      async options() {
        if (!this.projectId) {
          return [];
        }
        const lists = await this.listLists({
          projectId: this.projectId,
        });
        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    // Emit new event when an alert is triggered
    alertTypes: {
      type: "string[]",
      label: "Alert Types",
      description: "Filter alerts by specific types.",
      optional: true,
    },
    relatedDatasets: {
      type: "string[]",
      label: "Related Datasets",
      description: "Filter alerts by related datasets.",
      optional: true,
    },
    // Add new rows of data to an existing dataset
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "The ID of the dataset to add data to.",
    },
    data: {
      type: "string[]",
      label: "Data",
      description:
        "The data to add to the dataset, as JSON strings representing objects or arrays.",
    },
    // Update the description of an existing card
    updateCardId: {
      type: "string",
      label: "Card ID",
      description: "The ID of the card to update.",
    },
    newDescription: {
      type: "string",
      label: "New Description",
      description: "The new description for the card.",
    },
  },
  methods: {
    // Existing method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.domo.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers = {}, data, params, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data: data || undefined,
        params: params || undefined,
        ...otherOpts,
      });
    },
    // Method to list all projects
    async listProjects(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/v1/projects",
        ...opts,
      });
    },
    // Method to list all lists within a project
    async listLists({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/v1/projects/${projectId}/lists`,
        ...opts,
      });
    },
    // Method to add new rows to a dataset
    async addDatasetRows({
      datasetId, data, ...opts
    }) {
      const parsedData = data.map((row) => JSON.parse(row));
      return this._makeRequest({
        method: "POST",
        path: `/v1/datasets/${datasetId}/data`,
        data: parsedData,
        ...opts,
      });
    },
    // Method to update card description
    async updateCardDescription({
      cardId, newDescription, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/v1/cards/${cardId}`,
        data: {
          description: newDescription,
        },
        ...opts,
      });
    },
    // Method to list alerts
    async listAlerts(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/v1/alerts",
        ...opts,
      });
    },
    // Method to get alert details
    async getAlertDetails({
      alertId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/v1/alerts/${alertId}`,
        ...opts,
      });
    },
    // Method to get card data
    async getCardData({
      cardId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/v1/cards/${cardId}/data`,
        ...opts,
      });
    },
    // Pagination method
    async paginate(fn, ...opts) {
      let results = [];
      let response;
      let offset = 0;
      const limit = 100;

      do {
        response = await fn({
          offset,
          limit,
          ...opts,
        });
        results = results.concat(response);
        offset += limit;
      } while (response.length === limit);

      return results;
    },
  },
};
