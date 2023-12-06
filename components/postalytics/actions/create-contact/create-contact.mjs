import postalytics from "../../postalytics.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "postalytics-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Postalytics. [See the documentation](https://postalytics.docs.apiary.io/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    postalytics,
    contactData: {
      type: "object",
      label: "Contact Data",
      description: "The data for the contact to create.",
    },
  },
  async run({ $ }) {
    const response = await this.postalytics.createContact({
      contactData: this.contactData,
    });

    $.export("$summary", `Successfully created contact with ID: ${response.id}`);
    return response;
  },
};
