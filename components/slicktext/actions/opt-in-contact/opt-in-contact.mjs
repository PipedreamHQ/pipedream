import slicktext from "../../slicktext.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "slicktext-opt-in-contact",
  name: "Opt-In Contact",
  description: "Add a new contact to your messaging list with a confirmation text. [See the documentation](https://api.slicktext.com/docs/v1/contacts)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    slicktext,
    contactNumber: {
      propDefinition: [
        slicktext,
        "contactNumber",
      ],
    },
    textwordId: {
      propDefinition: [
        slicktext,
        "textwordId",
      ],
    },
    doubleOptInMessage: {
      type: "string",
      label: "Double Opt-In Message",
      description: "The confirmation message sent to the contact. They will need to reply YES to complete subscription. Must be 160 characters or less.",
      optional: true,
    },
    name: {
      propDefinition: [
        slicktext,
        "name",
      ],
      optional: true,
    },
    emailAddress: {
      propDefinition: [
        slicktext,
        "emailAddress",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        slicktext,
        "city",
      ],
      optional: true,
    },
    state: {
      propDefinition: [
        slicktext,
        "state",
      ],
      optional: true,
    },
    zipCode: {
      propDefinition: [
        slicktext,
        "zipCode",
      ],
      optional: true,
    },
    country: {
      propDefinition: [
        slicktext,
        "country",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.slicktext.addContact({
      contactNumber: this.contactNumber,
      textwordId: this.textwordId,
      doubleOptInMessage: this.doubleOptInMessage,
      name: this.name,
      emailAddress: this.emailAddress,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
    });
    $.export("$summary", `Successfully initiated opt-in for contact with number: ${this.contactNumber}`);
    return response;
  },
};
