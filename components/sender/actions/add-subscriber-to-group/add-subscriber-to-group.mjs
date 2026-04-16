import { parseObject } from "../../common/utils.mjs";
import sender from "../../sender.app.mjs";

export default {
  key: "sender-add-subscriber-to-group",
  name: "Add Subscriber To Group",
  description: "Adds one or more subscribers to the specified group. [See the documentation](https://api.sender.net/subscribers/add-group/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sender,
    groupId: {
      propDefinition: [
        sender,
        "groupIds",
      ],
      type: "string",
      label: "Group ID",
      description: "The ID of the group to add subscribers to",
    },
    subscribers: {
      propDefinition: [
        sender,
        "subscriberId",
      ],
      type: "string[]",
      label: "Subscribers",
      description: "Array of email addresses to add to the group",
    },
    triggerAutomation: {
      type: "boolean",
      label: "Trigger Automation",
      description: "This property by default is true. You can send it as false if you want not to activate an automation.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const response = await this.sender.addSubscriberToGroup({
      $,
      groupId: this.groupId,
      data: {
        subscribers: parseObject(this.subscribers),
        trigger_automation: this.triggerAutomation,
      },
    });

    const {
      message: {
        subscribers_add_tag_group: added,
        non_existing_subscribers: nonExisting,
        invalid_emails: invalidEmails,
        subscribers_with_group_already: alreadyAdded,
      },
    } = response;

    let summary = "";
    if (added?.length > 0) {
      summary += `Successfully added ${added?.length} subscriber(s) to group.\n`;
    }
    if (alreadyAdded?.length > 0) {
      summary += `${alreadyAdded?.length} subscriber(s) were already added to the group.\n`;
    }
    if (nonExisting?.length > 0) {
      summary += `${nonExisting?.length} subscriber(s) were not found\n`;
    }
    if (invalidEmails?.length > 0) {
      summary += `${invalidEmails?.length} subscriber(s) had invalid emails`;
    }

    $.export("$summary", summary);

    return response;
  },
};

