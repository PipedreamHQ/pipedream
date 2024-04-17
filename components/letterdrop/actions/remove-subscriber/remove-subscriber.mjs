import letterdrop from "../../letterdrop.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "letterdrop-remove-subscriber",
  name: "Remove Subscriber",
  description: "Removes a subscriber from your publication if the email matches an existing one. [See the documentation](https://docs.letterdrop.com/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    letterdrop,
    email: {
      propDefinition: [
        letterdrop,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.letterdrop.removeSubscriber({
      email: this.email,
    });

    $.export("$summary", `Successfully removed subscriber with email: ${this.email}`);
    return response;
  },
};
