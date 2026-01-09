import { parseObject } from "../../common/utils.mjs";
import sender from "../../sender.app.mjs";

export default {
  key: "sender-remove-subscriber-from-group",
  name: "Remove Subscriber From Group",
  description: "Removes one or more subscribers from the specified group. [See the documentation](https://api.sender.net/subscribers/remove-group/)",
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
      description: "The ID of the group to remove subscribers from",
    },
    subscribers: {
      propDefinition: [
        sender,
        "subscriberId",
        ({ groupId }) => ({
          groupId,
        }),
      ],
      type: "string[]",
      label: "Subscribers",
      description: "Array of email addresses to remove from the group",
    },
  },
  async run({ $ }) {
    const response = await this.sender.removeSubscriberFromGroup({
      $,
      groupId: this.groupId,
      data: {
        subscribers: parseObject(this.subscribers),
      },
    });

    const {
      message: {
        subscribers_remove_tag_group: removed,
        non_existing_subscribers: nonExisting,
        invalid_emails: invalidEmails,
        subscribers_without_group_already: alreadyRemoved,
      },
    } = response;
    let summary = "";
    if (removed?.length > 0) {
      summary += `Successfully removed ${removed?.length || 0} subscriber(s) from group.\n`;
    }
    if (alreadyRemoved?.length > 0) {
      summary += `${alreadyRemoved?.length || 0} subscriber(s) were already removed from the group.\n`;
    }
    if (nonExisting?.length > 0) {
      summary += `${nonExisting?.length || 0} subscriber(s) were not found\n`;
    }
    if (invalidEmails?.length > 0) {
      summary += `${invalidEmails?.length || 0} subscriber(s) had invalid emails`;
    }

    $.export("$summary", summary);

    return response;
  },
};

