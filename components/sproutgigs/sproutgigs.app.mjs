import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sproutgigs",
  propDefinitions: {
    test: {
      type: "boolean",
      label: "Test",
      description: "Enable development mode, the job will not be created",
      optional: true,
    },
    zoneId: {
      type: "string",
      label: "Zone ID",
      description: "Zone ID for the job",
      async options() {
        const response = await this.getZones();
        return response.map(({
          id, zone,
        }) => ({
          value: id,
          label: zone,
        }));
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Category ID for the job",
      async options() {
        const response = await this.getCategories();
        return response.map(({
          id, subcategory,
        }) => ({
          value: id,
          label: subcategory,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "Job title",
    },
    instructions: {
      type: "string[]",
      label: "Instructions",
      description: "List of expected work steps",
    },
    proofs: {
      type: "string",
      label: "Proofs",
      description: "Array of up to 4 proofs, each with description and type (text or screenshot), i.e.: `[{\"description\":\"Profile screenshot\",\"type\":\"screenshot\"}]`",
    },
    numTasks: {
      type: "integer",
      label: "Number of Tasks",
      description: "Number of tasks to be performed",
    },
    taskValue: {
      type: "string",
      label: "Task Value",
      description: "Amount paid per task",
    },
  },
  methods: {
    _baseUrl() {
      return "https://sproutgigs.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        auth,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: {
          username: `${this.$auth.user_id}`,
          password: `${this.$auth.api_secret}`,
          ...auth,
        },
      });
    },
    async postJob(args = {}) {
      return this._makeRequest({
        path: "/jobs/post-job.php",
        method: "post",
        ...args,
      });
    },
    async getCategories(args = {}) {
      return this._makeRequest({
        path: "/jobs/get-categories.php",
        ...args,
      });
    },
    async getZones(args = {}) {
      return this._makeRequest({
        path: "/jobs/get-zones.php",
        ...args,
      });
    },
  },
};
