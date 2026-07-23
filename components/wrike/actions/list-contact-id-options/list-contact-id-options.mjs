// x-pd-ai: optimized
import wrike from "../../wrike.app.mjs";

export default {
  key: "wrike-list-contact-id-options",
  name: "List Contact ID Options",
  description: "Retrieves available contacts so callers can copy an ID into free-form responsibles or contactId props in other actions. [See the documentation](https://developers.wrike.com/reference/getcontacts)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wrike,
  },
  async run({ $ }) {
    const contacts = await this.wrike.listContacts({
      $,
    });
    const options = contacts.map((contact) => ({
      label: `${contact.firstName} ${contact.lastName}`,
      value: contact.id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} contact${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
