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
          label: `${name} - ${email}`,
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
      optional: true,
    },
    userId: {
      label: "User Id",
      description: "A unique string identifier for the user. It is required to create Contact of type User. Required on create. Required if no email is supplied.",
      type: "string",
      optional: true,
    },
    name: {
      label: "Name",
      description: "The full name of the contact",
      type: "string",
      optional: true,
    },
    phone: {
      label: "Phone",
      description: "The contact number of the contact",
      type: "string",
      optional: true,
    },
    signedUpAt: {
      label: "Signed Up At",
      description: "The time the contact signed up",
      type: "string",
      optional: true,
    },
    lastSeenIp: {
      label: "Last Seen Ip",
      description: "The last IP address the contact visited your website from",
      type: "string",
      optional: true,
    },
    lastSeenUserAgent: {
      label: "Last Seen User Agent",
      description: "The last contact agent the contact was seen using",
      type: "string",
      optional: true,
    },
    customProperties: {
      label: "Custom  Properties",
      description: "A JSON object containing the contact's custom properties. E.g. { \"name\": \"John Doe\" }",
      type: "object",
      optional: true,
    },
    unsubscribedFromEmails: {
      label: "Unsubscribed From Emails",
      description: "If the contact has unsubscribed from emails or not",
      type: "boolean",
      optional: true,
    },
    startingEmailIndex: {
      label: "Starting Email Index",
      description: "The index of the email to send first. Defaults to 0. Required if no User Id",
      type: "integer",
      optional: true,
    },
    reactivateIfRemoved: {
      label: "Reactive If Removed",
      description: "Sending true will force subscribe the contact even if they unsubscribed from the campaign earlier.",
      type: "boolean",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.getgist.com";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $, path, ...otherConfig
    }) {
      const config = {
        url: `${this._getBaseUrl()}/${path}`,
        headers: this._getHeaders(),
        ...otherConfig,
      };

      return axios($ || this, config);
    },
    async listContacts({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "contacts",
        params,
      });
    },
    async getContact({
      $, contactId,
    }) {
      return this._makeRequest({
        $,
        path: `contacts/${contactId}`,
      });
    },
    async listTags({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "tags",
        params,
      });
    },
    async listCampaigns({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "campaigns",
        params,
      });
    },
    async updateTagToContact({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "tags",
        data,
      });
    },
    async createOrUpdateContact({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "contacts",
        data,
      });
    },
    async addOrRemoveContactInCampaign({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "campaigns",
        data,
      });
    },
  },
};
