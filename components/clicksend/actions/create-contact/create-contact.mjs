import clicksend from "../../clicksend.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clicksend-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in a specific list. [See the documentation](https://developers.clicksend.com/docs/rest/v3/#create-contact)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    clicksend,
    listId: {
      propDefinition: [
        clicksend,
        "listId",
      ],
    },
    name: {
      propDefinition: [
        clicksend,
        "name",
        (c) => ({
          optional: true,
        }),
      ],
    },
    phoneNumber: {
      propDefinition: [
        clicksend,
        "phoneNumber",
        (c) => ({
          optional: true,
        }),
      ],
    },
    email: {
      propDefinition: [
        clicksend,
        "email",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.clicksend.createContact({
      listId: this.listId,
      name: this.name,
      phoneNumber: this.phoneNumber,
      email: this.email,
    });

    $.export("$summary", `Successfully created new contact ${this.name
      ? this.name
      : "with no name"} in list ID ${this.listId}`);
    return response;
  },
};
