import app from "../../letterdrop.app.mjs";

export default {
  key: "letterdrop-remove-subscriber",
  name: "Remove Subscriber",
  description: "Removes a subscriber from your publication if the email matches an existing one. [See the documentation](https://docs.letterdrop.com/api#remove-subscriber)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  methods: {
    removeSubscriber(args = {}) {
      return this.app.post({
        path: "/subscriber/remove",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      removeSubscriber,
      email,
    } = this;

    const response = await removeSubscriber({
      $,
      data: {
        email,
      },
    });

    $.export("$summary", `Successfully removed subscriber with email \`${response.email}\``);
    return response;
  },
};
