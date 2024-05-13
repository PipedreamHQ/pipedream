import thoughtly from "../../thoughtly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "thoughtly-create-contact",
  name: "Create Contact",
  description: "Generates a new contact within your Thoughtly team.",
  version: "0.0.1",
  type: "action",
  props: {
    thoughtly,
    phoneNumber: thoughtly.propDefinitions.phoneNumber,
    name: {
      propDefinition: [
        thoughtly,
        "name",
        (c) => ({
          optional: true,
        }),
      ],
    },
    email: {
      propDefinition: [
        thoughtly,
        "email",
        (c) => ({
          optional: true,
        }),
      ],
    },
    countryCode: {
      propDefinition: [
        thoughtly,
        "countryCode",
        (c) => ({
          optional: true,
        }),
      ],
    },
    tags: {
      propDefinition: [
        thoughtly,
        "tags",
        (c) => ({
          optional: true,
        }),
      ],
    },
    attributes: {
      propDefinition: [
        thoughtly,
        "attributes",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.thoughtly.createContact({
      phoneNumber: this.phoneNumber,
      name: this.name,
      email: this.email,
      countryCode: this.countryCode,
      tags: this.tags,
      attributes: this.attributes,
    });
    $.export("$summary", `Successfully created contact with phone number ${this.phoneNumber}`);
    return response;
  },
};
