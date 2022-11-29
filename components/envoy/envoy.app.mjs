import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "envoy",
  propDefinitions: {
    expectedArrivalAt: {
      type: "string",
      label: "Arrival date",
      description: "A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the date-time format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.",
    },
    locationId: {
      type: "string",
      label: "Location",
      description: "Unique identifier of a location.",
      async options() {
        return this.listEnabledLocationsOpts();
      },
    },
    visitorName: {
      type: "string",
      label: "Name",
      description: "Visitor full name.",
    },
    visitorEmail: {
      type: "string",
      label: "Email",
      description: "Visitor email address.",
    },
    expectedDepartureAt: {
      type: "string",
      label: "Departure date",
      description: "A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the date-time format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.",
      optional: true,
    },
    employeeId: {
      type: "string",
      label: "Host",
      description: "Unique identifier of an employee.",
      async options() {
        return this.listEmployeesOps();
      },
      optional: true,
    },
    notes: {
      type: "string",
      label: "Private notes",
      description: "Enter your private notes.",
      optional: true,
    },
    sendEmailToInvitee: {
      type: "boolean",
      label: "Send email to invitee",
      description: "Either it should or not send email to invitee",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.envoy.com/v1";
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async listEnabledLocationsOpts(ctx = this) {
      const result = await axios(ctx, this._getRequestParams({
        method: "GET",
        path: "/locations",
        params: {
          enabled: true,
        },
      }));
      return result.data.map((location) => ({
        label: location.name,
        value: location.id,
      }));
    },
    async listEmployeesOps(ctx = this) {
      const result = await axios(ctx, this._getRequestParams({
        method: "GET",
        path: "/employees",
      }));
      return result.data.map((location) => ({
        label: location.name,
        value: location.id,
      }));
    },
    async listInvites(ctx = this, params) {
      const result = await axios(ctx, this._getRequestParams({
        method: "GET",
        path: "/invites",
        params,
      }));
      return result;
    },
    async createInvite(ctx = this, data) {
      const result = await axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/invites",
        data,
      }));
      return result;
    },
    async listAllEntriesPages(ctx = this, params) {
      let entriesResult = null;
      const entriesArray = [];
      do {
        const currPage = entriesResult?.meta?.page || 0;
        entriesResult = await this.listEntries(ctx, {
          ...params,
          page: currPage + 1,
        });
        entriesArray.push(...entriesResult.data);
      } while (!entriesResult || entriesResult.meta.perPage > entriesResult.meta.total);
      return entriesArray;
    },
    async listEntries(ctx = this, params) {
      const result = await axios(ctx, this._getRequestParams({
        method: "GET",
        path: "/entries",
        params,
      }));
      return result;
    },
  },
};
