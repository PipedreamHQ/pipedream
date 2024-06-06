import samsara from "../../samsara.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "samsara-create-contact",
  name: "Create Contact",
  description: "Adds a new contact to the organization. [See the documentation](https://developers.samsara.com/reference/createcontact)",
  version: "0.0.1",
  type: "action",
  props: {
    samsara,
    firstName: samsara.propDefinitions.firstName,
    lastName: samsara.propDefinitions.lastName,
    email: samsara.propDefinitions.email,
    phoneNumber: samsara.propDefinitions.phoneNumber,
  },
  async run({ $ }) {
    const response = await this.samsara.createContact({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
    });
    $.export("$summary", `Successfully created contact ${this.firstName} ${this.lastName}`);
    return response;
  },
};
