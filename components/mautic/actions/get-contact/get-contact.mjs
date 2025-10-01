import mautic from "../../mautic.app.mjs";

export default {
  key: "mautic-get-contact",
  name: "Get Contact",
  description: "Gets an individual contact by ID. [See docs](https://developer.mautic.org/#get-contact)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mautic,
    contactId: {
      propDefinition: [
        mautic,
        "contactId",
      ],
      description: "ID of the contact to get details",
    },
  },
  async run({ $ }) {
    const response = await this.mautic.getContact({
      $,
      contactId: this.contactId,
    });
    $.export("$summary", "Successfully retrieved contact");
    return response;
  },
};
