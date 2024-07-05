import twoChat from "../../2chat.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "2chat-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in 2Chat.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    twoChat,
    name: {
      propDefinition: [
        twoChat,
        "name",
      ],
    },
    phoneNumber: {
      propDefinition: [
        twoChat,
        "phoneNumber",
      ],
    },
    email: {
      propDefinition: [
        twoChat,
        "email",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        twoChat,
        "company",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.twoChat.createContact(
      this.name,
      this.phoneNumber,
      this.email,
      this.company,
    );
    $.export("$summary", `Successfully created contact ${this.name}`);
    return response;
  },
};
