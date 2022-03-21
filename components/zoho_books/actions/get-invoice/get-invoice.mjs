// legacy_hash_id: a_Mdie64
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_books-get-invoice",
  name: "Get Invoice",
  description: "Gets the details of an invoice.",
  version: "0.2.1",
  type: "action",
  props: {
    zoho_books: {
      type: "app",
      app: "zoho_books",
    },
    organization_id: {
      type: "string",
      description: "In Zoho Books, your business is termed as an organization. If you have multiple businesses, you simply set each of those up as an individual organization. Each organization is an independent Zoho Books Organization with it's own organization ID, base currency, time zone, language, contacts, reports, etc.\n\nThe parameter `organization_id` should be sent in with every API request to identify the organization.\n\nThe `organization_id` can be obtained from the GET `/organizations` API's JSON response. Alternatively, it can be obtained from the **Manage Organizations** page in the admin console.",
    },
    invoice_id: {
      type: "string",
      description: "ID of the invoice to get details.",
    },
    print: {
      type: "string",
      description: "Print the exported pdf. Allowed Values: `true`, `false`, `on` and `off`",
      optional: true,
      options: [
        "true",
        "false",
        "on",
        "off",
      ],
    },
    accept: {
      type: "string",
      description: "Get the details of a particular invoice in formats such as json/ pdf/ html. Default format is json. Allowed values: `json`, `pdf`, and `html`.",
      optional: true,
      options: [
        "json",
        "pdf",
        "html",
      ],
    },
  },
  async run({ $ }) {
  //See the API docs: https://www.zoho.com/books/api/v3/#Invoices_Get_an_invoice

    if (!this.organization_id || !this.invoice_id) {
      throw new Error("Must provide organization_id, and invoice_id parameters.");
    }

    return await axios($, {
      method: "get",
      url: `https://books.${this.zoho_books.$auth.base_api_uri}/api/v3/invoices/${this.invoice_id}?organization_id=${this.organization_id}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${this.zoho_books.$auth.oauth_access_token}`,
      },
      params: {
        print: this.print,
        accept: this.accept,
      },
    });
  },
};
