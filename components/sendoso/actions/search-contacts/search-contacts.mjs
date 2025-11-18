import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-search-contacts",
  name: "Search Contacts",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Search for contacts by various criteria. [See the documentation](https://sendoso.docs.apiary.io/#reference/contact-management)",
  type: "action",
  props: {
    sendoso,
    query: {
      type: "string",
      label: "Search Query",
      description: "Search query string (searches across name, email, company).",
    },
    limit: {
      propDefinition: [
        sendoso,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      query,
      limit,
    } = this;

    const response = await this.sendoso.searchContacts({
      $,
      params: {
        query,
        limit,
      },
    });

    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || 0);
    $.export("$summary", `Found ${count} contact(s) matching "${query}"`);
    return response;
  },
};

