import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "langbase",
  propDefinitions: {
    memoryName: {
      type: "string",
      label: "Memory Name",
      description: "The name of the memory",
      async options() {
        const response = await this.listMemories();
        const memoryNames = response.memorySets;
        return memoryNames.map(({
          name, description,
        }) => ({
          label: description,
          value: name,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the memory",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Short description of the memory",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.langbase.com/beta";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.org_api_key}`,
          "Accept": "application/json",
        },
      });
    },
    async createMemory(args = {}) {
      return this._makeRequest({
        path: `/org/${this.$auth.org}/memorysets`,
        method: "post",
        ...args,
      });
    },
    async deleteMemory({
      memoryName, ...args
    }) {
      return this._makeRequest({
        path: `/memorysets/${this.$auth.org}/${memoryName}`,
        method: "delete",
        ...args,
      });
    },
    async listMemories(args = {}) {
      return this._makeRequest({
        path: `/org/${this.$auth.org}/memorysets`,
        ...args,
      });
    },
  },
};
