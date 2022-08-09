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
        const {
          data: mailingLists, links,
        } = await this.listMailingLists({
          url: prevContext?.next,
          params: subAccount && {
            sub_account: subAccount,
          },
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
      label: "Recipients",
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
            url: prevContext.next,
          })
          : await this.listRecipients({
            listId: mailingListId,
          });
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
    postcardSize: {
      type: "string",
      label: "Size",
      description: "The size of the postcard to send. Defaults to 4x6",
      options: [
        "4x6",
        "6x9",
      ],
      optional: true,
      default: "4x6",
    },
    radiusCenter: {
      type: "string",
      label: "Radius Center Address",
      description: "Send to all addresses within radius of supplied address. Example: \"1 Main St, Warwick, NY 10990\"",
    },
    radiusDistance: {
      type: "string",
      label: "Radius Distance",
      description: "Specify the radius distance in miles",
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
        url,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: url || `${this._baseUrl()}${path}`,
        headers: this._getHeaders(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async getRecipient({
      recipientId, ...args
    } = {}) {
      return this._makeRequest({
        path: `recipients/${recipientId}`,
        ...args,
      });
    },
    async listGiftCardBrands(args = {}) {
      const cardTypes = await this._makeRequest({
        path: "giftcard-brands",
        ...args,
      });
      return Object.values(cardTypes)
        .reduce((reduction, { brands }) =>
          reduction.concat(brands), []);
    },
    async listHandwritingStyles(args = {}) {
      return this._makeRequest({
        path: "handwriting-styles",
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
    async listRecipients({
      listId, ...args
    }) {
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
        method: "DELETE",
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
    async sendNotecard(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "send/notecard",
        ...args,
      });
    },
    async sendPostcard(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "send/postcard",
        ...args,
      });
    },
  },
};
