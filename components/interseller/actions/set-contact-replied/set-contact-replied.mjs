import interseller from "../../interseller.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "interseller-set-contact-replied",
  name: "Set Contact Replied",
  description: "Update an existing contact to indicate as contacted. [See the documentation](https://interseller.readme.io/reference/set-contact-replied)",
  version: "0.0.1",
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
      propDefinition: [
        interseller,
        "booked",
      ],
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
      contactId: this.contactId,
      data: {
        booked: this.booked,
        sentiment: this.sentiment,
      },
    });
    $.export("$summary", `Successfully updated contact ${this.contactId} as replied with sentiment ${this.sentiment}`);
    return response;
  },
};
