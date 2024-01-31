import dexatel from "../../dexatel.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dexatel-create-contact",
  name: "Create Contact",
  description: "Allows creation of a new contact on the user's Dexatel account.",
  version: "0.0.1",
  type: "action",
  props: {
    dexatel,
    contactName: {
      propDefinition: [
        dexatel,
        "contactName",
      ],
    },
    contactNumber: {
      propDefinition: [
        dexatel,
        "contactNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dexatel.createContact({
      contactName: this.contactName,
      contactNumber: this.contactNumber,
    });
    $.export("$summary", `Successfully created contact ${this.contactName} with number ${this.contactNumber}`);
    return response;
  },
};
