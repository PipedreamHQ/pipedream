import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "qualetics",
  propDefinitions: {
    dataMachineId: {
      type: "string",
      label: "Data Machine ID",
      description: "The ID of the Data Machine to initiate",
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event to record",
    },
    eventData: {
      type: "object",
      label: "Event Data",
      description: "The data related to the event",
    },
    severityLevel: {
      type: "string",
      label: "Severity Level",
      description: "The severity level of exceptions to fetch",
      optional: true,
    },
    searchTerms: {
      type: "string",
      label: "Search Terms",
      description: "The terms the user is searching for",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.qualetics.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async initiateDataMachine(dataMachineId) {
      return this._makeRequest({
        method: "POST",
        path: `/dataMachines/${dataMachineId}/initiate`,
      });
    },
    async recordEvent(eventId, eventData) {
      return this._makeRequest({
        method: "POST",
        path: `/events/${eventId}`,
        data: eventData,
      });
    },
    async getExceptions(severityLevel) {
      return this._makeRequest({
        path: `/exceptions?severityLevel=${severityLevel}`,
      });
    },
    async searchWebApp(searchTerms) {
      return this._makeRequest({
        path: `/search?terms=${searchTerms}`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
