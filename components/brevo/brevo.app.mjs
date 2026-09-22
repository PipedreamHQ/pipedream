import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "brevo",
  propDefinitions: {
    listIds: {
      type: "string[]",
      label: "List IDs",
      description: "Array with the IDs of one or more lists to be either inserted or updated,\n\n**On update the contact will be removed from previous lists**",
      optional: true,
      async options({ prevContext }) {
        return this.getListsPaginated(prevContext);
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.brevo.com/v3";
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "api-key": `${this.$auth.api_key}`,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async createHook(ctx = this, createWebhookData) {
      return await axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/webhooks",
        data: createWebhookData,
      }));
    },
    async deleteHook(ctx = this, hookId) {
      return await axios(ctx, this._getRequestParams({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
      }));
    },
    async existingContactByIdentifier(ctx = this, identifier) {
      try {
        return await axios(ctx, this._getRequestParams({
          method: "GET",
          path: `/contacts/${identifier}`,
        }));
      } catch (exception) {
        if (exception.status === 404) {
          return false;
        }
        throw exception;
      }
    },
    async getContactsPaginated(prevContext, serializedValue = false) {
      const limit = 20;
      const offset = prevContext?.total
        ? prevContext?.offset + limit
        : 0;
      const contactsLists = await this.getContacts(prevContext, limit, offset);
      const options = contactsLists.contacts.map((element) => {
        const elementSerializedValue = {
          id: element.id,
          email: element.email,
          name: element.attributes.NAME || element.attributes.FIRSTNAME || element.attributes.FNAME || "contact",
        };
        return {
          label: element.email,
          value: serializedValue ?
            JSON.stringify(elementSerializedValue) :
            element.id,
        };
      });
      return {
        options,
        context: {
          offset: offset,
          total: contactsLists.count,
        },
      };
    },
    async getContacts(ctx = this, limit, offset) {
      try {
        return await axios(ctx, this._getRequestParams({
          method: "GET",
          path: `/contacts?limit=${limit}&offset=${offset}`,
        }));
      } catch (exception) {
        if (exception.status === 404) {
          return false;
        }
        throw exception;
      }
    },
    async getContactAttributes(ctx = this) {
      return await axios(ctx, this._getRequestParams({
        method: "GET",
        path: "/contacts/attributes",
      }));
    },
    async getListsPaginated(prevContext) {
      const limit = 20;
      const offset = prevContext?.total
        ? prevContext?.offset + limit
        : 0;
      const emailLists = await this.getLists(prevContext, limit, offset);
      const options = emailLists.lists.map((element) => {
        return {
          label: element.name,
          value: element.id,
        };
      });
      return {
        options,
        context: {
          offset: offset,
          total: emailLists.count,
        },
      };
    },
    async getLists(ctx = this, limit, offset) {
      return await axios(ctx, this._getRequestParams({
        method: "GET",
        path: `/contacts/lists?limit=${limit}&offset=${offset}&sort=desc`,
      }));
    },
    async getSendersFormattedOptions(prevContext) {
      const sendersList = await this.getSenders(prevContext);
      const options = sendersList.senders.map((element) => {
        return {
          label: element.name,
          value: JSON.stringify({
            name: element.name,
            email: element.email,
          }),
        };
      });
      return {
        options,
      };
    },
    async getSenders(ctx = this) {
      return await axios(ctx, this._getRequestParams({
        method: "GET",
        path: "/senders",
      }));
    },
    async getTemplatesPaginated(prevContext) {
      const limit = 20;
      const offset = prevContext?.total
        ? prevContext?.offset + limit
        : 0;
      const templatesList = await this.getTemplates(prevContext, limit, offset);
      const options = templatesList.templates.map((element) => {
        return {
          label: element.name,
          value: element.id,
        };
      });
      return {
        options,
        context: {
          offset: offset,
          total: templatesList.count,
        },
      };
    },
    async getTemplates(ctx = this, limit, offset) {
      return await axios(ctx, this._getRequestParams({
        method: "GET",
        path: `/smtp/templates?limit=${limit}&offset=${offset}&sort=desc`,
      }));
    },
    async addContact(ctx = this, attributes, listIds) {
      const newContactData = {
        email: attributes.EMAIL,
        attributes,
      };
      if (listIds) {
        newContactData.listIds = listIds;
      }
      return axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/contacts",
        data: newContactData,
      }));
    },
    async updateContact(ctx = this, identifier, attributes, listIds, unlinkListIds) {
      const updateContactData = {
        attributes,
      };
      if (listIds) {
        updateContactData.listIds = listIds;
      }
      if (unlinkListIds) {
        updateContactData.unlinkListIds = unlinkListIds;
      }
      return axios(ctx, this._getRequestParams({
        method: "PUT",
        path: `/contacts/${identifier}`,
        data: updateContactData,
      }));
    },
    async sendTransactionalEmail(
      ctx = this,
      useTemplate,
      templateId,
      sender,
      replyTo,
      to,
      subject,
      htmlContent,
      textContent,
      tags,
      cc,
      bcc,
      params,
    ) {
      const emailData = {
        to,
        replyTo,
      };
      if (useTemplate) {
        emailData.templateId = templateId;
      } else {
        emailData.sender = sender;
        emailData.subject = subject;
        emailData.htmlContent = htmlContent;
      }
      if (Array.isArray(tags) && tags.length > 0) {
        emailData.tags = tags;
      }
      if (Array.isArray(cc) && cc.length > 0) {
        emailData.cc = cc;
      }
      if (Array.isArray(bcc) && bcc.length > 0) {
        emailData.bcc = bcc;
      }
      if (textContent) {
        emailData.textContent = textContent;
      }
      if (params) {
        emailData.params = params;
      }
      return axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/smtp/email",
        data: emailData,
      }));
    },
  },
};
