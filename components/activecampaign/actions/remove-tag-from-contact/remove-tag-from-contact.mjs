import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-remove-tag-from-contact",
  name: "Remove Contact Tag",
  description: "Removes a tag from a contact. See the docs [here](https://developers.activecampaign.com/reference/remove-a-contacts-tag)",
  version: "0.5.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    activecampaign,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Contact id",
      optional: false,
      propDefinition: [
        activecampaign,
        "contacts",
      ],
    },
    contactTagId: {
      type: "string",
      label: "Contact Tag ID",
      description: "Contact tag id to remove",
      propDefinition: [
        activecampaign,
        "contactTags",
        ({ contactId }) => ({
          contactId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { contactTagId } = this;

    await this.activecampaign.removeContactTag({
      contactTagId,
    });

    const msg = "Successfully removed a tag from contact";
    $.export("$summary", msg);

    return msg;
  },
};
