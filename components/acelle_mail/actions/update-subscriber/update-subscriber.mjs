import app from "../../acelle_mail.app.mjs";

export default {
  name: "Update Subscriber",
  version: "0.0.2",
  key: "acelle_mail-update-subscriber",
  description: "Updates a customer. [See the documentation](https://api.acellemail.com/#subscribers_update)",
  type: "action",
  props: {
    app,
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
    subscriberId: {
      propDefinition: [
        app,
        "subscriberId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Customer email",
    },
    firstName: {
      type: "string",
      label: "First name",
      description: "Customer first name",
    },
    lastName: {
      type: "string",
      label: "Last name",
      description: "Customer last name",
    },
  },
  async run({ $ }) {
    const response = await this.app.updateSubscriber({
      $,
      subscriberId: this.subscriberId,
      data: {
        "EMAIL": this.email,
        "FIRST_NAME": this.firstName,
        "LAST_NAME": this.lastName,
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated subscriber with ID \`${response.subscriber_uid}\``);
    }

    return response;
  },
};
