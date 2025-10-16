import ambivo from "../../ambivo.app.mjs";

export default {
  key: "ambivo-get-contacts",
  name: "Get Contacts",
  description: "Retrieves a list of contacts in Ambivo. [See the documentation](https://fapi.ambivo.com/docs#/CRM%20Service%20Calls/get_contacts_created_crm_contacts_created_get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ambivo,
  },
  async run({ $ }) {
    const contacts = await this.ambivo.listContacts({
      $,
    });
    $.export("$summary", `Successfully retrieved ${contacts.length} contact${contacts.length === 1
      ? ""
      : "s"}`);
    return contacts;
  },
};
