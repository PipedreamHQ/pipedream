// legacy_hash_id: a_RAiV28
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_books-list-contacts",
  name: "List Contacts",
  description: "Lists all contacts given the organization_id.",
  version: "0.4.1",
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
    page: {
      type: "string",
      description: "By default first page will be listed. For navigating through pages, use the `page` parameter.",
      optional: true,
    },
    per_page: {
      type: "string",
      description: "The `per_page` parameter can be used to set the number of records that you want to receive in response.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://www.zoho.com/books/api/v3/#Contacts_List_Contacts

    return await axios($, {
      method: "get",
      url: `https://books.${this.zoho_books.$auth.base_api_uri}/api/v3/contacts?organization_id=${this.organization_id}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${this.zoho_books.$auth.oauth_access_token}`,
      },
      params: {
        page: this.page,
        per_page: this.per_page,
      },
    });
  },
};
