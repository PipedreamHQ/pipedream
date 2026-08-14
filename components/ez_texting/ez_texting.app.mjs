import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import {
  DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "ez_texting",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The contact's phone number, e.g. `5551234567`.",
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: "One or more phone numbers, e.g. `5551234567`.",
    },
    groupIds: {
      type: "string[]",
      label: "Group IDs",
      description: "IDs of the contact groups to use.",
      optional: true,
      async options({ page }) {
        const { content } = await this.listContactGroups({
          params: {
            page,
            size: MAX_PAGE_SIZE,
          },
        });
        return content?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    fromNumber: {
      type: "string",
      label: "From Number",
      description: "The number to send from. Only required when the account has more than one number available to send from.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://a.eztexting.com/v1";
    },
    /**
     * EZ Texting authenticates with HTTP Basic, where the username is the
     * account's `appKey` (or user email) and the password its `appSecret` (or
     * user password). See
     * https://developers.eztexting.com/reference/create_5-1.
     *
     * Which of those two namings Pipedream's managed auth exposes on `$auth`
     * could not be confirmed while these components were written — the app had
     * no components and no connected account to inspect — so both are accepted.
     * Run `authKeys()` from a workflow once an account is connected to print
     * the field names the platform actually supplies, then collapse this to the
     * single pair that is real.
     */
    _auth() {
      const {
        app_key: appKey,
        app_secret: appSecret,
        username,
        password,
      } = this.$auth;

      const user = appKey || username;
      const pass = appSecret || password;

      if (!user || !pass) {
        throw new ConfigurationError(
          `Could not read EZ Texting credentials from the connected account. Expected an app key/secret (or username/password) pair on \`$auth\`, which supplied: ${Object.keys(this.$auth).join(", ") || "nothing"}.`,
        );
      }

      return {
        username: user,
        password: pass,
      };
    },
    // Kept from the scaffolded app file: it prints the field names the platform
    // supplies on `$auth`, which is how the assumption in `_auth()` gets
    // settled. Safe to drop once that is confirmed.
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    listMessages({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/messages",
        params: {
          size: DEFAULT_PAGE_SIZE,
          ...params,
        },
        ...opts,
      });
    },
    getContact({
      phoneNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/${encodeURIComponent(phoneNumber)}`,
        ...opts,
      });
    },
    createOrUpdateContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    blockNumbers(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/blocks",
        ...opts,
      });
    },
    listContactGroups({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/contact-groups",
        params: {
          size: DEFAULT_PAGE_SIZE,
          ...params,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/subscriptions",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/subscriptions/${hookId}`,
        ...opts,
      });
    },
  },
};
