import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendinblue",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _getBaseUrl() {
      return "https://api.sendinblue.com/v3";
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
    async existingContactByIdentifier(ctx = this, identifier) {
      try {
        return await axios(ctx, this._getRequestParams({
          method: "GET",
          path: `/contacts/${identifier}`,
        }));
      } catch (exception) {
        return false;
      }
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
      sender,
      replyTo,
      to,
      subject,
      htmlContent,
      textContent,
      tags,
      cc,
      bcc,
    ) {
      const emailData = {
        sender,
        to,
        replyTo,
        subject,
        htmlContent,
      };
      if (tags) {
        emailData.tags = tags;
      }
      if (cc) {
        emailData.cc = cc;
      }
      if (bcc) {
        emailData.bcc = bcc;
      }
      if (textContent) {
        emailData.textContent = textContent;
      }
      return axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/smtp/email",
        data: emailData,
      }));
    },
  },
};
