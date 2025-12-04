import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tmetric",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Identifier of the account",
      async options() {
        const response = await this.getUser();
        const accounts = response.accounts;
        return accounts.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    timeEntryId: {
      type: "string",
      label: "Time Entry ID",
      description: "Identifier of the time entry",
      async options({ accountId }) {
        const response = await this.getTimeEntries({
          accountId,
        });
        return response.map(({
          id, note,
        }) => ({
          value: id,
          label: note,
        }));
      },
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Start timestamp in ISO format, e.g. `2025-11-26T14:16:00`; leave blank to start the timer at the current moment",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "End timestamp in ISO format, e.g. `2025-11-26T15:16:00`; leave blank to keep the timer running indefinitely",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Additional note for the time entry",
      optional: true,
    },
    isBillable: {
      type: "boolean",
      label: "Is Billable",
      description: "Whether the time entry is billable",
      optional: true,
    },
    isInvoiced: {
      type: "boolean",
      label: "Is Invoiced",
      description: "Whether the time entry has been invoiced",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.tmetric.com/api/v3";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
          ...headers,
        },
      });
    },
    async createTimeEntry({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/timeentries`,
        method: "post",
        ...args,
      });
    },
    async deleteTimeEntry({
      accountId, timeEntryId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/timeentries/${timeEntryId}`,
        method: "delete",
        ...args,
      });
    },
    async modifyTimeEntry({
      accountId, timeEntryId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/timeentries/${timeEntryId}`,
        method: "put",
        ...args,
      });
    },
    async getTimeEntries({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/timeentries`,
        ...args,
      });
    },
    async getUser(args = {}) {
      return this._makeRequest({
        path: "/user",
        ...args,
      });
    },
    async getTasks({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/tasks`,
        ...args,
      });
    },
  },
};
