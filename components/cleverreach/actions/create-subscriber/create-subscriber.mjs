import app from "../../cleverreach.app.mjs";

export default {
  key: "cleverreach-create-subscriber",
  name: "Create Subscriber",
  description:
    "Adds a new subscriber to a mailing list. [See the documentation](https://rest.cleverreach.com/howto/#basics)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    groupId: {
      propDefinition: [
        app,
        "groupId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the new subscriber",
    },
  },
  async run({ $ }) {
    const {
      email, groupId,
    } = this;
    const response = await this.app.createSubscriber({
      $,
      groupId,
      data: {
        email,
      },
    });
    $.export(
      "$summary",
      `Successfully added ${email} to group ${groupId}`,
    );
    return response;
  },
};
