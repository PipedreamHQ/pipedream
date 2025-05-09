import slicktext from "../../slicktext.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "slicktext-edit-contact",
  name: "Edit Contact",
  description: "Updates personal details of an existing contact. [See the documentation](https://api.slicktext.com/docs/v1/contacts#6)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    slicktext,
    contactId: {
      propDefinition: [
        slicktext,
        "contactId",
      ],
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
    const response = await this.slicktext.updateContact({
      contactId: this.contactId,
      name: this.name,
      emailAddress: this.emailAddress,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
    });

    $.export("$summary", `Successfully updated contact with ID: ${this.contactId}`);
    return response;
  },
};
