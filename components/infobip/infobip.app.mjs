import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "infobip",
  propDefinitions: {
    applicationId: {
      type: "string",
      label: "Application ID",
      description: "Required for application use in a send request for outbound traffic. Returned in notification events. For more details, [see the Infobip documentation](https://www.infobip.com/docs/cpaas-x/application-and-entity-management).",
      async options({ page }) {
        const { results } = await this.listApplications({
          params: {
            page: page,
            size: LIMIT,
          },
        });

        return results.map(({
          applicationId: value, applicationName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    entityId: {
      type: "string",
      label: "Entity Id",
      description: "Required for entity use in a send request for outbound traffic. Returned in notification events. For more details, [see the Infobip documentation](https://www.infobip.com/docs/cpaas-x/application-and-entity-management).",
      async options({ page }) {
        const { results } = await this.listEntities({
          params: {
            page: page,
            size: LIMIT,
          },
        });

        return results.map(({
          entityId: value, entityName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    resourceKey: {
      type: "string",
      label: "Resource Key",
      description: "Required if `Resource` not present.",
      async options({
        page, channel,
      }) {
        const { results } = await this.listResources({
          params: {
            page: page,
            size: LIMIT,
            channel,
          },
        });

        return results.map(({ resourceId }) => resourceId);
      },
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Message destination address. Addresses must be in international format (Example: 41793026727).",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Content of the message being sent.",
    },
    from: {
      type: "string",
      label: "From",
      description: "The sender ID which can be alphanumeric or numeric (e.g., CompanyName). Make sure you don't exceed [character limit](https://www.infobip.com/docs/sms/get-started#sender-names).",
    },
    to: {
      type: "string",
      label: "To",
      description: "The destination address of the message.",
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID that uniquely identifies the message sent via WhatsApp.",
    },
  },
  methods: {
    _baseUrl() {
      return (this.$auth.base_url.startsWith("https://"))
        ? this.$auth.base_url
        : `https://${this.$auth.base_url}`;
    },
    _headers() {
      return {
        "Authorization": `App ${this.$auth.api_key}`,
        "Content-type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    listApplications(opts = {}) {
      return this._makeRequest({
        path: "/provisioning/1/applications",
        ...opts,
      });
    },
    listEntities(opts = {}) {
      return this._makeRequest({
        path: "/provisioning/1/entities",
        ...opts,
      });
    },
    listResources(opts = {}) {
      return this._makeRequest({
        path: "/provisioning/1/associations",
        ...opts,
      });
    },
    sendSms(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sms/3/messages",
        ...opts,
      });
    },
    sendViberMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/viber/2/messages",
        ...opts,
      });
    },
    sendWhatsappMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/whatsapp/1/message/text",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/resource-management/1/inbound-message-configurations",
        ...opts,
      });
    },
    deleteHook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/resource-management/1/inbound-message-configurations/${webhookId}`,
      });
    },
  },
};
