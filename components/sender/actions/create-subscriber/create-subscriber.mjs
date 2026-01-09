import sender from "../../sender.app.mjs";

export default {
  key: "sender-create-subscriber",
  name: "Create Subscriber",
  description: "Creates a new subscriber. [See the documentation](https://api.sender.net/subscribers/add-subscriber/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sender,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the subscriber",
    },
    firstname: {
      propDefinition: [
        sender,
        "firstname",
      ],
      optional: true,
    },
    lastname: {
      propDefinition: [
        sender,
        "lastname",
      ],
      optional: true,
    },
    groupIds: {
      propDefinition: [
        sender,
        "groupIds",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        sender,
        "phone",
      ],
      optional: true,
    },
    triggerAutomation: {
      propDefinition: [
        sender,
        "triggerAutomation",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sender.createSubscriber({
      $,
      data: {
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname,
        groups: this.groupIds,
        phone: this.phone,
        trigger_automation: this.triggerAutomation,
      },
    });

    $.export("$summary", `Successfully created subscriber with ID: ${response.data.id}`);

    return response;
  },
};
