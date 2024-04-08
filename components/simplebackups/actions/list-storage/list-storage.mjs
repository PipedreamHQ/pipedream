import app from "../../simplebackups.app.mjs";

export default {
  name: "List Storages",
  version: "0.0.1",
  key: "simplebackups-list-storages",
  description: "List all storage providers added to your SimpleBackups account. [See the documentation](https://simplebackups.docs.apiary.io/#/reference/storage/list-storage)",
  props: {
    app,
    name: {
      type: "string",
      label: "Server Name",
      description: "The name of the server to list.",
      optional: true,
    },
    status: {
      type: "integer",
      label: "Server Status",
      description: "The status of the server to list. (0: Failed, 1: Success)",
      optional: true,
    },
  },
  type: "action",
  methods: {
    /**
     * Builds the filters for the list of backups.
     * @returns {string} The filters string to be appended to the API endpoint.
     */
    buildFilters() {
      const filters = [];
      if (this.name) filters.push(`filters[name]=${this.name}`);
      if (this.status) filters.push(`filters[status]=${this.status}`);

      return filters.length > 0
        ? `?${filters.join("&")}`
        : "";
    },
  },

  async run({ $ }) {
    const { data } = await this.app.listStorages($, this.buildFilters());

    $.export("$summary", `Found ${data.length} storage(s).`);

    return {
      storages: data,
    };
  },
};
