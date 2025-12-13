import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-find-contact",
  name: "Find Contact",
  description: "Searches for contacts in your help desk portal. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Search#Search_SearchContacts)",
  type: "action",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
    search: {
      type: "string",
      label: "Search",
      description: "Search throughout the contact with `wildcard search` strategy",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      orgId,
      search,
    } = this;

    const { data: contacts = [] } =
      await this.zohoDesk.searchContacts({
        headers: {
          orgId,
        },
        params: {
          _all: search,
          sortBy: "relevance",
        },
      });

    $.export("$summary", `Successfully found ${contacts.length} contact(s)`);

    return contacts;
  },
};
