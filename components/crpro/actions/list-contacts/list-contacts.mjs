import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-list-contacts",
  name: "List Contacts",
  description:
    "Searches contacts in CRPRO by name, phone, email, tag or status. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "action",
  props: {
    crpro,
    search: {
      type: "string",
      label: "Search",
      description: "Full-text search across name, phone and email.",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Only return contacts carrying this tag.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Only return contacts in this status.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of contacts to return.",
      default: 50,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      crpro,
      search,
      tag,
      status,
      limit,
    } = this;

    const response = await crpro.listContacts({
      $,
      params: {
        search,
        tag,
        status,
        limit,
      },
    });

    const total = response?.data?.length ?? 0;
    $.export("$summary", `Found ${total} contact${total === 1
      ? ""
      : "s"}`);
    return response;
  },
};
