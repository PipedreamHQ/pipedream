import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whatsapp_business",
  propDefinitions: {
    phoneNumberId: {
      type: "string",
      label: "Phone Number ID",
      description: "Phone number ID that will be used to send the message. Leave blank for default.",
      optional: true,
      async options({ prevContext }) {
        let after;
        const response = await this.getPhoneNumberId({
          limit: 20,
          after: prevContext?.after,
        });
        if (response.paging.next) after = response.paging.cursors.after;
        return {
          options: response.data.map(({
            verified_name, display_phone_number, id,
          }) => ({
            label: `${verified_name}: +${display_phone_number}`,
            value: id,
          })),
          context: {
            after,
          },
        };
      },
    },
    messageTemplate: {
      type: "string",
      label: "Message Template",
      description: "Select the template you'd like to use.",
      async options({ prevContext }) {
        let after;
        const response = await this.listMessageTemplates({
          params: {
            limit: 20,
            after: prevContext?.after,
          },
        });
        if (response.paging.next) after = response.paging.cursors.after;
        const options = response.data
          .filter(this._hasTextVariablesOnly)
          .map(({
            name, id, language,
          }) => ({
            label: `${name} - ${language}`,
            value: id,
          }));
        return {
          options,
          context: {
            after,
          },
        };
      },
    },
    recipientPhoneNumber: {
      type: "string",
      label: "Recipient Phone Number",
      description: "Enter the recipient's phone number. For example, `15101234567`.",
    },
  },
  methods: {
    _hasTextVariablesOnly(template) {
      return !template.components.some(({
        type, format,
      }) => type === "HEADER" && format !== "TEXT");
    },
    _businessAccountId() {
      return this.$auth.business_account_id;
    },
    _auth() {
      return this.$auth.oauth_access_token;
    },
    _version() {
      return "v15.0";
    },
    _baseUrl() {
      return `https://graph.facebook.com/${this._version()}`;
    },
    _callFunction(paginate) {
      const fn = paginate
        ? this._paginate
        : this._makeRequest;
      return fn.bind(this);
    },
    async _paginate({ ...opts }) {
      let next, data = [];
      if (!opts.params) {
        opts.params = {};
      }
      do {
        const response = await this._makeRequest(opts);
        data.push(...response.data);
        next = response.paging.next;
        opts.params.after = response.paging.cursors.after;
      } while (next);
      return data;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}` + path,
        headers: {
          "Authorization": `Bearer ${this._auth()}`,
          "Content-Type": "application/json",
        },
      });
    },
    async getPhoneNumberId({
      paginate = false, ...opts
    }) {
      const path = `/${this._businessAccountId()}/phone_numbers`;
      return this._callFunction(paginate)({
        ...opts,
        path,
      });
    },
    async defaultPhoneNumberId(opts = {}) {
      const { data } = await this.getPhoneNumberId({
        ...opts,
        params: {
          ...opts.params,
          limit: 1,
        },
      });
      return data[0].id;
    },
    async getMessageTemplate({
      $, templateId, ...opts
    }) {
      const path = `/${templateId}`;
      return this._makeRequest({
        ...opts,
        $,
        path,
      });
    },
    async listMessageTemplates({
      paginate = false, ...opts
    }) {
      const path = `/${this._businessAccountId()}/message_templates`;
      return this._callFunction(paginate)({
        ...opts,
        path,
      });
    },
    async sendMessage({
      $, phoneNumberId, to, body, ...opts
    }) {
      const path = `/${phoneNumberId || await this.defaultPhoneNumberId()}/messages`;
      return this._makeRequest({
        ...opts,
        $,
        path,
        method: "post",
        data: {
          ...opts.data,
          to,
          messaging_product: "whatsapp",
          recipient_type: "individual",
          type: "text",
          text: {
            preview_url: false,
            body,
          },
        },
      });
    },
    async sendMessageUsingTemplate({
      $, phoneNumberId, to, name, language, components, ...opts
    }) {
      const path = `/${phoneNumberId || await this.defaultPhoneNumberId()}/messages`;
      return this._makeRequest({
        ...opts,
        $,
        path,
        method: "post",
        data: {
          ...opts.data,
          to,
          messaging_product: "whatsapp",
          type: "template",
          template: {
            name,
            language: {
              code: language,
            },
            components,
          },
        },
      });
    },
  },
};
