import newsman from "../../newsman.app.mjs";

export default {
  key: "newsman-update-subscriber",
  name: "Update Subscriber",
  description: "Update a subscriber in Newsman. [See the documentation](https://kb.newsman.com/api/1.2/subscriber.update)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    newsman,
    listId: {
      propDefinition: [
        newsman,
        "listId",
      ],
    },
    subscriberId: {
      propDefinition: [
        newsman,
        "subscriberId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    email: {
      propDefinition: [
        newsman,
        "email",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        newsman,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        newsman,
        "lastName",
      ],
    },
  },
  async run({ $ }) {
    const subscriber = await this.newsman.getSubscriber({
      $,
      params: {
        subscriber_id: this.subscriberId,
      },
    });
    const response = await this.newsman.updateSubscriber({
      $,
      data: {
        subscriber_id: this.subscriberId,
        email: this.email || subscriber.email,
        firstname: this.firstName || subscriber.firstname,
        lastname: this.lastName || subscriber.lastname,
      },
    });
    if (response === true) {
      $.export("$summary", `Subscriber with ID: ${this.subscriberId} updated successfully`);
    }
    return response;
  },
};
