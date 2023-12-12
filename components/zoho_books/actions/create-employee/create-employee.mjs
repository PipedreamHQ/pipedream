// legacy_hash_id: a_rJiaL2
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_books-create-employee",
  name: "Create Employee",
  description: "Creates an employee for an expense.",
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
    name: {
      type: "string",
      description: "Name of the employee.",
    },
    email: {
      type: "string",
      description: "Email of the employee.",
    },
  },
  async run({ $ }) {
  // See the API docs: https://www.zoho.com/books/api/v3/#Expenses_Create_an_employee

    if (!this.organization_id || !this.name || !this.email) {
      throw new Error("Must provide organization_id, name, and email parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://books.${this.zoho_books.$auth.base_api_uri}/api/v3/employees?organization_id=${this.organization_id}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${this.zoho_books.$auth.oauth_access_token}`,
      },
      data: {
        name: this.name,
        email: this.email,
      },
    });
  },
};
