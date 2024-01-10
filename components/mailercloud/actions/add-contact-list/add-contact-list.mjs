import mailercloud from "../../mailercloud.app.mjs";

export default {
  key: "mailercloud-add-contact-list",
  name: "Add Contact to List",
  description: "Adds a new contact to a selected list in the user's Mailercloud account",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mailercloud,
    listId: {
      propDefinition: [
        mailercloud,
        "listId",
      ],
    },
    contactDetails: {
      propDefinition: [
        mailercloud,
        "contactDetails",
      ],
    },
    contactAttributes: {
      propDefinition: [
        mailercloud,
        "contactAttributes",
        () => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mailercloud.addContactToList(
      this.listId,
      this.contactDetails,
      this.contactAttributes,
    );
    $.export("$summary", `Successfully added contact to list ${this.listId}`);
    return response;
  },
};
