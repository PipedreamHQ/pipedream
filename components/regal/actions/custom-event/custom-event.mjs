import app from "../../regal.app.mjs";

export default {
  key: "regal-custom-event",
  name: "Create or Update Contact or Event",
  description: "Create and update contacts or add events to contacts. [See the documentation](https://developer.regal.io/reference/api)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
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
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    eventSource: {
      propDefinition: [
        app,
        "eventSource",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.customEvent({
      $,
      data: {
        userId: this.userId,
        traits: {
          firstName: this.firstName,
          lastName: this.lastName,
          phones: {
            [this.phone]: {},
          },
          emails: {
            [this.email]: {},
          },
        },
        name: this.name,
        eventSource: this.eventSource,
      },
    });

    $.export("$summary", `Successfully generated custom event for contact with ID '${this.userId}'`);

    return response;
  },
};
