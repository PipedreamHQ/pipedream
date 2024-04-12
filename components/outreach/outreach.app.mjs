import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "outreach",
  propDefinitions: {
    mailboxId: {
      type: "string",
      label: "Mailbox Id",
      description: "The ID of the mailboxId.",
      async options({ prevContext: { after } }) {
        if (after) {
          const params = new URLSearchParams(after);
          after = params.get("page[after]");
        }

        const {
          data, links,
        } = await this.listMailboxes({
          params: {
            "count": false,
            "page[size]": LIMIT,
            "page[after]": after,
          },
        });

        return {
          options: data.map(({
            id: value, attributes: { email: label },
          }) => ({
            label,
            value,
          })),
          context: {
            after: links.next,
          },
        };
      },
    },
    prospectId: {
      type: "string",
      label: "Prospect ID",
      description: "The ID of the prospect.",
      async options({ prevContext: { after } }) {
        if (after) {
          const params = new URLSearchParams(after);
          after = params.get("page[after]");
        }

        const {
          data, links,
        } = await this.listPropspects({
          params: {
            "count": false,
            "page[size]": LIMIT,
            "page[after]": after,
          },
        });

        return {
          options: data.map(({
            id: value, attributes: { name: label },
          }) => ({
            label,
            value,
          })),
          context: {
            after: links.next,
          },
        };
      },
    },
    sequenceId: {
      type: "string",
      label: "Sequence ID",
      description: "The ID of the sequence.",
      async options({ prevContext: { after } }) {
        if (after) {
          const params = new URLSearchParams(after);
          after = params.get("page[after]");
        }

        const {
          data, links,
        } = await this.listSequences({
          params: {
            "count": false,
            "page[size]": LIMIT,
            "page[after]": after,
          },
        });

        return {
          options: data.map(({
            id: value, attributes: { name: label },
          }) => ({
            label,
            value,
          })),
          context: {
            after: links.next,
          },
        };
      },
    },
    sharingTeamId: {
      type: "string",
      label: "Sharing Team Id",
      description: "The ID of the sharing team associated with this object. Access is currently in beta.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.outreach.io/api/v2";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      const config = {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      };
      return axios($, config);
    },
    createAccount(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/accounts",
        ...opts,
      });
    },
    createProspect(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/prospects",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
      });
    },
    listMailboxes(opts = {}) {
      return this._makeRequest({
        path: "/mailboxes",
        ...opts,
      });
    },
    listPropspects(opts = {}) {
      return this._makeRequest({
        path: "/prospects",
        ...opts,
      });
    },
    listSequences(opts = {}) {
      return this._makeRequest({
        path: "/sequences",
        ...opts,
      });
    },
    addProspectToSequence(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sequenceStates",
        ...opts,
      });
    },
  },
};
