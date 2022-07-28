import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "thanks_io",
  propDefinitions: {
    subAccount: {
      type: "string",
      label: "Sub Account",
      description: "ID of subaccount to use",
      optional: true,
      async options() {
        const { data: subAccounts } = await this.listSubAccounts();
        return subAccounts.map((account) => ({
          value: account.id,
          label: account.title,
        }));
      },
    },
    mailingList: {
      type: "string",
      label: "Mailing List",
      description: "Mailing List to watch for new recipients",
      async options({
        subAccount, prevContext, page,
      }) {
        if (page !== 0 && !prevContext?.next) {
          return [];
        }
        const params = subAccount
          ? {
            sub_account: subAccount,
          }
          : undefined;
        const {
          data: mailingLists, links,
        } = prevContext?.next
          ? await this._makeRequest({
            url: prevContext,
            params,
          })
          : await this.listMailingLists({
            params,
          });
        return {
          options: mailingLists.map((list) => ({
            value: list.id,
            label: list.description,
          })),
          context: {
            next: links.next,
          },
        };
      },
    },
    recipients: {
      type: "string[]",
      label: "Recipient",
      description: "Send to selected recipients",
      async options({
        mailingListId, prevContext, page,
      }) {
        if (page !== 0 && !prevContext?.next) {
          return [];
        }
        const {
          data: recipients, ...links
        } = prevContext?.next
          ? await this._makeRequest({
            url: prevContext,
          })
          : await this.listRecipients(mailingListId);
        return {
          options: recipients.map((recipient) => ({
            value: recipient.id,
            label: recipient.name || recipient.id,
          })),
          context: {
            next: links.next_page_url,
          },
        };
      },
    },
    handwritingStyle: {
      type: "string",
      label: "Handwriting Style",
      description: "Handwriting Style to use",
      async options() {
        const { data: styles } = await this.listHandwritingStyles();
        return styles.map((style) => ({
          value: style.handwriting_style_id,
          label: style.name,
        }));
      },
    },
    giftCardBrand: {
      type: "string",
      label: "Brand",
      description: "Gift Card brand",
      async options() {
        const brands = await this.listGiftCardBrands();
        return brands.map((brand) => ({
          value: brand.brand_code,
          label: brand.title,
        }));
      },
    },
    frontImageUrl: {
      type: "string",
      label: "Front Image URL",
      description: "URL of an image to use for the background",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Recipient name",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Recipient address line 1",
    },
    address2: {
      type: "string",
      label: "Address Line 2",
      description: "Recipient address line 2",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Recipient city",
    },
    province: {
      type: "string",
      label: "State/Province",
      description: "Recipient state or province",
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Recipient postal code",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Recipient country",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Recipient email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Recipient phone number",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message to send",
    },
    returnName: {
      type: "string",
      label: "Return Name",
      description: "Name for return address",
      optional: true,
    },
    returnAddress: {
      type: "string",
      label: "Return Address",
      description: "Address line 1 for return address",
      optional: true,
    },
    returnAddress2: {
      type: "string",
      label: "Return Address 2",
      description: "Address line 2 for return address",
      optional: true,
    },
    returnCity: {
      type: "string",
      label: "Return City",
      description: "City for return address",
      optional: true,
    },
    returnState: {
      type: "string",
      label: "Return State",
      description: "State or Province for return address",
      optional: true,
    },
    returnPostalCode: {
      type: "string",
      label: "Return Postal Code",
      description: "Postal code for return address",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.thanks.io/api/v2/";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest(args) {
      const {
        $ = this,
        method = "GET",
        path,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._getHeaders(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async getRecipient(id, args = {}) {
      return this._makeRequest({
        path: `recipients/${id}`,
        ...args,
      });
    },
    async listGiftCardBrands(args = {}) {
      const cardTypes = await this._makeRequest({
        path: "giftcard-brands",
        ...args,
      });
      const brands = [];
      for (const type in cardTypes) {
        brands.push(...cardTypes[type].brands);
      }
      return brands;
    },
    async listHandwritingStyles(args = {}) {
      return this._makeRequest({
        path: "handwriting-styles",
        ...args,
      });
    },
    async listImageTemplates(args = {}) {
      return this._makeRequest({
        path: "image-templates",
        ...args,
      });
    },
    async listMailingLists(args = {}) {
      return this._makeRequest({
        path: "mailing-lists",
        ...args,
      });
    },
    async listOrders(args = {}) {
      return this._makeRequest({
        path: "orders/list",
        ...args,
      });
    },
    async listRecipients(listId, args = {}) {
      return this._makeRequest({
        path: `mailing-lists/${listId}/recipients`,
        ...args,
      });
    },
    async listSubAccounts(args = {}) {
      return this._makeRequest({
        path: "sub-accounts",
        ...args,
      });
    },
    async addRecipient(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "recipients",
        ...args,
      });
    },
    async deleteRecipient(id, args = {}) {
      return this._makeRequest({
        method: "Delete",
        path: `recipients/${id}`,
        ...args,
      });
    },
    async sendGiftCard(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "send/giftcard",
        ...args,
      });
    },
    async sendLetter(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "send/letter",
        ...args,
      });
    },
  },
};
