// legacy_hash_id: a_wdiVqz
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_books-get-item",
  name: "Get Item",
  description: "Gets the details of an existing item.",
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
    item_id: {
      type: "string",
      description: "ID of the item to get details.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://www.zoho.com/books/api/v3/#Items_Get_an_item

    if (!this.organization_id || !this.item_id) {
      throw new Error("Must provide organization_id, and item_id parameters.");
    }

    return await axios($, {
      method: "get",
      url: `https://books.${this.zoho_books.$auth.base_api_uri}/api/v3/items/${this.item_id}?organization_id=${this.organization_id}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${this.zoho_books.$auth.oauth_access_token}`,
      },
    });
  },
};
