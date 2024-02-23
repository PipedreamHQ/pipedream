import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ncscale",
  propDefinitions: {
    message: {
      type: "string",
      label: "Log Message",
      description: "The details of the log entry.",
    },
    timestamp: {
      type: "integer",
      label: "Timestamp",
      description: "The timestamp when the log was created. Format: Timestamp UTC",
      optional: true,
    },
    severity: {
      type: "string",
      label: "Severity",
      description: "The type of log event.",
      options: [
        {
          label: "Verbose",
          value: "verbose",
        },
        {
          label: "Info",
          value: "info",
        },
        {
          label: "Warning",
          value: "warning",
        },
        {
          label: "Error",
          value: "error",
        },
        {
          label: "Critical",
          value: "critical",
        },
      ],
      optional: true,
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event.",
      optional: true,
    },
    extra: {
      type: "object",
      label: "Extra Information",
      description: "An object with further information. Keys must follow specific format rules.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://logs.ncscale.io/v1";
    },
    async pushLog({
      message, timestamp, severity, eventName, extra,
    }) {
      const data = {
        message,
        createdAt: timestamp || Date.now(),
        severity,
        event_name: eventName,
        extra,
        token: this.$auth.token,
      };
      // Filter out optional undefined keys
      Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
      return axios(this, {
        method: "POST",
        url: `${this._baseUrl()}/logs`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
      });
    },
  },
};
