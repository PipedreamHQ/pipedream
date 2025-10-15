import rex from "../../rex.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "rex-create-reminder",
  name: "Create Reminder",
  description: "Creates a new reminder in Rex. [See the documentation](https://api-docs.rexsoftware.com/service/reminders#operation/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rex,
    reminderType: {
      type: "string",
      label: "Reminder Type",
      description: "The type of lead",
      options: constants.REMINDER_TYPE_OPTIONS,
    },
    remindeeId: {
      propDefinition: [
        rex,
        "userId",
      ],
    },
    date: {
      type: "string",
      label: "Reminder Date",
      description: "The reminder date. Example: `2019-12-30`",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the reminder",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the reminder",
      optional: true,
      options: constants.PRIORITY_OPTIONS,
    },
    propertyId: {
      propDefinition: [
        rex,
        "propertyId",
      ],
    },
    contactId: {
      propDefinition: [
        rex,
        "contactId",
      ],
      optional: true,
    },
    listingId: {
      propDefinition: [
        rex,
        "listingId",
      ],
    },
  },
  async run({ $ }) {
    if (!this.contactId && !this.propertyId && !this.listingId) {
      throw new ConfigurationError("At least one of `contactId`, `propertyId`, or `listingId` must be specified.");
    }

    const data = {
      data: {
        reminder_type: {
          id: this.reminderType,
        },
        remindee: {
          id: this.remindeeId,
          type: "user",
        },
        reminder_date: this.date,
        reminder_description: this.description,
        priority: this.priority
          ? {
            id: this.priority,
          }
          : undefined,
        property: this.propertyId
          ? {
            id: this.propertyId,
          }
          : undefined,
        contact: this.contactId
          ? {
            id: this.contactId,
          }
          : undefined,
        listing: this.listingId
          ? {
            id: this.listingId,
          }
          : undefined,
      },
    };

    const { result } = await this.rex.createReminder({
      data,
      $,
    });

    if (result?.id) {
      $.export("$summary", `Successfully created reminder with ID ${result.id}.`);
    }

    return result;
  },
};
