import flodesk from "../../flodesk.app.mjs";

export default {
  key: "flodesk-find-subscriber",
  name: "Find Subscriber By Email",
  description: "Find a subscriber by email address in Flodesk. [See the documentation](https://developers.flodesk.com/#tag/subscriber/operation/retrieveSubscriber)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    flodesk,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the subscriber",
    },
  },
  async run({ $ }) {
    const response = await this.flodesk.findSubscriber({
      email: this.email,
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully retrieved subscriber with ID ${response.id}.`);
    }

    return response;
  },
};
