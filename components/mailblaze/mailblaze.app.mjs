import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailblaze",
  propDefinitions: {
    listUid: {
      type: "string",
      label: "List UID",
      description: "The UID of the mailing list",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber",
    },
    fname: {
      type: "string",
      label: "First Name",
      description: "The first name of the subscriber",
      optional: true,
    },
    lname: {
      type: "string",
      label: "Last Name",
      description: "The last name of the subscriber",
      optional: true,
    },
    customTagName: {
      type: "string",
      label: "Custom Tag Name",
      description: "Custom data for the subscriber",
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.mailblaze.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async addSubscriber({
      listUid, email, fname, lname, customTagName,
    }) {
      const data = {
        EMAIL: email,
        ...(fname && {
          FNAME: fname,
        }),
        ...(lname && {
          LNAME: lname,
        }),
        ...(customTagName && {
          CUSTOM_TAG_NAME: customTagName,
        }),
      };
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listUid}/subscribers`,
        data,
      });
    },
    async updateSubscriber({
      listUid, email, fname, lname, customTagName,
    }) {
      const subscribers = await this._makeRequest({
        path: `/lists/${listUid}/subscribers/search-by-email`,
        params: {
          EMAIL: email,
        },
      });
      if (!subscribers.length) {
        throw new Error("Subscriber not found");
      }
      const subscriberUid = subscribers[0].subscriber_uid;

      const data = {
        ...(email && {
          EMAIL: email,
        }),
        ...(fname && {
          FNAME: fname,
        }),
        ...(lname && {
          LNAME: lname,
        }),
        ...(customTagName && {
          CUSTOM_TAG_NAME: customTagName,
        }),
      };
      return this._makeRequest({
        method: "PUT",
        path: `/lists/${listUid}/subscribers/${subscriberUid}`,
        data,
      });
    },
  },
};
