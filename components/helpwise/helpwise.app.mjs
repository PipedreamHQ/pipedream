import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";
import { filterInboxes } from "./common/utils.mjs";

const V1_BASE = "https://apis.helpwise.io";
const DEV_BASE = "https://app.helpwise.io";

export default {
  type: "app",
  app: "helpwise",
  propDefinitions: {
    mailboxId: {
      type: "integer",
      label: "Mailbox ID",
      description: "The mailbox/inbox ID of your email. Only inboxes with send email permission are shown.",
      async options({ page }) {
        const { data } = await this.getMailboxes({
          data: {
            page: page + 1,
          },
        });
        return filterInboxes(data ?? []).map(({
          id: value, displayName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    to: {
      type: "string[]",
      label: "To",
      description: "To email addresses of your customers",
      async options({ page }) {
        const { results } = await this.getContacts({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });

        return results.reduce((acc, {
          firstname, lastname, emails,
        }) => {
          (emails ?? []).forEach((email) => {
            if (email) {
              acc.push({
                label: `${firstname} ${lastname} (${email})`,
                value: email,
              });
            }
          });
          return acc;
        }, []);
      },
    },
    threadIds: {
      type: "string[]",
      label: "Thread IDs",
      description: "Thread IDs to apply tags to.",
      async options({ prevContext }) {
        const {
          threads, nextPageToken,
        } = await this.getConversations({
          params: {
            pageToken: prevContext?.nextPageToken,
          },
        });
        return {
          options: (threads ?? []).map(({
            id: value, snippet: label,
          }) => ({
            label,
            value,
          })) || [],
          context: {
            nextPageToken,
          },
        };
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tag IDs",
      description: "Tag IDs to apply to conversations.",
      async options() {
        const data = await this.getTags();

        return (data || []).map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    inboxId: {
      type: "string",
      label: "Inbox ID",
      description: "The Helpwise inbox ID used in `/inboxes/{inboxId}/conversations/...` API paths. [See the documentation](https://documenter.getpostman.com/view/29744652/2s9YC5yYKf#intro)",
    },
  },
  methods: {
    _headersJson() {
      return {
        "Authorization": `${this.$auth.api_key}:${this.$auth.api_secret}`,
        "Content-Type": "application/json",
        "Accept": "gzip, deflate",
      };
    },
    _auth() {
      return {
        username: this.$auth.api_key,
        password: this.$auth.api_secret,
      };
    },
    _requestV1({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${V1_BASE}${path}`,
        auth: this._auth(),
        ...opts,
      });
    },
    _requestDev({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${DEV_BASE}${path}`,
        headers: this._headersJson(),
        ...opts,
      });
    },
    getContacts(opts = {}) {
      return this._requestV1({
        path: "/contacts",
        ...opts,
      });
    },
    getMailboxes(opts = {}) {
      return this._requestDev({
        method: "POST",
        path: "/dev-apis/mailboxes/list",
        ...opts,
      });
    },
    getConversations(opts = {}) {
      return this._requestV1({
        path: "/conversations",
        ...opts,
      });
    },
    getTags(opts = {}) {
      return this._requestV1({
        path: "/tags",
        ...opts,
      });
    },
    sendMail(opts = {}) {
      return this._requestDev({
        method: "POST",
        path: "/dev-apis/emails/send_mail",
        ...opts,
      });
    },
    applyTags(opts = {}) {
      return this._requestV1({
        method: "POST",
        path: "/tags/apply",
        ...opts,
      });
    },
    closeConversation(opts = {}) {
      return this._requestV1({
        method: "PUT",
        path: "/conversations/action/close",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, fieldData, ...opts
    }) {
      let hasMore = null;
      let count = 0;

      do {
        params.pageToken = hasMore;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data[fieldData]) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.nextPageToken;

      } while (hasMore);
    },
  },
};
