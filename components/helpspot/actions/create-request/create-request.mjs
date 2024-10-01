import helpspot from "../../helpspot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "helpspot-create-request",
  name: "Create Request",
  description: "Creates a new user request. At least one of the following props is needed: first name, last name, user id, email, or phone. [See the documentation](https://support.helpspot.com/index.php?pg=kb.page&id=163)",
  version: "0.0.1",
  type: "action",
  props: {
    helpspot,
    note: {
      type: "string",
      label: "Note",
      description: "The note content for the request",
    },
    firstName: {
      propDefinition: [
        helpspot,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        helpspot,
        "lastName",
      ],
    },
    userId: {
      propDefinition: [
        helpspot,
        "userId",
      ],
    },
    email: {
      propDefinition: [
        helpspot,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        helpspot,
        "phone",
      ],
    },
  },
  async run({ $ }) {
    if (!this.firstName && !this.lastName && !this.userId && !this.email && !this.phone) {
      throw new Error("You must provide at least one of the following: first name, last name, user ID, email, or phone.");
    }

    const response = await this.helpspot.createRequest({
      note: this.note,
      firstName: this.firstName,
      lastName: this.lastName,
      userId: this.userId,
      email: this.email,
      phone: this.phone,
    });

    $.export("$summary", `Successfully created request with access key: ${response.accesskey}`);
    return response;
  },
};
