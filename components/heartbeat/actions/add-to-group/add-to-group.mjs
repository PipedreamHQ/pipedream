import { parseObject } from "../../common/utils.mjs";
import heartbeat from "../../heartbeat.app.mjs";

export default {
  key: "heartbeat-add-to-group",
  name: "Add To Group",
  description: "Add user(s) to a Heartbeat group. [See the documentation](https://heartbeat.readme.io/reference/addtogroup)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    heartbeat,
    groupID: {
      propDefinition: [
        heartbeat,
        "groupID",
      ],
    },
    emails: {
      propDefinition: [
        heartbeat,
        "emails",
      ],
    },
    shouldRemoveFromSiblingGroups: {
      type: "boolean",
      label: "Should Remove From Sibling Groups",
      description: "If true, the users will be removed from any other groups that share a parent group with the selected group. Useful when moving users between different stages",
      default: false,
    },
  },
  async run({ $ }) {
    const parsedEmails = parseObject(this.emails);
    const response = await this.heartbeat.addToGroup({
      $,
      groupID: this.groupID,
      data: {
        emails: parsedEmails,
        shouldRemoveFromSiblingGroups: this.shouldRemoveFromSiblingGroups,
      },
    });

    $.export("$summary", `Added ${parsedEmails.length} user(s) to group ${this.groupID}.`);
    return response;
  },
};

