import interseller from "../../interseller.app.mjs";

export default {
  key: "interseller-set-contact-replied",
  name: "Set Contact Replied",
  description: "Update an existing contact to indicate as contacted. [See the documentation](https://interseller.readme.io/reference/set-contact-replied)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    interseller,
    contactId: {
      propDefinition: [
        interseller,
        "contactId",
      ],
    },
    booked: {
      type: "boolean",
      label: "Booked",
      description: "A true/false value to indicate if the contact also booked a meeting.",
      optional: true,
    },
    sentiment: {
      propDefinition: [
        interseller,
        "sentiment",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.interseller.setContactReplied({
      $,
      contactId: this.contactId,
      data: {
        booked: this.booked,
        sentiment: this.sentiment,
      },
    });
    $.export("$summary", `Successfully replied contact ${this.contactId}!`);
    return response;
  },
};
