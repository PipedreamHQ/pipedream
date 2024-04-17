import letterdrop from "../../letterdrop.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "letterdrop-add-subscriber",
  name: "Add Subscriber",
  description: "Adds a new subscriber to your Letterdrop publication. [See the documentation](https://docs.letterdrop.com/api)",
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
    name: {
      propDefinition: [
        letterdrop,
        "name",
        (c) => ({
          optional: true,
        }),
      ],
    },
    subscriptionTier: {
      propDefinition: [
        letterdrop,
        "subscriptionTier",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.letterdrop.addSubscriber({
      email: this.email,
      name: this.name,
      subscriptionTier: this.subscriptionTier,
    });

    $.export("$summary", `Successfully added subscriber with email: ${this.email}`);
    return response;
  },
};
