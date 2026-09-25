import { ConfigurationError } from "@pipedream/platform";
import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-send-template-message",
  name: "Send Template Message",
  description: "Send one of your saved message templates to a contact, immediately or at a future date. [See the documentation](https://setsmart.io/api-documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    setsmart,
    templateName: {
      type: "string",
      label: "Template Name",
      description: "Name of the message template as saved in your SetSmart workspace",
    },
    contactId: {
      propDefinition: [
        setsmart,
        "contactId",
      ],
      optional: false,
    },
    scheduleType: {
      type: "string",
      label: "Schedule Type",
      description: "Send the message right away or schedule it",
      options: [
        {
          label: "Immediate",
          value: "immediate",
        },
        {
          label: "Scheduled",
          value: "scheduled",
        },
      ],
      default: "immediate",
    },
    scheduledDateTime: {
      type: "string",
      label: "Scheduled Date Time",
      description: "When to send the message, as an ISO 8601 timestamp (e.g. `2026-01-15T09:00:00Z`). Required when **Schedule Type** is `scheduled`.",
      optional: true,
    },
    assistantId: {
      propDefinition: [
        setsmart,
        "assistantId",
      ],
    },
  },
  async run({ $ }) {
    if (this.scheduleType === "scheduled" && !this.scheduledDateTime) {
      throw new ConfigurationError("**Scheduled Date Time** is required when **Schedule Type** is `scheduled`.");
    }

    const response = await this.setsmart.sendTemplate({
      $,
      data: {
        template_name: this.templateName,
        contact_id: this.contactId,
        schedule_type: this.scheduleType,
        scheduled_date_time: this.scheduledDateTime,
        assistant_id: this.assistantId,
      },
    });

    $.export("$summary", `Successfully sent the template ${this.templateName}`);
    return response;
  },
};
