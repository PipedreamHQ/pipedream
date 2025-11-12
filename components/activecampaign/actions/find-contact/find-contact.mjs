import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-find-contact",
  name: "Find Contact",
  description: "Finds a contact. See the docs [here](https://developers.activecampaign.com/reference/list-all-contacts).",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    activecampaign,
    search: {
      type: "string",
      label: "Search",
      description: "Filter contacts that match the given value in the contact names, organization, phone or email",
    },
  },
  async run({ $ }) {
    const { search } = this;
    const { contacts } = await this.activecampaign.listContacts({
      params: {
        search,
      },
    });

    $.export("$summary", `Successfully found ${contacts.length} contact(s)`);

    return contacts;
  },
};
