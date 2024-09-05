import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "regal",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "Unique identifier for your contact",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    name: {
      type: "string",
      label: "Event Name",
      description: "Name of the event",
      optional: true,
    },
    eventSource: {
      type: "string",
      label: "Event Source",
      description: "Source of the event",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact. Example: `+1 (954) 555-2399`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://events.regalvoice.com";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `${this.$auth.api_key}`,
        },
      });
    },
    customEvent(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/events",
        ...args,
      });
    },
  },
};
