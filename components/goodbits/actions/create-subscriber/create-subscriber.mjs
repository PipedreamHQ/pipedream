import app from "../../goodbits.app.mjs";

export default {
  key: "goodbits-create-subscriber",
  name: "Create Subscriber",
  description: "Create a new subscriber. [See the documentation](https://support.goodbits.io/article/115-goodbit-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createSubscriber({
      $,
      data: {
        subscriber: {
          email: this.email,
          first_name: this.firstName,
          last_name: this.lastName,
        },
      },
    });
    $.export("$summary", "Successfully created new subscriber");
    return response;
  },
};
