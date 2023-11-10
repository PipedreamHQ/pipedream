import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pingdom",
  propDefinitions: {
    checkName: {
      type: "string",
      label: "Check Name",
      description: "The name of the check",
    },
    host: {
      type: "string",
      label: "Host",
      description: "The target host for the check",
    },
    type: {
      type: "string",
      label: "Check Type",
      description: "The type of check (e.g., 'http', 'ping')",
      options: [
        {
          label: "HTTP",
          value: "http",
        },
        {
          label: "HTTP Custom",
          value: "httpcustom",
        },
        {
          label: "TCP",
          value: "tcp",
        },
        {
          label: "Ping",
          value: "ping",
        },
        {
          label: "DNS",
          value: "dns",
        },
        {
          label: "UDP",
          value: "udp",
        },
        {
          label: "SMTP",
          value: "smtp",
        },
        {
          label: "POP3",
          value: "pop3",
        },
        {
          label: "IMAP",
          value: "imap",
        },
      ],
      default: "http",
    },
    // Include other required and optional prop definitions here.
  },
  methods: {
    _baseUrl() {
      return "https://api.pingdom.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async createCheck({
      checkName,
      host,
      ...otherOpts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/checks",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: checkName,
          host,
          type: "http", // Set type to `http` as required
          ...otherOpts,
        },
      });
    },
    // Include other methods to emit events for new checks and alerts here.
  },
};
