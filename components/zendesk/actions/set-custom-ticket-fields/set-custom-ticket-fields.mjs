import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-set-custom-ticket-fields",
  name: "Set Custom Ticket Fields",
  description: "Sets one or more custom field values on a ticket. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#update-ticket).",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Array of custom field objects. Each item should be formatted as `{\"id\": \"field_id\", \"value\": \"field_value\"}`. Example: `{\"id\": \"23129751115165\", \"value\": \"ABCDE\"}`",
    },
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
  },
  methods: {
    updateTicket({
      ticketId, ...args
    } = {}) {
      return this.app.update({
        path: `/tickets/${ticketId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      ticketId,
      customFields,
      customSubdomain,
    } = this;

    // Parse custom fields from string array to objects
    const parsedCustomFields = parseObject(customFields);

    if (!Array.isArray(parsedCustomFields)) {
      throw new ConfigurationError("Custom Fields must be an array of custom field objects");
    }

    // Validate custom fields structure
    parsedCustomFields.forEach((field, index) => {
      if (!field.id) {
        throw new ConfigurationError(`Custom field at index ${index} is missing required "id" property`);
      }
      if (field.value === undefined) {
        throw new ConfigurationError(`Custom field at index ${index} is missing required "value" property`);
      }
    });

    const response = await this.updateTicket({
      step,
      ticketId,
      customSubdomain,
      data: {
        ticket: {
          custom_fields: parsedCustomFields,
        },
      },
    });

    step.export("$summary", `Successfully updated ${parsedCustomFields.length} custom field(s) on ticket ${response.ticket.id}`);

    return response;
  },
};
