import dex from "../../dex.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "dex-create-reminder",
  name: "Create Reminder",
  description: "Generates a new reminder within the Dex system. [See the documentation](https://guide.getdex.com/dex-user-api/post-reminder)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dex,
    text: {
      type: "string",
      label: "Text",
      description: "Text of the reminder",
    },
    isComplete: {
      type: "boolean",
      label: "IsComplete",
      description: "Whether the reminder is completed",
      optional: true,
    },
    dueAtDate: {
      type: "string",
      label: "Due at Date",
      description: "The date of the reminder in ISO 8601 format (`2023-05-19T01:03:27.083Z`)",
      optional: true,
    },
    contactIds: {
      propDefinition: [
        dex,
        "contactIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dex.createReminder({
      $,
      data: {
        reminder: {
          text: this.text,
          is_complete: this.isComplete,
          due_at_date: this.dueAtDate || utils.getCurrentDatetime(),
          reminders_contacts: this.contactIds?.length
            ? {
              data: utils.buildContactData(this.contactIds),
            }
            : undefined,
        },
      },
    });
    $.export("$summary", `Successfully created reminder with ID: ${response.insert_reminders_one.id}`);
    return response;
  },
};
