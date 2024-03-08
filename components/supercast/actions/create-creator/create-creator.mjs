import supercast from "../../supercast.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "supercast-create-creator",
  name: "Create a Channel Creator",
  description: "Creates a new channel creator on Supercast. [See the documentation](https://supercast.readme.io/reference/postcreators)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    supercast,
    email: {
      propDefinition: [
        supercast,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        supercast,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        supercast,
        "lastName",
      ],
    },
    password: {
      propDefinition: [
        supercast,
        "password",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.supercast.createChannelCreator({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
    });

    $.export("$summary", `Successfully created channel creator with email: ${this.email}`);
    return response;
  },
};
