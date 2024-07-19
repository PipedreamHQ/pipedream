import specific from "../../specific.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "specific-update-create-contact",
  name: "Update or Create Contact",
  description: "Modify an existing contact's details or create a new one if the specified contact does not exist. [See the documentation](https://public-api.specific.app/docs/types/contact)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    specific,
    contactId: {
      propDefinition: [
        specific,
        "contactId",
      ],
    },
    contactInfo: {
      propDefinition: [
        specific,
        "contactInfo",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.specific.modifyOrCreateContact({
      contactId: this.contactId,
      contactInfo: this.contactInfo,
    });

    $.export("$summary", `Successfully updated or created contact with ID ${this.contactId}`);
    return response;
  },
};
