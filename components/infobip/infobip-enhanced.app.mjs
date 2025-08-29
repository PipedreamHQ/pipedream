import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";
import InfobipOpenAPIGenerator from "./lib/openapi-generator.mjs";

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
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "URL of the media file to be sent in the MMS. Must be publicly accessible.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "MIME type of the media file (e.g., image/jpeg, image/png, video/mp4).",
      options: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/3gpp",
        "audio/mpeg",
        "audio/wav",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject line for the MMS message.",
    },
    // Dynamic prop definitions from OpenAPI
    sender: {
      type: "string",
      label: "Sender",
      description: "The sender ID which can be alphanumeric or numeric (e.g., CompanyName). Make sure you don't exceed character limit.",
    },
    destinations: {
      type: "string[]",
      label: "Destinations",
      description: "Array of destination phone numbers in international format.",
    },
    messageText: {
      type: "string",
      label: "Message Text", 
      description: "Content of the message being sent.",
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

    // Initialize OpenAPI generator
    async _initOpenAPI() {
      if (!this._openApiGenerator) {
        this._openApiGenerator = new InfobipOpenAPIGenerator(this);
        await this._openApiGenerator.generateMethods();
      }
      return this._openApiGenerator;
    },

    // Get available OpenAPI methods
    async getOpenAPIMethods() {
      const generator = await this._initOpenAPI();
      return generator.listMethods();
    },

    // Call any OpenAPI method dynamically
    async callOpenAPIMethod(methodName, opts = {}) {
      const generator = await this._initOpenAPI();
      const method = generator.getMethod(methodName);
      
      if (!method) {
        throw new Error(`Method '${methodName}' not found. Available methods: ${generator.listMethods().join(', ')}`);
      }

      return this._makeRequest({
        method: method.method,
        path: method.path,
        ...opts,
      });
    },

    // Existing manual methods for backward compatibility
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

    // Legacy SMS methods (for backward compatibility)
    sendSms(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sms/2/text/advanced",
        ...opts,
      });
    },
    sendSmsV3(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sms/3/messages",
        ...opts,
      });
    },

    // Enhanced SMS sending with OpenAPI v3 endpoint
    /**
     * Send SMS message using the latest v3 API
     * @see https://api.infobip.com/platform/1/openapi/sms
     */
    async sendSmsMessage(opts = {}) {
      return this.callOpenAPIMethod('sendSmsMessages', opts);
    },

    /**
     * Get SMS delivery reports using v3 API
     */
    async getSmsDeliveryReports(opts = {}) {
      return this.callOpenAPIMethod('getSmsDeliveryReports', opts);
    },

    /**
     * Get SMS logs using v3 API  
     */
    async getSmsLogs(opts = {}) {
      return this.callOpenAPIMethod('getSmsLogs', opts);
    },

    // Other communication channels
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
    sendMms(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/mms/1/text",
        ...opts,
      });
    },

    // Hook management
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

    // Utility methods for debugging
    async debugOpenAPISpec() {
      const generator = await this._initOpenAPI();
      return generator.spec;
    },

    async debugAvailableMethods() {
      const generator = await this._initOpenAPI();
      const methods = generator.listMethods();
      console.log(`📋 Available OpenAPI methods (${methods.length}):`, methods);
      return methods;
    },
  },
};
