import { SUBSCRIBER_STATUS_OPTIONS } from "../../common/constants.mjs";
import sender from "../../sender.app.mjs";

export default {
  key: "sender-update-subscriber",
  name: "Update Subscriber",
  description: "Updates an existing subscriber's information. [See the documentation](https://api.sender.net/subscribers/update-subscriber/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sender,
    subscriberId: {
      propDefinition: [
        sender,
        "subscriberId",
      ],
      type: "string",
      label: "Subscriber ID",
      description: "The ID of the subscriber to update",
    },
    firstname: {
      propDefinition: [
        sender,
        "firstname",
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
    lastname: {
      propDefinition: [
        sender,
        "lastname",
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
    subscriberStatus: {
      type: "string",
      label: "Subscriber Status",
      description: "The status of the subscriber",
      options: SUBSCRIBER_STATUS_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sender.updateSubscriber({
      $,
      subscriberId: this.subscriberId,
      data: {
        firstname: this.firstname,
        lastname: this.lastname,
        groups: this.groupIds,
        phone: this.phone,
        trigger_automation: this.triggerAutomation,
        status: this.subscriberStatus,
      },
    });

    $.export("$summary", `Successfully updated subscriber with ID ${this.subscriberId}`);

    return response;
  },
};

