import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "graceblocks",
  propDefinitions: {
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record",
      async options({ page }) {
        const { records } = await this.listRecords({
          params: {
            limit: DEFAULT_LIMIT,
            starting_after: page * DEFAULT_LIMIT,
          },
        });
        return records.map(({
          id, Name,
        }) => ({
          label: Name,
          value: id,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the record",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the record",
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "An array of URLs to attachments to add to the record",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the record",
      optional: true,
      options: [
        "New",
        "Reviewed",
        "In Process",
        "Information Needed",
        "Completed",
        "Cancelled",
      ],
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Priority of the record",
      optional: true,
      options: [
        "1",
        "2",
        "3",
        "4",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.graceblocks.com/v1/${this.$auth.block_id}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listRecords(opts = {}) {
      return this._makeRequest({
        path: "/Tasks",
        ...opts,
      });
    },
    createRecord(opts = {}) {
      return this._makeRequest({
        path: "/Tasks",
        method: "POST",
        ...opts,
      });
    },
    updateRecord(opts = {}) {
      return this._makeRequest({
        path: "/Tasks",
        method: "PATCH",
        ...opts,
      });
    },
    async *paginate({
      resourceFn, params, max,
    }) {
      params = {
        ...params,
        limit: DEFAULT_LIMIT,
        starting_after: 0,
      };
      let count = 0, hasMore;
      do {
        const {
          records, totalRecords,
        } = await resourceFn({
          params,
        });
        if (!records?.length) {
          return;
        }
        for (const record of records) {
          yield record;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        hasMore = count < totalRecords;
        params.starting_after += DEFAULT_LIMIT;
      } while (hasMore);
    },
  },
};
