import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "goodbits",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Subscriber's email address",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Subscriber's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Subscriber's last name",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "New status of the subscriber",
      options: constants.STATUS_OPTIONS,
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL of the new link",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title associated with the link",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the link",
      optional: true,
    },
    fetchRemoteThumbnailUrl: {
      type: "string",
      label: "Fetch Remote Thumbnail URL",
      description: "URL to fetch a remote thumbnail image",
      optional: true,
    },
    imageCandidates: {
      type: "string[]",
      label: "Image Candidates",
      description: "List of candidate image URLs",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.goodbits.io/api/v1";
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
          "Authorization": `${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async createSubscriber(args = {}) {
      return this._makeRequest({
        path: "/subscribers",
        method: "post",
        ...args,
      });
    },
    async updateSubscriberStatus({
      email, ...args
    }) {
      return this._makeRequest({
        path: `/subscribers/${email}`,
        method: "put",
        ...args,
      });
    },
    async createLink(args = {}) {
      return this._makeRequest({
        path: "/links",
        method: "post",
        ...args,
      });
    },
  },
};
