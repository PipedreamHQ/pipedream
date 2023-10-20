import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gist",
  propDefinitions: {
    contactId: {
      label: "Contact Id",
      description: "The Id of the contact that will be retrieved",
      type: "integer",
      async options({
        page, tagId,
      }) {
        const { contacts } = await this.listContacts({
          params: {
            page: page + 1,
            tag_id: tagId,
          },
        });

        return contacts.map(({
          name, email, id,
        }) => ({
          label: `${email} ${name || ""}`,
          value: id,
        }));
      },
    },
    tagId: {
      label: "Tag",
      description: "The tag that will be added",
      type: "string",
      withLabel: true,
      async options({ page }) {
        const { tags } = await this.listTags({
          params: {
            page: page + 1,
          },
        });

        return tags.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    campaignId: {
      label: "Campaign Id",
      description: "The id of the campaign",
      type: "string",
      withLabel: true,
      async options({ page }) {
        const { campaigns } = await this.listCampaigns({
          params: {
            page: page + 1,
          },
        });

        return campaigns.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    email: {
      label: "Email",
      description: "The contact's email address. Required on create. Required if no user_id is supplied on update.",
      type: "string",
    },
    userId: {
      label: "User Id",
      description: "A unique string identifier for the user. It is required to create Contact of type User. Required on create. Required if no email is supplied.",
      type: "string",
      async options({ page }) {
        const { contacts } = await this.listUsers({
          params: {
            page: page + 1,
          },
        });

        return contacts.map(({
          name, email, id: value,
        }) => ({
          label: `${email} ${name || ""}`,
          value,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.getgist.com";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherConfig
    }) {
      const config = {
        url: `${this._getBaseUrl()}/${path}`,
        headers: this._getHeaders(),
        ...otherConfig,
      };

      return axios($, config);
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `contacts/${contactId}`,
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        path: "tags",
        ...args,
      });
    },
    listCampaigns(args = {}) {
      return this._makeRequest({
        path: "campaigns",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    createOrUpdateContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contacts",
        ...args,
      });
    },
    addOrRemoveContactInCampaign(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "campaigns",
        ...args,
      });
    },
    updateTagToContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "tags",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        params.per_page = 60;

        const { contacts } = await fn({
          params,
          ...args,
        });

        for (const d of contacts) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = contacts.length;

      } while (hasMore);
    },
  },
};
