import pidj from "../../pidj.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pidj-create-contact",
  name: "Create Contact",
  description: "Initiates a process to add a new contact to your Pidj account.",
  version: "0.0.1",
  type: "action",
  props: {
    pidj,
    contactInformation: {
      propDefinition: [
        pidj,
        "contactInformation",
      ],
    },
    additionalNotes: {
      propDefinition: [
        pidj,
        "additionalNotes",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        pidj,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pidj.addContact({
      contactInformation: this.contactInformation,
      additionalNotes: this.additionalNotes,
      tags: this.tags,
    });
    $.export("$summary", "Successfully added a new contact");
    return response;
  },
};
