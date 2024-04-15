import app from "../../simplebackups.app.mjs";

export default {
  name: "List Backups",
  version: "0.0.1",
  key: "simplebackups-list-backups",
  description: "List all backups on your SimpleBackups account. [See the documentation](https://simplebackups.docs.apiary.io/#/reference/backups/list-backups)",
  props: {
    app,
    id: {
      type: "integer",
      label: "Backup ID",
      description: "The ID of the backup to list.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Backup Name",
      description: "The name of the backup to list.",
      optional: true,
    },
    status: {
      type: "integer",
      label: "Backup Status",
      description: "The status of the backup to list. (0: Failed, 1: Success)",
      optional: true,
    },
    type: {
      type: "string",
      label: "Backup Type",
      description: "The type of the backup to list. (db, file, full, sync)",
      optional: true,
    },
    server: {
      type: "integer",
      label: "Server ID",
      description: "The ID of the server to list backups for.",
      optional: true,
    },
    storage: {
      type: "integer",
      label: "Storage ID",
      description: "The ID of the storage to list backups for.",
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
      if (this.id) filters.push(`filters[id]=${this.id}`);
      if (this.name) filters.push(`filters[name]=${this.name}`);
      if (this.status) filters.push(`filters[status]=${this.status}`);
      if (this.type) filters.push(`filters[type]=${this.type}`);
      if (this.server) filters.push(`filters[server]=${this.server}`);
      if (this.storage) filters.push(`filters[storage]=${this.storage}`);

      return filters.length > 0
        ? `?${filters.join("&")}`
        : "";
    },
  },

  async run({ $ }) {
    // Validate that type is one of the allowed values
    const allowedTypes = [
      "db",
      "file",
      "full",
      "sync",
    ];
    if (this.type && !allowedTypes.includes(this.type)) {
      throw new Error(`Type must be one of ${allowedTypes.join(", ")}`);
    }

    // Validate that status is one of the allowed values
    const allowedStatuses = [
      0,
      1,
    ];
    if (this.status && !allowedStatuses.includes(this.status)) {
      throw new Error(`Status must be one of ${allowedStatuses.join(", ")}`);
    }

    const filters = this.buildFilters();

    const { data } = await this.app.listBackups($, filters);

    $.export("$summary", `Found ${data.length} backup(s).`);

    return {
      backups: data,
    };
  },
};
